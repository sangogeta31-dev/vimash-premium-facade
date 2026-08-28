import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { VerifiedOrderContext } from "@/lib/razorpay.server";

type PaymentRecord = {
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  paymentStatus: "pending" | "paid";
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
  items: VerifiedOrderContext["items"];
  amountPaise: number;
  currency: string;
  paidAt: string | null;
};

function toRow(record: PaymentRecord) {
  return {
    razorpay_order_id: record.razorpayOrderId,
    razorpay_payment_id: record.razorpayPaymentId,
    payment_status: record.paymentStatus,
    customer_first_name: record.customerFirstName,
    customer_last_name: record.customerLastName,
    customer_phone: record.customerPhone,
    delivery_address: record.deliveryAddress,
    delivery_city: record.deliveryCity,
    delivery_state: record.deliveryState,
    delivery_pincode: record.deliveryPincode,
    items: record.items,
    amount_paise: record.amountPaise,
    currency: record.currency,
    paid_at: record.paidAt,
  };
}

export async function createPendingPaymentRecord(context: VerifiedOrderContext) {
  return supabaseAdmin.from("payment_orders").upsert(
    toRow({
      razorpayOrderId: context.razorpayOrderId,
      razorpayPaymentId: null,
      paymentStatus: "pending",
      customerFirstName: context.customerFirstName,
      customerLastName: context.customerLastName,
      customerPhone: context.customerPhone,
      deliveryAddress: context.deliveryAddress,
      deliveryCity: context.deliveryCity,
      deliveryState: context.deliveryState,
      deliveryPincode: context.deliveryPincode,
      items: context.items,
      amountPaise: context.amountPaise,
      currency: context.currency,
      paidAt: null,
    }),
    { onConflict: "razorpay_order_id" },
  );
}

/**
 * Records a client-confirmed payment idempotently. The signed order context
 * supplies the customer/order details, while the unique Razorpay order and
 * payment ids prevent duplicate records.
 */
export async function recordPaidPayment(
  context: VerifiedOrderContext,
  paymentId: string,
) {
  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("payment_orders")
    .select("razorpay_payment_id, payment_status")
    .eq("razorpay_order_id", context.razorpayOrderId)
    .maybeSingle();

  if (lookupError) return { error: lookupError };
  if (
    existing?.payment_status === "paid" &&
    existing.razorpay_payment_id === paymentId
  ) {
    return { error: null };
  }
  if (existing?.payment_status === "paid") {
    return {
      error: new Error("A different payment is already recorded for this order."),
    };
  }

  const { data: updated, error } = await supabaseAdmin
    .from("payment_orders")
    .update({
      razorpay_payment_id: paymentId,
      payment_status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("razorpay_order_id", context.razorpayOrderId)
    .eq("payment_status", "pending")
    .select("id")
    .maybeSingle();

  if (!error && updated) return { error: null };

  // A legacy database may not have a pending row yet. The signed context is
  // still sufficient to safely create the paid record as a recovery fallback.
  const { error: insertError } = await supabaseAdmin
    .from("payment_orders")
    .upsert(
      toRow({
        razorpayOrderId: context.razorpayOrderId,
        razorpayPaymentId: paymentId,
        paymentStatus: "paid",
        customerFirstName: context.customerFirstName,
        customerLastName: context.customerLastName,
        customerPhone: context.customerPhone,
        deliveryAddress: context.deliveryAddress,
        deliveryCity: context.deliveryCity,
        deliveryState: context.deliveryState,
        deliveryPincode: context.deliveryPincode,
        items: context.items,
        amountPaise: context.amountPaise,
        currency: context.currency,
        paidAt: new Date().toISOString(),
      }),
      { onConflict: "razorpay_order_id" },
    );

  return { error: insertError };
}

/** Reconciles a signed `payment.captured` webhook against the pending order. */
export async function reconcileCapturedPayment(input: {
  orderId: string;
  paymentId: string;
  amountPaise: number;
  currency: string;
  paidAt: string;
}): Promise<"paid" | "already_paid" | "missing" | "mismatch" | "error"> {
  const { data: order, error: lookupError } = await supabaseAdmin
    .from("payment_orders")
    .select("razorpay_payment_id, payment_status, amount_paise, currency")
    .eq("razorpay_order_id", input.orderId)
    .maybeSingle();

  if (lookupError) return "error";
  if (!order) return "missing";
  if (
    order.payment_status === "paid" &&
    order.razorpay_payment_id === input.paymentId
  ) {
    return "already_paid";
  }
  if (
    order.payment_status !== "pending" ||
    order.razorpay_payment_id ||
    order.amount_paise !== input.amountPaise ||
    order.currency !== input.currency
  ) {
    return "mismatch";
  }

  const { error } = await supabaseAdmin
    .from("payment_orders")
    .update({
      razorpay_payment_id: input.paymentId,
      payment_status: "paid",
      paid_at: input.paidAt,
    })
    .eq("razorpay_order_id", input.orderId)
    .eq("payment_status", "pending");

  return error ? "error" : "paid";
}
