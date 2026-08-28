/**
 * Server-only Razorpay helper.
 * Secrets (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are read here and never leave the server.
 */
import Razorpay from "razorpay";
import crypto from "crypto";

export type VerifiedOrderContext = {
  razorpayOrderId: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
  items: Array<{
    product_slug: string;
    product_name: string;
    machine_hp: string;
    quantity: number;
    unit_price_paise: number;
    total_price_paise: number;
  }>;
  amountPaise: number;
  currency: string;
};

let _instance: InstanceType<typeof Razorpay> | undefined;

function getInstance(): InstanceType<typeof Razorpay> {
  if (!_instance) {
    const keyId = process.env["RAZORPAY_KEY_ID"];
    const keySecret = process.env["RAZORPAY_KEY_SECRET"];

    if (!keyId || !keySecret) {
      throw new Error(
        "Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variables.",
      );
    }

    _instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return _instance;
}

/**
 * Create a Razorpay order.
 * @param amountPaise  Amount in paise (₹1 = 100 paise)
 * @param receipt      A short receipt identifier (e.g. "order_<timestamp>")
 * @param notes        Optional metadata to attach to the order
 */
export async function createOrder(
  amountPaise: number,
  receipt: string,
  notes?: Record<string, string>,
): Promise<{ id: string; amount: number; currency: string }> {
  const razorpay = getInstance();

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes: notes ?? {},
  });

  return {
    id: order.id,
    amount: order.amount as number,
    currency: order.currency,
  };
}

/**
 * Verify the payment signature returned by Razorpay checkout.
 * Uses HMAC SHA256 with the key secret.
 *
 * @returns true if the signature is valid
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keySecret) return false;

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  // Constant-time comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex"),
    );
  } catch {
    return false;
  }
}

/** Verify Razorpay's server-to-server webhook signature over the raw body. */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const webhookSecret = process.env["RAZORPAY_WEBHOOK_SECRET"];
  if (!webhookSecret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex"),
    );
  } catch {
    return false;
  }
}

/**
 * Get the publishable Key ID (safe to send to the client).
 */
export function getKeyId(): string {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  if (!keyId) throw new Error("Missing RAZORPAY_KEY_ID");
  return keyId;
}

/**
 * Keeps checkout details out of the database until payment succeeds. The
 * browser receives this signed, opaque context and returns it with Razorpay's
 * payment response. A tampered context is rejected before anything is stored.
 */
export function createVerifiedOrderContext(context: VerifiedOrderContext): string {
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keySecret) throw new Error("Missing RAZORPAY_KEY_SECRET");

  const payload = Buffer.from(JSON.stringify(context)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", keySecret)
    .update(`vimash-payment-context:${payload}`)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function readVerifiedOrderContext(token: string): VerifiedOrderContext | null {
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  const separator = token.lastIndexOf(".");
  if (!keySecret || separator <= 0) return null;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`vimash-payment-context:${payload}`)
    .digest("hex");

  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"))) {
      return null;
    }

    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (
      !value ||
      typeof value !== "object" ||
      typeof value.razorpayOrderId !== "string" ||
      typeof value.customerFirstName !== "string" ||
      typeof value.customerLastName !== "string" ||
      typeof value.customerPhone !== "string" ||
      typeof value.deliveryAddress !== "string" ||
      typeof value.deliveryCity !== "string" ||
      typeof value.deliveryState !== "string" ||
      typeof value.deliveryPincode !== "string" ||
      !Array.isArray(value.items) ||
      typeof value.amountPaise !== "number" ||
      typeof value.currency !== "string"
    ) {
      return null;
    }

    return value as VerifiedOrderContext;
  } catch {
    return null;
  }
}
