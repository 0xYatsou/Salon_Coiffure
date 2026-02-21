import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * GET /api/client/me - Récupérer le profil du client connecté
 */
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('client-token')?.value;

        if (!token) {
            return NextResponse.json({ client: null }, { status: 200 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { clientId: string };

        const client = await prisma.client.findUnique({
            where: { id: decoded.clientId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        });

        if (!client) {
            return NextResponse.json({ client: null }, { status: 200 });
        }

        return NextResponse.json({ client });
    } catch {
        // Token expired or invalid
        return NextResponse.json({ client: null }, { status: 200 });
    }
}
