import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { timeSlotSchema } from '@/lib/validations';
import { isSunday } from '@/lib/utils';

/**
 * GET /api/bookings/available-slots
 * Retourne les créneaux horaires disponibles pour un service et une date
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const serviceId = searchParams.get('serviceId');

        console.log('📅 Available slots request:', { date, serviceId });

        // Validation
        if (!date || !serviceId) {
            console.log('❌ Missing parameters');
            return NextResponse.json(
                { error: 'Date et serviceId requis' },
                { status: 400 }
            );
        }

        const validation = timeSlotSchema.safeParse({ date, serviceId });
        if (!validation.success) {
            console.log('❌ Validation failed:', validation.error.errors);
            return NextResponse.json(
                { error: 'Paramètres invalides', details: validation.error.errors },
                { status: 400 }
            );
        }

        const selectedDate = new Date(date);

        // Vérifier que ce n'est pas un dimanche
        if (isSunday(selectedDate)) {
            return NextResponse.json(
                { error: 'Le salon est fermé le dimanche', availableSlots: [] },
                { status: 200 }
            );
        }

        // Vérifier que c'est dans le futur (comparer uniquement les dates, pas les heures)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDateOnly = new Date(selectedDate);
        selectedDateOnly.setHours(0, 0, 0, 0);

        if (selectedDateOnly < today) {
            return NextResponse.json(
                { error: 'Date dans le passé', availableSlots: [] },
                { status: 200 }
            );
        }

        // Récupérer le service
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
        });

        if (!service) {
            return NextResponse.json(
                { error: 'Service introuvable' },
                { status: 404 }
            );
        }

        // Créneaux horaires du salon (09h-12h et 13h30-18h30)
        const { generateTimeSlots, isWithinBusinessHours } = await import('@/lib/calendar');
        const allTimeSlots = generateTimeSlots();

        // Récupérer toutes les réservations du jour
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingBookings = await prisma.booking.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: {
                    not: 'cancelled',
                },
            },
            include: {
                service: true,
            },
        });

        // Filtrer les créneaux disponibles
        const now = new Date();
        const availableSlots = allTimeSlots.filter(timeSlot => {
            const [hours, minutes] = timeSlot.split(':').map(Number);
            const slotStart = new Date(selectedDate);
            slotStart.setHours(hours, minutes, 0, 0);

            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotEnd.getMinutes() + service.duration);

            // Si c'est aujourd'hui, vérifier que le créneau n'est pas dans le passé
            if (selectedDateOnly.getTime() === today.getTime() && slotStart <= now) {
                return false;
            }

            // Vérifier qu'il n'y a pas de chevauchement
            const hasConflict = existingBookings.some(booking => {
                const bookingStart = new Date(booking.date);
                const bookingEnd = new Date(booking.endTime);

                // Chevauchement si:
                // - Le nouveau créneau commence pendant une réservation existante
                // - Le nouveau créneau se termine pendant une réservation existante
                // - Le nouveau créneau englobe complètement une réservation existante
                return (
                    (slotStart >= bookingStart && slotStart < bookingEnd) ||
                    (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                    (slotStart <= bookingStart && slotEnd >= bookingEnd)
                );
            });

            return !hasConflict;
        });

        return NextResponse.json({
            date: selectedDate.toISOString(),
            serviceId,
            serviceName: service.name,
            serviceDuration: service.duration,
            availableSlots,
            totalSlots: allTimeSlots.length,
            availableCount: availableSlots.length,
        });

    } catch (error) {
        console.error('Error fetching available slots:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des créneaux disponibles' },
            { status: 500 }
        );
    }
}
