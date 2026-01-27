import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/services - Récupère tous les services
 */
export async function GET(request: NextRequest) {
    try {
        // Si authentifié, retourner tous les services, sinon seulement les actifs
        const authHeader = request.headers.get('authorization');
        let whereClause = {};

        if (!authHeader) {
            whereClause = { isActive: true };
        }

        const services = await prisma.service.findMany({
            where: whereClause,
            orderBy: {
                order: 'asc',
            },
        });

        return NextResponse.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des services' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/services - Crée un nouveau service (Admin only)
 */
export async function POST(request: NextRequest) {
    try {
        // Vérifier l'authentification
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json(
                { error: 'Token invalide' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, description, price, duration, active } = body;

        if (!name || !description || price === undefined || !duration) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        const service = await prisma.service.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                duration: parseInt(duration),
                isActive: active !== undefined ? active : true,
            },
        });

        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        console.error('Error creating service:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création du service' },
            { status: 500 }
        );
    }
}
