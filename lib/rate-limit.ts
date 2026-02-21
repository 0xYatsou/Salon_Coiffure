import { NextResponse } from 'next/server';

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store (clears on server restart/redeploy)
// For multi-instance production (Vercel), consider Upstash Redis
const store = new Map<string, RateLimitEntry>();

// Auto-cleanup stale entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
        if (now > entry.resetTime) {
            store.delete(key);
        }
    });
}, 5 * 60 * 1000);

export interface RateLimitOptions {
    /** Max number of requests allowed in the time window */
    limit: number;
    /** Time window in milliseconds */
    windowMs: number;
}

/**
 * Rate limiter for Next.js API Route Handlers.
 * Returns a 429 response if the client has exceeded the limit, or null if allowed.
 * 
 * Usage:
 * ```ts
 * const limited = await rateLimit(request, { limit: 5, windowMs: 15 * 60 * 1000 });
 * if (limited) return limited;
 * ```
 */
export async function rateLimit(
    request: Request,
    options: RateLimitOptions
): Promise<NextResponse | null> {
    // Identify client by IP (works behind Vercel/Cloudflare proxies)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Build a key that includes the route path for per-route limiting
    const url = new URL(request.url);
    const key = `${ip}:${url.pathname}`;

    const now = Date.now();
    const entry = store.get(key);

    // First request or window expired → reset
    if (!entry || now > entry.resetTime) {
        store.set(key, { count: 1, resetTime: now + options.windowMs });
        return null;
    }

    // Within window → increment
    entry.count++;

    if (entry.count > options.limit) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        return NextResponse.json(
            {
                error: 'Trop de requêtes',
                message: `Limite atteinte. Réessayez dans ${retryAfter} secondes.`,
            },
            {
                status: 429,
                headers: {
                    'Retry-After': retryAfter.toString(),
                    'X-RateLimit-Limit': options.limit.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
                },
            }
        );
    }

    return null;
}
