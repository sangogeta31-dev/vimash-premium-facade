import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

/**
 * Server-side auth check for route guards.
 * Returns { authenticated: true } if the request carries a valid Supabase JWT,
 * otherwise { authenticated: false }.
 */
export const checkAuthSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ authenticated: boolean }> => {
    try {
      const SUPABASE_URL = process.env["SUPABASE_URL"];
      const SUPABASE_PUBLISHABLE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"];

      if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
        return { authenticated: false };
      }

      const request = getRequest();
      const authHeader = request?.headers?.get("authorization");

      if (!authHeader?.startsWith("Bearer ")) {
        return { authenticated: false };
      }

      const token = authHeader.replace("Bearer ", "");
      if (!token || token.split(".").length !== 3) {
        return { authenticated: false };
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        global: {
          fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
          headers: { Authorization: `Bearer ${token}` },
        },
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      });

      const { data, error } = await supabase.auth.getClaims(token);
      if (error || !data?.claims?.sub) {
        return { authenticated: false };
      }

      return { authenticated: true };
    } catch {
      return { authenticated: false };
    }
  },
);

/**
 * Server-side admin role check for admin route guards.
 * Returns { isAdmin: true } if the user is authenticated AND has admin role,
 * otherwise { isAdmin: false }.
 * This function verifies admin role using server-side admin client to prevent
 * privilege escalation attacks.
 */
export const checkAdminRole = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ isAdmin: boolean }> => {
    try {
      const SUPABASE_URL = process.env["SUPABASE_URL"];
      const SUPABASE_PUBLISHABLE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"];

      if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
        return { isAdmin: false };
      }

      const request = getRequest();
      const authHeader = request?.headers?.get("authorization");

      if (!authHeader?.startsWith("Bearer ")) {
        return { isAdmin: false };
      }

      const token = authHeader.replace("Bearer ", "");
      if (!token || token.split(".").length !== 3) {
        return { isAdmin: false };
      }

      // Verify the token before trusting its user id. Do not decode the JWT
      // payload directly: decoding checks no signature.
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const {
        data: { user },
        error: userError,
      } = await supabaseAdmin.auth.getUser(token);

      if (userError || !user) {
        return { isAdmin: false };
      }

      // Query with the service account. `has_role` intentionally requires
      // auth.uid() to match, so calling that database function as service_role
      // would always return false and redirect real admins to the home page.
      const { data: roles, error } = await supabaseAdmin
        .from("user_roles")
        .select("id")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .limit(1);

      if (error) {
        console.error("[Auth] Admin role check failed:", error);
        return { isAdmin: false };
      }

      return { isAdmin: (roles?.length ?? 0) > 0 };
    } catch (error) {
      console.error("[Auth] Admin role check error:", error);
      return { isAdmin: false };
    }
  },
);
