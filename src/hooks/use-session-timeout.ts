import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Session timeout configuration
 */
const ADMIN_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes for admin sessions
const WARNING_BEFORE_TIMEOUT_MS = 2 * 60 * 1000; // Show warning 2 minutes before timeout

/**
 * Activity events that reset the timeout
 */
const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "click",
] as const;

export type SessionTimeoutOptions = {
  /**
   * Timeout duration in milliseconds
   * Defaults to 30 minutes for admin, 1 hour for users
   */
  timeoutMs?: number;
  
  /**
   * Show warning before timeout (in milliseconds before expiry)
   * Defaults to 2 minutes before timeout
   */
  warningBeforeMs?: number;
  
  /**
   * Callback when session is about to timeout (warning shown)
   */
  onWarning?: () => void;
  
  /**
   * Callback when session times out
   */
  onTimeout?: () => void;
  
  /**
   * Enable session timeout (default: true)
   */
  enabled?: boolean;
};

export type SessionTimeoutState = {
  /**
   * Time remaining until timeout (in seconds)
   */
  timeRemaining: number;
  
  /**
   * Whether warning is currently shown
   */
  showingWarning: boolean;
  
  /**
   * Manually reset the timeout timer
   */
  resetTimeout: () => void;
  
  /**
   * Manually extend the session (dismiss warning)
   */
  extendSession: () => void;
};

/**
 * Hook for automatic session timeout with inactivity detection
 * 
 * Security features:
 * - Auto-logout after inactivity period
 * - Warning before timeout (allows user to extend)
 * - Activity detection (mouse, keyboard, touch)
 * - Configurable timeouts for different user types
 * - Clean logout on timeout
 * 
 * Usage:
 * ```typescript
 * // In admin pages
 * const { timeRemaining, showingWarning, extendSession } = useSessionTimeout({
 *   onWarning: () => console.log("Session expiring soon"),
 *   onTimeout: () => console.log("Session expired"),
 * });
 * ```
 * 
 * @param options - Configuration options
 * @returns Session timeout state and controls
 */
export function useSessionTimeout(options: SessionTimeoutOptions = {}): SessionTimeoutState {
  const navigate = useNavigate();
  
  const {
    timeoutMs = ADMIN_TIMEOUT_MS,
    warningBeforeMs = WARNING_BEFORE_TIMEOUT_MS,
    onWarning,
    onTimeout,
    enabled = true,
  } = options;
  
  const [timeRemaining, setTimeRemaining] = useState<number>(timeoutMs / 1000);
  const [showingWarning, setShowingWarning] = useState(false);
  
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const showingWarningRef = useRef(false);
  const onWarningRef = useRef(onWarning);
  const onTimeoutRef = useRef(onTimeout);
  onWarningRef.current = onWarning;
  onTimeoutRef.current = onTimeout;
  
  /**
   * Handle session timeout - sign out and redirect
   */
  const handleTimeout = useCallback(async () => {
    console.log("[SessionTimeout] Session expired due to inactivity");
    
    // Clear all timers
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (warningTimeoutIdRef.current) clearTimeout(warningTimeoutIdRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    // Call user callback
    onTimeoutRef.current?.();
    
    // Sign out
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("[SessionTimeout] Error signing out:", error);
    }
    
    // Redirect to auth page
    navigate({ to: "/auth" });
  }, [navigate]);
  
  /**
   * Show warning before timeout
   */
  const showWarning = useCallback(() => {
    console.log("[SessionTimeout] Showing inactivity warning");
    showingWarningRef.current = true;
    setShowingWarning(true);
    onWarningRef.current?.();
    
    // Start countdown interval to update time remaining
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = Math.max(0, Math.floor((timeoutMs - elapsed) / 1000));
      setTimeRemaining(remaining);
      
      // Stop countdown when reached zero
      if (remaining === 0) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      }
    }, 1000);
  }, [timeoutMs]);
  
  /**
   * Reset timeout timer (called on user activity)
   */
  const resetTimeout = useCallback(() => {
    if (!enabled) return;
    
    lastActivityRef.current = Date.now();
    showingWarningRef.current = false;
    setTimeRemaining(timeoutMs / 1000);
    setShowingWarning(false);
    
    // Clear existing timers
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (warningTimeoutIdRef.current) clearTimeout(warningTimeoutIdRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    // Set warning timer
    const warningTime = timeoutMs - warningBeforeMs;
    warningTimeoutIdRef.current = setTimeout(() => {
      showWarning();
    }, warningTime);
    
    // Set timeout timer
    timeoutIdRef.current = setTimeout(() => {
      handleTimeout();
    }, timeoutMs);
  }, [enabled, timeoutMs, warningBeforeMs, showWarning, handleTimeout]);
  
  /**
   * Extend session (dismiss warning and reset timer)
   */
  const extendSession = useCallback(() => {
    console.log("[SessionTimeout] Session extended by user");
    resetTimeout();
  }, [resetTimeout]);
  
  /**
   * Setup activity listeners and initial timeout
   */
  useEffect(() => {
    if (!enabled) return;
    
    // Initial timeout setup
    resetTimeout();
    
    // Add activity event listeners
    const handleActivity = () => {
      // Only reset if not showing warning (during warning, user must explicitly extend)
      if (!showingWarningRef.current) {
        resetTimeout();
      }
    };
    
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });
    
    // Cleanup
    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (warningTimeoutIdRef.current) clearTimeout(warningTimeoutIdRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, resetTimeout]);
  
  /**
   * Listen for auth state changes (user logs out elsewhere)
   */
  useEffect(() => {
    if (!enabled) return;
    
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        // Clear timers when user signs out
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        if (warningTimeoutIdRef.current) clearTimeout(warningTimeoutIdRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      }
    });
    
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [enabled]);
  
  return {
    timeRemaining,
    showingWarning,
    resetTimeout,
    extendSession,
  };
}

/**
 * Format seconds into human-readable time (e.g., "2:30")
 */
export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
