import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * POST /api/client/login - Connexion client
 */
export async function POST(request: NextRequest) {
    const limitResponse = await rateLimit(request, { limit: 5, windowMs: 15 * 60 * 1000 });
    if (limitResponse) return limitResponse;

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email et mot de passe requis' },
                { status: 400 }
            );
        }

        const client = await prisma.client.findFirst({
            where: { email, password: { not: null } },
        });

        if (!client || !client.password) {
            return NextResponse.json(
                { error: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        const isValid = await comparePassword(password, client.password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { clientId: client.id, email: client.email, role: 'client' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        const response = NextResponse.json({
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
            },
        });

        response.cookies.set('client-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        });

        return response;
    } catch (error) {
        console.error('Client login error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la connexion' },
            { status: 500 }
        );
    }
}
