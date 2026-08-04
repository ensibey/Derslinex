/**
 * In-memory Rate Limiter for Next.js API Routes.
 * Limits requests per client IP / identifier.
 */

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitStore>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store.entries()) {
    if (val.resetAt <= now) {
      store.delete(key);
    }
  }
}, 5 * 60_000);

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60_000 // 1 minute window
): { success: boolean; remaining: number; resetMs: number } {
  const now = Date.now();

  // Guard against memory leaks if store grows too large
  if (store.size > 5000) {
    for (const [key, val] of store.entries()) {
      if (val.resetAt <= now) {
        store.delete(key);
      }
    }
  }

  const entry = store.get(identifier);

  if (!entry || entry.resetAt <= now) {
    store.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: maxRequests - 1, resetMs: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0, resetMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { success: true, remaining: maxRequests - entry.count, resetMs: entry.resetAt - now };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}
