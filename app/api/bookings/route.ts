import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bookingSchema } from '@/lib/validations';
import { verifyToken } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

/**
 * POST /api/bookings - Créer une réservation (public)
 * Uses Prisma $transaction for atomic check + create (no race conditions)
 */
export async function POST(request: NextRequest) {
    // Rate limit: 10 bookings per 15 minutes per IP
    const limitResponse = await rateLimit(request, { limit: 10, windowMs: 15 * 60 * 1000 });
    if (limitResponse) return limitResponse;

    try {
        const body = await request.json();

        // 1. Validation Zod
        const result = bookingSchema.safeParse(body);
        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));
            return NextResponse.json(
                { error: 'Données invalides', details },
                { status: 400 }
            );
        }

        const { clientName, clientPhone, clientEmail, serviceId, date } = result.data;
        const bookingDate = new Date(date);

        // 2. Transaction atomique : vérifier + créer en une seule opération
        const booking = await prisma.$transaction(async (tx) => {
            // 2a. Vérifier que le service existe et est actif
            const service = await tx.service.findUnique({
                where: { id: serviceId },
            });

            if (!service || !service.isActive) {
                throw new Error('SERVICE_NOT_FOUND');
            }

            // 2b. Calculer le créneau de fin
            const endTime = new Date(bookingDate.getTime() + service.duration * 60000);

            // 2c. Vérifier les chevauchements (atomique grâce à la transaction)
            const conflicting = await tx.booking.findFirst({
                where: {
                    status: { not: 'cancelled' },
                    // Overlap check: existing.start < new.end AND existing.end > new.start
                    date: { lt: endTime },
                    endTime: { gt: bookingDate },
                },
            });

            if (conflicting) {
                throw new Error('SLOT_TAKEN');
            }

            // 2d. Upsert client (créer ou mettre à jour)
            const client = await tx.client.upsert({
                where: { phone: clientPhone },
                update: {
                    name: clientName,
                    ...(clientEmail && { email: clientEmail }),
                },
                create: {
                    name: clientName,
                    phone: clientPhone,
                    email: clientEmail || null,
                },
            });

            // 2e. Créer la réservation
            return tx.booking.create({
                data: {
                    clientId: client.id,
                    serviceId: service.id,
                    date: bookingDate,
                    endTime,
                    status: 'confirmed',
                },
                include: {
                    client: true,
                    service: true,
                },
            });
        });

        return NextResponse.json(booking, { status: 201 });

    } catch (error: any) {
        if (error.message === 'SERVICE_NOT_FOUND') {
            return NextResponse.json(
                { error: 'Service introuvable ou inactif' },
                { status: 404 }
            );
        }
        if (error.message === 'SLOT_TAKEN') {
            return NextResponse.json(
                { error: 'Ce créneau est déjà réservé. Veuillez choisir un autre horaire.' },
                { status: 409 }
            );
        }

        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la réservation' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/bookings - Liste des réservations (admin, auth requise)
 * Supports: ?limit=N&page=N&status=confirmed
 */
export async function GET(request: NextRequest) {
    try {
        // Auth check via cookie or header
        const token =
            request.cookies.get('auth-token')?.value ||
            request.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
        }

        // Pagination params
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
        const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
        const status = searchParams.get('status');
        const skip = (page - 1) * limit;

        const where = status ? { status } : {};

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: {
                    client: true,
                    service: true,
                },
                orderBy: { date: 'desc' },
                take: limit,
                skip,
            }),
            prisma.booking.count({ where }),
        ]);

        return NextResponse.json({
            bookings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des réservations' },
            { status: 500 }
        );
    }
}
