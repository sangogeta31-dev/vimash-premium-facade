import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import logoMark from "@/assets/vimash-mark.png";
import { supabase } from "@/integrations/supabase/client";

export function AdminHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.session));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await queryClient.cancelQueries();
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError("Couldn't sign you out. Please try again.");
        setBusy(false);
        return;
      }
      queryClient.clear();
      navigate({ to: "/auth", replace: true });
    } catch {
      setError("Couldn't sign you out. Please try again.");
      setBusy(false);
    }
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4 lg:px-8">
        <Link to="/admin/leads" className="flex items-center gap-3">
          <img
            src={logoMark}
            alt="Vimash Manufacturing logo"
            width={512}
            height={512}
            className="h-10 w-10 shrink-0 object-contain"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-bold leading-tight text-charcoal">
              Lead Inbox
            </span>
            <span className="block truncate text-[0.62rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Vimash Admin
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {error && (
            <p role="alert" className="hidden text-xs font-medium text-destructive sm:block">
              {error}
            </p>
          )}
          {signedIn && (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={busy}
              aria-label="Log out"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-secondary disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              {busy ? "Logging out…" : "Logout"}
            </button>
          )}
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="px-5 pb-3 text-xs font-medium text-destructive sm:hidden lg:px-8"
        >
          {error}
        </p>
      )}
    </header>
  );
}
