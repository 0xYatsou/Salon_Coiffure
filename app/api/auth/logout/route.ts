import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout - Déconnexion admin
 * Clears the HttpOnly auth-token cookie
 */
export async function POST() {
    const response = NextResponse.json({ success: true });

    response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0, // Expire immediately
    });

    return response;
}
