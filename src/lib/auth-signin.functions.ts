import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limiter.server";

/**
 * Sign-in request validation schema
 */
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type SignInResult =
  | { success: true }
  | { success: false; error: string; rateLimited?: boolean };

/**
 * Server-side sign-in attempt guard.
 *
 * Password authentication itself must run in the browser so Supabase can
 * persist the session in that browser's local storage. A server function has
 * a separate runtime and cannot establish that browser session.
 * 
 * Security features:
 * - CSRF protection (via global middleware in src/start.ts)
 * - Rate limiting by IP (5 attempts per 15 minutes)
 * - Rate limiting by email (5 attempts per 15 minutes)
 * - Dual-layer protection prevents credential stuffing
 * - Input validation via Zod schema
 * 
 * Rate Limiting Strategy:
 * - IP-based: Prevents brute force from single source
 * - Email-based: Prevents distributed attacks on specific account
 * - Both limits must pass for request to proceed
 * - 15-minute window balances security with UX
 * - 5 attempts is industry standard for authentication
 * 
 * Error handling:
 * - Rate limited: "Too many login attempts"
 * 
 * @returns whether the browser may continue with the Supabase sign-in request
 */
export const signInUser = createServerFn({ method: "POST" })
  .validator((data: unknown) => signInSchema.parse(data))
  .handler(async ({ data }): Promise<SignInResult> => {
    try {
      // Rate limit 1: By IP address (5 attempts per 15 minutes)
      // Prevents brute force attacks from a single source
      if (!rateLimit("signIn", 5, 15 * 60 * 1000)) {
        return {
          success: false,
          error:
            "Too many login attempts from your location. Please try again in 15 minutes.",
          rateLimited: true,
        };
      }

      // Rate limit 2: By email address (5 attempts per 15 minutes)
      // Prevents distributed credential stuffing attacks on specific accounts
      // Normalize email to lowercase for consistent rate limiting
      const normalizedEmail = data.email.toLowerCase().trim();
      const emailKey = `signIn:email:${normalizedEmail}`;

      if (!rateLimit(emailKey, 5, 15 * 60 * 1000)) {
        return {
          success: false,
          error:
            "Too many login attempts for this account. Please try again in 15 minutes.",
          rateLimited: true,
        };
      }

      // The caller now signs in through the browser Supabase client, which
      // writes the session to local storage for the protected admin routes.
      return { success: true };
    } catch (error) {
      // Catch validation errors or unexpected errors
      if (error instanceof z.ZodError) {
        // Return first validation error
        const firstError = error.errors[0];
        return {
          success: false,
          error: firstError?.message ?? "Invalid input",
        };
      }

      // Generic error for unexpected issues
      console.error("[Auth] Sign-in error:", error);
      return {
        success: false,
        error: "An error occurred during sign-in. Please try again.",
      };
    }
  });

/**
 * Helper: Normalize email for consistent rate limiting
 * 
 * @param email - Email address to normalize
 * @returns Normalized email (lowercase, trimmed)
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Helper: Check if error is rate limit error
 * 
 * @param result - Sign-in result
 * @returns true if rate limited
 */
export function isRateLimited(result: SignInResult): boolean {
  return !result.success && result.rateLimited === true;
}
