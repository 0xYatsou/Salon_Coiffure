import { NextResponse } from 'next/server';

/**
 * POST /api/client/logout - Déconnexion client
 */
export async function POST() {
    const response = NextResponse.json({ success: true });

    response.cookies.set('client-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    return response;
}
