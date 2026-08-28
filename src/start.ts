import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// Error handling middleware
const errorMiddleware = createMiddleware().server(async ({ next, request }) => {
  try {
    return await next();
  } catch (error) {
    // A browser can cancel an in-flight navigation when it immediately starts
    // another one. This is not an application failure and must not become 500.
    if (request.signal.aborted) return new Response(null, { status: 499 });
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

/**
 * Security headers middleware - adds comprehensive HTTP security headers
 * 
 * Headers implemented:
 * - X-Frame-Options: Prevents clickjacking attacks
 * - X-Content-Type-Options: Prevents MIME-type sniffing
 * - Referrer-Policy: Controls referrer information leakage
 * - X-XSS-Protection: Legacy XSS filter (for older browsers)
 * - Permissions-Policy: Restricts browser features
 * - Content-Security-Policy: Prevents XSS, injection attacks
 * - Strict-Transport-Security: Forces HTTPS (production only)
 * - Cross-Origin-*: Additional isolation for modern browsers
 */
const securityHeadersMiddleware = createMiddleware().server(async ({ next, request }) => {
  const response = await next();

  // Guard against undefined or null response
  if (!response) {
    console.error("securityHeadersMiddleware: No response from next()");
    return response;
  }

  // Handle non-Response objects (might be Vite/TanStack specific response format)
  // Just pass through if not a proper Response instance
  if (!(response instanceof Response)) {
    return response;
  }

  // Create a new response with the same body but mutable headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers)
  });

  // === Clickjacking Protection ===
  // Prevents site from being embedded in iframes
  newResponse.headers.set("X-Frame-Options", "DENY");

  // === MIME-Type Sniffing Protection ===
  // Prevents browsers from MIME-sniffing responses
  newResponse.headers.set("X-Content-Type-Options", "nosniff");

  // === Referrer Policy ===
  // Controls how much referrer information is included with requests
  newResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // === XSS Protection (Legacy) ===
  // Enables XSS filter in older browsers (IE, Edge Legacy)
  newResponse.headers.set("X-XSS-Protection", "1; mode=block");

  // === Permissions Policy ===
  // Restricts browser features the application doesn't need
  newResponse.headers.set(
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
      "ambient-light-sensor=()",
    ].join(", ")
  );

  // === Strict Transport Security (HSTS) ===
  // Forces HTTPS for 1 year, includes subdomains
  // Only apply in production or when HTTPS is available
  const isProduction = process.env["NODE_ENV"] === "production";
  if (isProduction) {
    newResponse.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // === Cross-Origin Policies ===
  // Additional isolation for modern browsers

  // Cross-Origin-Opener-Policy: Isolates browsing context
  // 'same-origin-allow-popups' allows OAuth popups while maintaining isolation
  newResponse.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

  // Cross-Origin-Resource-Policy: Controls resource loading from other origins
  // 'same-site' allows resources from same site but prevents cross-site embedding
  newResponse.headers.set("Cross-Origin-Resource-Policy", "same-site");

  // Razorpay Checkout runs in a cross-origin frame, so do not force a
  // Cross-Origin-Embedder-Policy that changes its request credentials.
  newResponse.headers.delete("Cross-Origin-Embedder-Policy");

  // === Content Security Policy (CSP) ===
  // Comprehensive policy to prevent XSS, injection, and other attacks
  const csp = [
    // Default fallback - only allow same-origin by default
    "default-src 'self'",

    // Scripts: TanStack Start needs unsafe-eval for client-side hydration.
    // Razorpay Checkout is loaded only on the checkout page.
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.razorpay.com",

    // Styles: Tailwind uses utility classes, needs unsafe-inline
    // Allow Google Fonts for typography
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

    // Images: Allow data URIs, HTTPS images, and blob for dynamic content
    "img-src 'self' data: https: blob:",

    // Fonts: Allow self-hosted and Google Fonts
    "font-src 'self' data: https://fonts.gstatic.com",

    // AJAX/WebSocket: Supabase (Realtime), Pincode API and Razorpay Checkout.
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.postalpincode.in https://*.razorpay.com",

    // Razorpay Checkout opens a trusted cross-origin payment frame.
    "frame-src https://*.razorpay.com",
    "frame-ancestors 'none'",

    // Objects: Disallow plugins (Flash, Java, etc.)
    "object-src 'none'",

    // Base URI: Prevent base tag injection
    "base-uri 'self'",

    // Forms: Only allow form submissions to same origin
    "form-action 'self'",

    // Upgrade insecure requests in production
    ...(isProduction ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  newResponse.headers.set("Content-Security-Policy", csp);

  return newResponse;
});

// CSRF Protection: Protects all server functions from cross-site request forgery attacks.
// This middleware validates request origin metadata on all server functions,
// preventing cross-site requests from triggering state-changing operations.
// Applies to: submitLead, lookupPincode, and all future server functions.
const csrfMiddleware = createCsrfMiddleware({
  // Only apply CSRF protection to server functions (not static assets or SSR)
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, securityHeadersMiddleware, csrfMiddleware],
}));
