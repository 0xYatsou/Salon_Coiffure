import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/admin/stats - Récupère les statistiques du dashboard
 */
export async function GET(request: NextRequest) {
    try {
        // Vérifier l'authentification (cookie first, header fallback)
        const token =
            request.cookies.get('auth-token')?.value ||
            request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json(
                { error: 'Token invalide' },
                { status: 401 }
            );
        }

        // Récupérer les statistiques
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [totalBookings, todayBookings, totalClients, totalServices, pendingReviews] = await Promise.all([
            prisma.booking.count(),
            prisma.booking.count({
                where: {
                    date: {
                        gte: today,
                        lt: tomorrow,
                    },
                },
            }),
            prisma.client.count(),
            prisma.service.count(),
            prisma.review.count({
                where: { isPublished: false }
            }),
        ]);

        return NextResponse.json({
            totalBookings,
            todayBookings,
            totalClients,
            totalServices,
            pendingReviews,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des statistiques' },
            { status: 500 }
        );
    }
}
