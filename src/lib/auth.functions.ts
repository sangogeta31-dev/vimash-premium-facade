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
