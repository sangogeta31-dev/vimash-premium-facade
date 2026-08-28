import { AlertTriangle, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatTimeRemaining } from "@/hooks/use-session-timeout";

type SessionTimeoutWarningProps = {
  /**
   * Whether the warning dialog is open
   */
  open: boolean;
  
  /**
   * Time remaining in seconds before auto-logout
   */
  timeRemaining: number;
  
  /**
   * Callback when user chooses to extend session
   */
  onExtendSession: () => void;
};

/**
 * Warning dialog shown before session timeout
 * 
 * Displays countdown and allows user to extend their session
 * to prevent automatic logout due to inactivity.
 */
export function SessionTimeoutWarning({
  open,
  timeRemaining,
  onExtendSession,
}: SessionTimeoutWarningProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-2xl border-border sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="font-display text-xl font-bold text-charcoal dark:text-white">
                Session Expiring Soon
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Your session will expire due to inactivity. You will be automatically signed out in:
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 flex items-center justify-center gap-3 rounded-xl bg-muted p-6">
          <Clock className="h-8 w-8 text-amber-600 dark:text-amber-500" />
          <div className="text-center">
            <div className="font-mono text-4xl font-bold text-charcoal dark:text-white">
              {formatTimeRemaining(timeRemaining)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">minutes remaining</div>
          </div>
        </div>
        
        <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
          Click "Stay Signed In" to extend your session and continue working.
        </AlertDialogDescription>
        
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onExtendSession}
            className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Stay Signed In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
