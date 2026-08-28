/**
 * Payment server functions — called by the checkout form.
 *
 * Flow:
 *  1. Client calls createPaymentOrder with validated cart + customer details
 *  2. Server re-validates prices, creates a Razorpay order, returns order ID + key
 *  3. Client opens Razorpay checkout modal
 *  4. On payment success, client calls verifyPayment with IDs + signature
 *  5. Server verifies HMAC signature → returns success/failure
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { products } from "@/data/products";
import { rateLimit } from "@/lib/rate-limiter.server";
import { sanitizeForStorage } from "@/lib/sanitize";

/* ─── Schemas ─────────────────────────────────────────────────────────────── */

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productSlug: z.string().min(1).max(100),
        quantity: z.number().int().min(1).max(100),
      }),
    )
    .min(1)
    .max(50),
  customer: z.object({
    phone: z.string().trim().min(10).max(15),
    firstName: z.string().trim().min(2).max(50),
    lastName: z.string().trim().max(50).optional().default(""),
    address: z.string().trim().min(5).max(250),
    city: z.string().trim().min(2).max(60),
    state: z.string().min(1),
    pincode: z.string().trim().regex(/^\d{6}$/),
  }),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  order_context: z.string().min(1).max(10_000),
});

/* ─── Price parser (same as cart.functions.ts) ────────────────────────────── */

function parsePriceToFractional(priceStr: string): number {
  // Strip everything that isn't a digit: ₹, commas, spaces, Unicode variants
  const cleaned = priceStr.replace(/[^0-9]/g, "");
  const rupees = Number(cleaned);
  if (!Number.isFinite(rupees) || rupees < 0) return 0;
  return Math.round(rupees * 100);
}

/* ─── Create Razorpay Order ───────────────────────────────────────────────── */

export const createPaymentOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) => createOrderSchema.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      orderId?: string;
      amount?: number;
      currency?: string;
      keyId?: string;
      orderContext?: string;
      error?: string;
    }> => {
      // Rate limit: 5 order attempts per IP per 15 minutes
      if (!rateLimit("createOrder", 5, 15 * 60 * 1000)) {
        return { success: false, error: "Too many attempts. Please try again later." };
      }

      // Re-validate cart prices server-side (NEVER trust client prices)
      let totalPaise = 0;
      const orderItems: Array<{
        product_slug: string;
        product_name: string;
        machine_hp: string;
        quantity: number;
        unit_price_paise: number;
        total_price_paise: number;
      }> = [];

      for (const item of data.items) {
        const product = products.find((p) => p.slug === item.productSlug);
        if (!product) {
          return { success: false, error: `Product "${item.productSlug}" not found.` };
        }

        const pricePaise = parsePriceToFractional(product.price);
        if (pricePaise === 0) {
          return {
            success: false,
            error: `Price not available for "${product.name}".`,
          };
        }

        totalPaise += pricePaise * item.quantity;
        orderItems.push({
          product_slug: product.slug,
          product_name: product.name,
          machine_hp: product.hp,
          quantity: item.quantity,
          unit_price_paise: pricePaise,
          total_price_paise: pricePaise * item.quantity,
        });
      }

      if (totalPaise < 100) {
        return { success: false, error: "Order amount too low." };
      }

      // Create Razorpay order
      try {
        const { createOrder, createVerifiedOrderContext, getKeyId } = await import(
          "@/lib/razorpay.server"
        );

        const receipt = `vmsh_${Date.now()}`;
        const order = await createOrder(totalPaise, receipt, {
          customer_name: `${data.customer.firstName} ${data.customer.lastName}`.trim(),
          customer_phone: data.customer.phone,
          customer_city: data.customer.city,
          customer_state: data.customer.state,
          customer_pincode: data.customer.pincode,
          items: orderItems
            .map((item) => `${item.product_name} (${item.machine_hp} HP) x${item.quantity}`)
            .join(", ")
            .slice(0, 500),
        });

        // Keep a server-side copy for webhook recovery, and send only its
        // signed representation to the browser.
        const verifiedContext = {
          razorpayOrderId: order.id,
          customerFirstName: sanitizeForStorage(data.customer.firstName),
          customerLastName: sanitizeForStorage(data.customer.lastName),
          customerPhone: data.customer.phone.trim(),
          deliveryAddress: sanitizeForStorage(data.customer.address),
          deliveryCity: sanitizeForStorage(data.customer.city),
          deliveryState: sanitizeForStorage(data.customer.state),
          deliveryPincode: data.customer.pincode,
          items: orderItems,
          amountPaise: order.amount,
          currency: order.currency,
        };
        const orderContext = createVerifiedOrderContext(verifiedContext);

        // Persist the signed order details before opening checkout. This gives
        // the webhook a durable record even if the browser closes after payment.
        const { createPendingPaymentRecord } = await import(
          "@/lib/payment-record.server"
        );
        const { error: pendingRecordError } = await createPendingPaymentRecord(verifiedContext);
        if (pendingRecordError) {
          console.error("[Payment] Could not create pending payment record:", pendingRecordError.message);
          return {
            success: false,
            error: "Unable to prepare the order. Please try again.",
          };
        }

        return {
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: getKeyId(),
          orderContext,
        };
      } catch (error: any) {
        console.error("[Payment] Razorpay order creation failed:", error?.message ?? error);
        if (error?.statusCode) {
          console.error("[Payment] Razorpay status:", error.statusCode, error?.error);
        }
        return {
          success: false,
          error: error?.message ?? "Payment gateway error. Please try again or contact us.",
        };
      }
    },
  );

/* ─── Verify Razorpay Payment ─────────────────────────────────────────────── */

export const verifyPayment = createServerFn({ method: "POST" })
  .validator((data: unknown) => verifyPaymentSchema.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{ verified: boolean; error?: string }> => {
      try {
        const { readVerifiedOrderContext, verifyPaymentSignature } = await import(
          "@/lib/razorpay.server"
        );

        const isValid = verifyPaymentSignature(
          data.razorpay_order_id,
          data.razorpay_payment_id,
          data.razorpay_signature,
        );

        if (!isValid) {
          console.error(
            "[Payment] Signature verification failed for order:",
            data.razorpay_order_id,
          );
          return { verified: false, error: "Payment verification failed." };
        }

        const orderContext = readVerifiedOrderContext(data.order_context);
        if (!orderContext || orderContext.razorpayOrderId !== data.razorpay_order_id) {
          return { verified: false, error: "Payment order details could not be verified." };
        }

        const { recordPaidPayment } = await import("@/lib/payment-record.server");
        const { error: recordPaymentError } = await recordPaidPayment(
          orderContext,
          data.razorpay_payment_id,
        );

        if (recordPaymentError) {
          console.error(
            "[Payment] Could not store verified payment:",
            recordPaymentError.message,
          );
          return { verified: false, error: "Payment was received but could not be recorded. Please contact support." };
        }

        return { verified: true };
      } catch (error) {
        console.error("[Payment] Verification error:", error);
        return { verified: false, error: "Verification error. Please contact support." };
      }
    },
  );
