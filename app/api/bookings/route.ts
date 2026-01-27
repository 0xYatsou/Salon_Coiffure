import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateEndTime, doSlotsOverlap, isPast, isSunday } from '@/lib/utils';

/**
 * GET /api/bookings - Récupère toutes les réservations
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');

        let bookings;

        if (date) {
            // Filtrer par date
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            bookings = await prisma.booking.findMany({
                where: {
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
                include: {
                    client: true,
                    service: true,
                },
                orderBy: {
                    date: 'asc',
                },
            });
        } else {
            bookings = await prisma.booking.findMany({
                include: {
                    client: true,
                    service: true,
                },
                orderBy: {
                    date: 'desc',
                },
                take: 50,
            });
        }

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des réservations' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/bookings - Crée une nouvelle réservation
 * Utilise une transaction pour éviter les race conditions
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation Zod
        const { bookingSchema } = await import('@/lib/validations');
        const validation = bookingSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Données invalides',
                    details: validation.error.errors.map(e => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                },
                { status: 400 }
            );
        }

        const { clientName, clientPhone, clientEmail, serviceId, date } = validation.data;
        const bookingDate = new Date(date);

        // Vérifier que ce n'est pas un dimanche
        if (isSunday(bookingDate)) {
            return NextResponse.json(
                { error: 'Le salon est fermé le dimanche' },
                { status: 400 }
            );
        }

        // Vérifier que ce n'est pas dans le passé
        if (isPast(bookingDate)) {
            return NextResponse.json(
                { error: 'Impossible de réserver dans le passé' },
                { status: 400 }
            );
        }

        // Utiliser une transaction pour éviter les race conditions
        const booking = await prisma.$transaction(async (tx) => {
            // Récupérer le service
            const service = await tx.service.findUnique({
                where: { id: serviceId },
            });

            if (!service) {
                throw new Error('Service introuvable');
            }

            if (!service.isActive) {
                throw new Error('Ce service n\'est plus disponible');
            }

            // Calculer l'heure de fin
            const endTime = calculateEndTime(bookingDate, service.duration);

            // Vérifier les chevauchements (dans la transaction)
            const startOfDay = new Date(bookingDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(bookingDate);
            endOfDay.setHours(23, 59, 59, 999);

            const existingBookings = await tx.booking.findMany({
                where: {
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    status: {
                        not: 'cancelled',
                    },
                },
            });

            const hasOverlap = existingBookings.some(booking =>
                doSlotsOverlap(bookingDate, endTime, booking.date, booking.endTime)
            );

            if (hasOverlap) {
                throw new Error('Ce créneau n\'est plus disponible');
            }

            // Créer ou récupérer le client
            let client = await tx.client.findUnique({
                where: { phone: clientPhone },
            });

            if (!client) {
                client = await tx.client.create({
                    data: {
                        name: clientName,
                        phone: clientPhone,
                        email: clientEmail || null,
                    },
                });
            } else {
                // Mettre à jour les infos du client si changées
                client = await tx.client.update({
                    where: { id: client.id },
                    data: {
                        name: clientName,
                        email: clientEmail || client.email,
                    },
                });
            }

            // Créer la réservation
            const newBooking = await tx.booking.create({
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

            return newBooking;
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error: any) {
        console.error('Error creating booking:', error);

        // Erreurs métier
        if (error.message === 'Service introuvable') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        if (error.message === 'Ce créneau n\'est plus disponible' ||
            error.message === 'Ce service n\'est plus disponible') {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }

        return NextResponse.json(
            { error: 'Erreur lors de la création de la réservation' },
            { status: 500 }
        );
    }
}
