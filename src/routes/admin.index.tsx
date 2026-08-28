import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkAuthSession, checkAdminRole } from "@/lib/auth.functions";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Vimash Manufacturing" },
      { name: "description", content: "Admin entry point for the Vimash Lead Inbox." },
      { property: "og:title", content: "Admin — Vimash Manufacturing" },
      { property: "og:description", content: "Admin entry point for the Vimash Lead Inbox." },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async () => {
    try {
      // First check authentication
      const { authenticated } = await checkAuthSession();
      if (!authenticated) throw redirect({ to: "/auth" });
      
      // Then check admin role - server-side verification
      const { isAdmin } = await checkAdminRole();
      if (!isAdmin) {
        // Non-admin authenticated users get redirected to home
        throw redirect({ to: "/" });
      }
    } catch (e) {
      // Re-throw redirect, catch everything else
      if (e instanceof Response || (e && typeof e === "object" && "to" in e)) throw e;
      throw redirect({ to: "/auth" });
    }
  },
  component: AdminEntry,
});

function AdminEntry() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      navigate({ to: data.session ? "/admin/leads" : "/auth", replace: true });
    });
  }, [navigate]);

  return (
    <div className="grid min-h-[50vh] place-items-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
