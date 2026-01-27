import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * PUT /api/services/[id] - Met à jour un service
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        // Validation
        if (!name || !description || price === undefined || !duration) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        // Mettre à jour le service
        const service = await prisma.service.update({
            where: { id: params.id },
            data: {
                name,
                description,
                price: parseFloat(price),
                duration: parseInt(duration),
                isActive: active !== undefined ? active : true,
            },
        });

        return NextResponse.json(service);
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour du service' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/services/[id] - Supprime un service
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        // Vérifier s'il y a des réservations liées
        const bookingsCount = await prisma.booking.count({
            where: { serviceId: params.id },
        });

        if (bookingsCount > 0) {
            return NextResponse.json(
                { error: 'Impossible de supprimer un service avec des réservations existantes' },
                { status: 400 }
            );
        }

        // Supprimer le service
        await prisma.service.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du service' },
            { status: 500 }
        );
    }
}
