// Server-only in-memory rate limiter (sliding window by IP).
// Works per-instance; good enough for basic abuse protection.
// In a distributed serverless environment each isolate has its own window,
// which is a weaker guarantee but still stops single-source floods.

import { getRequest } from "@tanstack/react-start/server";

type WindowEntry = { count: number; resetAt: number };

const buckets = new Map<string, WindowEntry>();

// Prevent unbounded memory growth: evict expired entries periodically.
const EVICT_INTERVAL_MS = 60_000;
let lastEvict = Date.now();

function evictStale(now: number) {
  if (now - lastEvict < EVICT_INTERVAL_MS) return;
  lastEvict = now;
  for (const [key, entry] of buckets) {
    if (now >= entry.resetAt) buckets.delete(key);
  }
}

/**
 * Returns the client IP from the incoming request.
 * 
 * Security considerations:
 * - CF-Connecting-IP is trusted only when behind Cloudflare (set by Cloudflare edge, cannot be spoofed)
 * - X-Forwarded-For is NOT trusted by default (can be spoofed by attackers)
 * - Falls back to "0.0.0.0" which rate limits all requests together (safer than bypass)
 * 
 * Deployment-specific behavior:
 * - Cloudflare Workers: Uses CF-Connecting-IP (set by edge, trustworthy)
 * - Behind Cloudflare proxy: Uses CF-Connecting-IP (set by edge, trustworthy)
 * - Node.js server: Falls back to "0.0.0.0" (all users share one bucket - more restrictive)
 * - Other platforms: Falls back to "0.0.0.0"
 * 
 * Why we don't trust X-Forwarded-For:
 * - Attacker can send: X-Forwarded-For: 1.2.3.4
 * - This would bypass rate limiting by rotating fake IPs
 * - Only trust proxy headers from verified infrastructure (Cloudflare CF-Connecting-IP)
 * 
 * @returns Client IP address or "0.0.0.0" as fallback
 */
function getClientIp(): string {
  try {
    const request = getRequest();
    if (!request?.headers) return "0.0.0.0";
    
    const trustProxy = process.env["TRUST_PROXY"] === "true";

    // Cloudflare or another trusted reverse proxy may supply the client IP.
    // Do not accept this header on a directly reachable Node server because a
    // client can forge it and obtain unlimited rate-limit buckets.
    if (trustProxy) {
      const cfIp = request.headers.get("cf-connecting-ip");
      if (cfIp && isValidIpFormat(cfIp)) {
        return cfIp;
      }
    }

    // Hostinger commonly terminates TLS in a trusted reverse proxy. Only use
    // proxy-provided addresses when explicitly enabled by the deployment;
    // otherwise these headers are attacker-controlled and can bypass limits.
    if (trustProxy) {
      const forwardedIp =
        request.headers.get("x-real-ip") ??
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
      if (forwardedIp && isValidIpFormat(forwardedIp)) return forwardedIp;
    }
    
    // For bare Node.js servers, try to get the actual socket IP
    // This requires platform-specific code and may not be available in all environments
    // Note: In serverless environments, this will be the proxy IP, not client IP
    const nodeReq = (request as any).node?.req;
    if (nodeReq?.socket?.remoteAddress) {
      const socketIp = nodeReq.socket.remoteAddress;
      // Remove IPv6 prefix if present (e.g., "::ffff:192.168.1.1" -> "192.168.1.1")
      const cleanIp = socketIp.replace(/^::ffff:/, "");
      if (isValidIpFormat(cleanIp)) {
        return cleanIp;
      }
    }
    
    // Fallback: Use "0.0.0.0" if the platform exposes no client address.
    // Configure TRUST_PROXY behind a trusted reverse proxy to avoid a single
    // global bucket on Node deployments.
    // Better to be overly restrictive than allow unlimited requests via IP spoofing
    return "0.0.0.0";
  } catch {
    return "0.0.0.0";
  }
}

/**
 * Validates if a string looks like a valid IP address (IPv4 or IPv6)
 * This is a basic format check, not a comprehensive validator
 * 
 * @param ip - String to validate
 * @returns true if it looks like an IP address
 */
function isValidIpFormat(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false;
  
  // Remove whitespace
  ip = ip.trim();
  
  // Empty or too long
  if (ip.length === 0 || ip.length > 45) return false;
  
  // IPv4 pattern: 1-3 digits, dot, repeated 4 times
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Pattern.test(ip)) {
    // Validate each octet is 0-255
    const octets = ip.split(".");
    return octets.every((octet) => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  // IPv6 pattern: hex digits and colons
  // Simplified check - full IPv6 validation is complex
  const ipv6Pattern = /^[0-9a-fA-F:]+$/;
  if (ipv6Pattern.test(ip) && ip.includes(":")) {
    // Basic IPv6 structure check
    const parts = ip.split(":");
    // IPv6 has 2-8 parts (can be compressed with ::)
    return parts.length >= 2 && parts.length <= 8;
  }
  
  return false;
}

/**
 * Check-and-increment rate limiter.
 *
 * @param namespace  A unique string per endpoint (e.g. "submitLead").
 * @param limit      Max requests allowed inside the window.
 * @param windowMs   Window duration in milliseconds.
 * @param sessionId  Optional session/user ID for additional rate limiting layer.
 * @returns `true` if the request is **allowed**, `false` if rate-limited.
 * 
 * Security features:
 * - Primary limit by IP (safe detection, no spoofable headers)
 * - Secondary limit by session ID (prevents bypass via multiple IPs)
 * - When both provided, both must pass
 * - Graceful fallback if IP detection fails (uses "0.0.0.0" shared bucket)
 */
export function rateLimit(
  namespace: string,
  limit: number,
  windowMs: number,
  sessionId?: string,
): boolean {
  const now = Date.now();
  evictStale(now);

  // Primary rate limit: by IP
  const ip = getClientIp();
  const ipKey = `${namespace}:ip:${ip}`;
  const ipAllowed = checkAndIncrement(ipKey, limit, windowMs, now);
  
  // If IP limit failed, reject immediately
  if (!ipAllowed) {
    return false;
  }
  
  // Secondary rate limit: by session ID (if provided)
  // This prevents a user from bypassing limits by rotating IPs (VPN, proxies, etc.)
  if (sessionId) {
    const sessionKey = `${namespace}:session:${sessionId}`;
    const sessionAllowed = checkAndIncrement(sessionKey, limit, windowMs, now);
    
    // Both IP and session must pass
    if (!sessionAllowed) {
      return false;
    }
  }
  
  return true;
}

/**
 * Internal helper: Check and increment a rate limit bucket
 * 
 * @param key - Unique bucket key
 * @param limit - Max requests in window
 * @param windowMs - Window duration
 * @param now - Current timestamp
 * @returns true if allowed, false if rate limited
 */
function checkAndIncrement(
  key: string,
  limit: number,
  windowMs: number,
  now: number,
): boolean {
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count < limit) {
    entry.count++;
    return true;
  }

  return false;
}
