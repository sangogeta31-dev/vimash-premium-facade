import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
function requestAbortedResponse(): Response {
  // 499 is the conventional status for a client-closed request. The client
  // has already disconnected, so there is no useful response body to send.
  return new Response(null, { status: 499 });
}

async function normalizeCatastrophicSsrResponse(
  response: Response,
  request: Request,
): Promise<Response> {
  if (request.signal.aborted) return requestAbortedResponse();
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Append comprehensive security headers to every outgoing response.
 * 
 * This is a fallback layer for server.ts responses that don't go through
 * the TanStack Start middleware (e.g., static assets, error pages).
 * 
 * Headers should match those in src/start.ts for consistency.
 */
function addSecurityHeaders(response: Response): Response {
  const h = response.headers;
  
  // === Clickjacking Protection ===
  h.set("X-Frame-Options", "DENY");
  
  // === MIME-Type Sniffing Protection ===
  h.set("X-Content-Type-Options", "nosniff");
  
  // === Referrer Policy ===
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // === XSS Protection (Legacy) ===
  h.set("X-XSS-Protection", "1; mode=block");
  
  // === Permissions Policy ===
  h.set(
    "Permissions-Policy",
    [
      "geolocation=()",
      "microphone=()",
      "camera=()",
      "payment=(self \"https://*.razorpay.com\")",
      "usb=()",
      "magnetometer=(self \"https://*.razorpay.com\")",
      "gyroscope=(self \"https://*.razorpay.com\")",
      "accelerometer=(self \"https://*.razorpay.com\")",
    ].join(", ")
  );
  
  // === Strict Transport Security (HSTS) ===
  const isProduction = process.env["NODE_ENV"] === "production";
  if (isProduction) {
    h.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  
  // === Cross-Origin Policies ===
  h.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  h.set("Cross-Origin-Resource-Policy", "same-site");
  // Razorpay Checkout runs in a cross-origin frame. Leaving this header unset
  // preserves the third-party request behaviour it requires.
  h.delete("Cross-Origin-Embedder-Policy");
  
  // === Content Security Policy ===
  // Only set if not already present (TanStack Start middleware may have set it)
  if (!h.has("Content-Security-Policy")) {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.razorpay.com https://www.googletagmanager.com https://googleads.g.doubleclick.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.postalpincode.in https://*.razorpay.com https://www.google.com https://ad.doubleclick.net",
      "frame-src https://*.razorpay.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      ...(isProduction ? ["upgrade-insecure-requests"] : []),
    ].join("; ");
    
    h.set("Content-Security-Policy", csp);
  }
  
  return response;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return addSecurityHeaders(await normalizeCatastrophicSsrResponse(response, request));
    } catch (error) {
      if (request.signal.aborted) return addSecurityHeaders(requestAbortedResponse());
      console.error(error);
      const errorResponse = new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
      return addSecurityHeaders(errorResponse);
    }
  },
};
