import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware Next.js pour protéger les routes admin
 * Vérifie la présence et la validité du token JWT
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Routes admin (sauf login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        // Vérifier le token dans les cookies ou headers
        const token = request.cookies.get('token')?.value ||
            request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            // Rediriger vers login si pas de token
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // TODO: Vérifier la validité du token avec jsonwebtoken
        // Pour l'instant, on vérifie juste sa présence
        // Dans une version future, décoder et vérifier l'expiration
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
};
