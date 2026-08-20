import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limiter.server";

const pincodeSchema = z.object({ pincode: z.string().regex(/^\d{6}$/) });

export type PincodeLookup = { state: string | null; city: string | null };

/** Public: resolves an Indian pincode to its state and district via India Post. */
export const lookupPincode = createServerFn({ method: "POST" })
  .validator((data: unknown) => pincodeSchema.parse(data))
  .handler(async ({ data }): Promise<PincodeLookup> => {
    // Rate limit: 30 lookups per IP per 5 minutes
    if (!rateLimit("lookupPincode", 30, 5 * 60 * 1000)) {
      return { state: null, city: null };
    }

    try {
      // 10 second timeout for pincode API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`https://api.postalpincode.in/pincode/${data.pincode}`, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) return { state: null, city: null };
      const json = (await res.json()) as Array<{
        Status?: string;
        PostOffice?: Array<{ State?: string; District?: string }> | null;
      }>;
      const first = json?.[0];
      const office = first?.PostOffice?.[0];
      if (first?.Status !== "Success" || !office) return { state: null, city: null };
      return { state: office.State ?? null, city: office.District ?? null };
    } catch {
      return { state: null, city: null };
    }
  });
