/**
 * In-memory rate limiter for Next.js API routes.
 * Tracks requests per IP using a sliding window.
 *
 * For production with multiple servers, replace with Redis/Upstash.
 */

interface RateLimitEntry {
    count: number;
    windowStart: number;
}

// Map: identifier -> { count, windowStart }
const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        store.forEach((entry, key) => {
            if (now - entry.windowStart > 60_000) {
                store.delete(key);
            }
        });
    }, 5 * 60_000);
}

interface RateLimitOptions {
    /** Max requests allowed in the window */
    limit: number;
    /** Window size in milliseconds (default: 60s) */
    windowMs?: number;
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterMs: number;
}

export function rateLimit(identifier: string, options: RateLimitOptions): RateLimitResult {
    const { limit, windowMs = 60_000 } = options;
    const now = Date.now();

    const entry = store.get(identifier);

    if (!entry || now - entry.windowStart >= windowMs) {
        // New window
        store.set(identifier, { count: 1, windowStart: now });
        return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
    }

    if (entry.count >= limit) {
        const retryAfterMs = windowMs - (now - entry.windowStart);
        return { allowed: false, remaining: 0, retryAfterMs };
    }

    entry.count++;
    return { allowed: true, remaining: limit - entry.count, retryAfterMs: 0 };
}

/**
 * Gets a stable identifier from the request.
 * Uses X-Forwarded-For (Vercel/proxy), falling back to x-real-ip.
 */
export function getRequestIdentifier(req: Request, suffix = ""): string {
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0].trim() ?? realIp ?? "unknown";
    return suffix ? `${ip}:${suffix}` : ip;
}
