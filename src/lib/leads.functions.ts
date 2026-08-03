import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const idSchema = z.object({ leadId: z.string().uuid() });

/** Called right after a website enquiry is stored. Public by design. */
export const syncLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const { syncLeadById } = await import("@/lib/odoo.server");
    return syncLeadById(data.leadId);
  });

/** Admin-only manual retry from the Lead Inbox. */
export const retryLeadSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { syncLeadById } = await import("@/lib/odoo.server");
    return syncLeadById(data.leadId);
  });
