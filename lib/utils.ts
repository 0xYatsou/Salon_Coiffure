import { addMinutes, format, isAfter, isBefore, isSameDay, parse, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Vérifie si une date est un dimanche
 */
export function isSunday(date: Date): boolean {
    return date.getDay() === 0;
}

/**
 * Vérifie si une date est dans le passé
 */
export function isPast(date: Date): boolean {
    return isBefore(date, new Date());
}

/**
 * Génère les créneaux horaires disponibles pour une journée
 */
export function generateTimeSlots(
    openTime: string,
    closeTime: string,
    slotDuration: number = 30
): string[] {
    const slots: string[] = [];
    const baseDate = new Date();

    let currentTime = parse(openTime, 'HH:mm', baseDate);
    const endTime = parse(closeTime, 'HH:mm', baseDate);

    while (isBefore(currentTime, endTime)) {
        slots.push(format(currentTime, 'HH:mm'));
        currentTime = addMinutes(currentTime, slotDuration);
    }

    return slots;
}

/**
 * Vérifie si deux créneaux se chevauchent
 */
export function doSlotsOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
): boolean {
    return (
        (isAfter(start1, start2) && isBefore(start1, end2)) ||
        (isAfter(start2, start1) && isBefore(start2, end1)) ||
        (start1.getTime() === start2.getTime())
    );
}

/**
 * Calcule l'heure de fin d'un rendez-vous
 */
export function calculateEndTime(startTime: Date, durationMinutes: number): Date {
    return addMinutes(startTime, durationMinutes);
}

/**
 * Formate une date en français
 */
export function formatDateFr(date: Date, formatStr: string = 'EEEE d MMMM yyyy'): string {
    return format(date, formatStr, { locale: fr });
}

/**
 * Vérifie si un créneau est disponible
 */
export function isSlotAvailable(
    slotStart: Date,
    slotEnd: Date,
    existingBookings: Array<{ date: Date; endTime: Date }>
): boolean {
    return !existingBookings.some(booking =>
        doSlotsOverlap(slotStart, slotEnd, booking.date, booking.endTime)
    );
}
