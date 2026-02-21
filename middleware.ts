import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware Next.js — protège /admin/* (sauf /admin/login)
 * 
 * NOTE: Le middleware s'exécute dans le Edge Runtime qui ne supporte pas
 * `jsonwebtoken` (Node.js only). On fait une vérification basique ici
 * (présence du cookie + décodage base64 du payload JWT pour check expiry).
 * La vérification complète de la signature se fait dans les API routes (Node.js runtime).
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Routes admin (sauf login et logout)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Light JWT validation in Edge: decode the payload and check expiry
        // (full signature verification happens in API routes via jsonwebtoken)
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }

            // Decode the payload (base64url -> JSON)
            const payload = JSON.parse(
                atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
            );

            // Check expiration
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                throw new Error('Token expired');
            }
        } catch {
            // Token malformed or expired → clear cookie + redirect
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('auth-token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
};
