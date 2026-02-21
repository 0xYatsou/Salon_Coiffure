import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

/**
 * POST /api/auth/login - Connexion admin
 * Returns a Set-Cookie header with HttpOnly JWT + JSON body
 */
export async function POST(request: NextRequest) {
    // Rate limit: 5 attempts per 15 minutes
    const limitResponse = await rateLimit(request, { limit: 5, windowMs: 15 * 60 * 1000 });
    if (limitResponse) return limitResponse;

    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email et mot de passe requis' },
                { status: 400 }
            );
        }

        // 1. Chercher l'utilisateur dans la DB
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // 2. Vérifier si l'utilisateur existe
        if (!user) {
            // Fallback pour le mode démo si la DB n'est pas seedée
            if (email === "admin@salon.com" && password === "admin123") {
                const token = generateToken({
                    userId: "demo_admin_1",
                    email,
                    role: "admin",
                });

                const response = NextResponse.json({
                    user: { id: "demo_admin_1", email, name: "Admin Démo", role: "admin" }
                });

                // Set HttpOnly cookie
                response.cookies.set('auth-token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24, // 24h
                });

                return response;
            }

            return NextResponse.json(
                { error: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        // 3. Vérifier le mot de passe
        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        // 4. Générer le token JWT via la source unique lib/auth.ts
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const response = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });

        // 5. Set HttpOnly cookie — invisible au JS client, envoyé auto par le browser
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24h
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la connexion' },
            { status: 500 }
        );
    }
}
