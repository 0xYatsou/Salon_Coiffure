import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/bookings/available-slots?date=ISO&serviceId=UUID
 * Returns actually available slots by checking the DB for conflicts
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!dateStr || !serviceId) {
        return NextResponse.json(
            { error: 'Date et serviceId requis' },
            { status: 400 }
        );
    }

    try {
        // 1. Get the service to know the duration
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
        });

        if (!service || !service.isActive) {
            return NextResponse.json(
                { error: 'Service introuvable' },
                { status: 404 }
            );
        }

        // 2. Parse the requested date and compute day boundaries
        const requestedDate = new Date(dateStr);
        const dayStart = new Date(requestedDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        // 3. Check if it's a Sunday (closed)
        if (requestedDate.getDay() === 0) {
            return NextResponse.json({ availableSlots: [] });
        }

        // 4. Check if the day is in the past
        const now = new Date();
        if (dayEnd < now) {
            return NextResponse.json({ availableSlots: [] });
        }

        // 5. Get business hours for this day of week
        const businessHours = await prisma.businessHours.findUnique({
            where: { dayOfWeek: requestedDate.getDay() },
        });

        if (!businessHours || !businessHours.isOpen) {
            return NextResponse.json({ availableSlots: [] });
        }

        // 6. Get all non-cancelled bookings for that day
        const existingBookings = await prisma.booking.findMany({
            where: {
                status: { not: 'cancelled' },
                date: { gte: dayStart, lte: dayEnd },
            },
            select: { date: true, endTime: true },
        });

        // 7. Generate all possible slots and filter out conflicts
        const [openH, openM] = businessHours.openTime.split(':').map(Number);
        const [closeH, closeM] = businessHours.closeTime.split(':').map(Number);

        const slots: string[] = [];
        const slotInterval = 30; // minutes

        for (let h = openH; h <= closeH; h++) {
            for (let m = 0; m < 60; m += slotInterval) {
                // Skip before opening minute on first hour
                if (h === openH && m < openM) continue;

                const slotStart = new Date(dayStart);
                slotStart.setHours(h, m, 0, 0);

                const slotEnd = new Date(slotStart.getTime() + service.duration * 60000);

                // Slot must end before closing time
                const closingTime = new Date(dayStart);
                closingTime.setHours(closeH, closeM, 0, 0);
                if (slotEnd > closingTime) continue;

                // Skip slots in the past (with 15-min buffer)
                if (slotStart.getTime() < now.getTime() + 15 * 60000) continue;

                // Check for overlap with existing bookings
                const hasConflict = existingBookings.some((booking) => {
                    const bStart = new Date(booking.date).getTime();
                    const bEnd = new Date(booking.endTime).getTime();
                    const sStart = slotStart.getTime();
                    const sEnd = slotEnd.getTime();
                    return sStart < bEnd && sEnd > bStart;
                });

                if (!hasConflict) {
                    slots.push(slotStart.toISOString());
                }
            }
        }

        return NextResponse.json({ availableSlots: slots });

    } catch (error) {
        console.error('Error computing available slots:', error);
        return NextResponse.json(
            { error: 'Erreur lors du calcul des créneaux' },
            { status: 500 }
        );
    }
}
