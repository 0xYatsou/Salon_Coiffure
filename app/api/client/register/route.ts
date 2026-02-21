import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * POST /api/client/register - Inscription client
 */
export async function POST(request: NextRequest) {
    const limitResponse = await rateLimit(request, { limit: 5, windowMs: 15 * 60 * 1000 });
    if (limitResponse) return limitResponse;

    try {
        const { name, email, phone, password } = await request.json();

        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis (nom, email, téléphone, mot de passe)' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 6 caractères' },
                { status: 400 }
            );
        }

        // Check if email or phone already exists with an account
        const existing = await prisma.client.findFirst({
            where: {
                OR: [
                    { email, password: { not: null } },
                    { phone },
                ],
            },
        });

        if (existing) {
            if (existing.phone === phone) {
                return NextResponse.json(
                    { error: 'Ce numéro de téléphone est déjà utilisé' },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: 'Cet email a déjà un compte. Connectez-vous.' },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        // Upsert: if a guest client with this phone exists, upgrade them to an account
        const client = await prisma.client.upsert({
            where: { phone },
            update: {
                name,
                email,
                password: hashedPassword,
            },
            create: {
                name,
                email,
                phone,
                password: hashedPassword,
            },
        });

        // Generate client JWT
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
        }, { status: 201 });

        response.cookies.set('client-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return response;
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'inscription' },
            { status: 500 }
        );
    }
}
