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
 * Prefers standard proxy headers, falls back to "0.0.0.0".
 */
function getClientIp(): string {
  try {
    const request = getRequest();
    if (!request?.headers) return "0.0.0.0";
    // Cloudflare sets CF-Connecting-IP; other proxies use X-Forwarded-For.
    return (
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "0.0.0.0"
    );
  } catch {
    return "0.0.0.0";
  }
}

/**
 * Check-and-increment rate limiter.
 *
 * @param namespace  A unique string per endpoint (e.g. "submitLead").
 * @param limit      Max requests allowed inside the window.
 * @param windowMs   Window duration in milliseconds.
 * @returns `true` if the request is **allowed**, `false` if rate-limited.
 */
export function rateLimit(namespace: string, limit: number, windowMs: number): boolean {
  const ip = getClientIp();
  const key = `${namespace}:${ip}`;
  const now = Date.now();

  evictStale(now);

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
