import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

type RazorpayWebhookEvent = {
  event?: unknown;
  payload?: {
    payment?: {
      entity?: {
        order_id?: unknown;
        id?: unknown;
        amount?: unknown;
        currency?: unknown;
      };
    };
  };
};

export const Route = createFileRoute("/api/razorpay/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const signature = request.headers.get("x-razorpay-signature");
        const { verifyWebhookSignature } = await import("@/lib/razorpay.server");

        if (!signature || !verifyWebhookSignature(body, signature)) {
          return jsonResponse({ error: "Unauthorized" }, 401);
        }

        let event: RazorpayWebhookEvent;
        try {
          event = JSON.parse(body);
        } catch {
          return jsonResponse({ error: "Invalid JSON" }, 400);
        }

        // Only captured payments represent money that should be fulfilled.
        if (event?.event !== "payment.captured") {
          return jsonResponse({ received: true });
        }

        const entity = event?.payload?.payment?.entity;
        const orderId = entity?.order_id;
        const paymentId = entity?.id;
        const amount = entity?.amount;
        const currency = entity?.currency;
        if (
          typeof orderId !== "string" ||
          typeof paymentId !== "string" ||
          typeof amount !== "number" ||
          !Number.isSafeInteger(amount) ||
          typeof currency !== "string"
        ) {
          return jsonResponse({ error: "Invalid payment payload" }, 400);
        }

        const { reconcileCapturedPayment } = await import(
          "@/lib/payment-record.server",
        );
        const result = await reconcileCapturedPayment({
          orderId,
          paymentId,
          amountPaise: amount,
          currency,
          paidAt: new Date().toISOString(),
        });

        if (result === "missing" || result === "error") {
          // Ask Razorpay to retry until the pending order is available or the
          // database recovers; acknowledging here would lose the payment.
          return jsonResponse({ error: "Payment order is not ready" }, 500);
        }
        if (result === "mismatch") {
          console.error("[Payment] Webhook order mismatch:", orderId, paymentId);
          return jsonResponse({ error: "Payment order mismatch" }, 400);
        }

        return jsonResponse({ received: true });
      },
    },
  },
});
