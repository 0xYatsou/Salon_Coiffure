import { addDays, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSunday, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Génère les horaires du salon selon les règles métier
 */
export function generateTimeSlots(): string[] {
    const slots: string[] = [];

    // Matin: 09h00 → 12h00 (créneaux de 30 min)
    for (let hour = 9; hour < 12; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    // Pause déjeuner: 12h00 → 13h30 (pas de créneaux)

    // Après-midi: 13h30 → 18h30 (créneaux de 30 min)
    slots.push('13:30');
    for (let hour = 14; hour <= 18; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 18) {
            slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
    }
    slots.push('18:30');

    return slots;
}

/**
 * Génère un calendrier mensuel complet
 */
export function generateMonthCalendar(date: Date = new Date()) {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    // Obtenir le premier jour de la semaine du mois (lundi)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });

    // Obtenir le dernier jour de la semaine du mois (dimanche)
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    // Générer tous les jours
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return days.map(day => ({
        date: day,
        isCurrentMonth: isSameMonth(day, date),
        isSunday: isSunday(day),
        isPast: day < new Date(new Date().setHours(0, 0, 0, 0)),
    }));
}

/**
 * Vérifie si un créneau est dans les horaires d'ouverture
 */
export function isWithinBusinessHours(time: string): boolean {
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;

    // Matin: 09h00 (540) → 12h00 (720)
    const morningStart = 9 * 60; // 540
    const morningEnd = 12 * 60; // 720

    // Après-midi: 13h30 (810) → 18h30 (1110)
    const afternoonStart = 13 * 60 + 30; // 810
    const afternoonEnd = 18 * 60 + 30; // 1110

    return (
        (timeInMinutes >= morningStart && timeInMinutes < morningEnd) ||
        (timeInMinutes >= afternoonStart && timeInMinutes <= afternoonEnd)
    );
}

/**
 * Formate une date pour l'affichage
 */
export function formatDateDisplay(date: Date): string {
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
}

/**
 * Formate un jour pour le calendrier
 */
export function formatDayShort(date: Date): string {
    return format(date, 'EEE', { locale: fr });
}

/**
 * Formate le numéro du jour
 */
export function formatDayNumber(date: Date): string {
    return format(date, 'd');
}

/**
 * Formate le mois
 */
export function formatMonthShort(date: Date): string {
    return format(date, 'MMM', { locale: fr });
}

/**
 * Formate le mois complet
 */
export function formatMonthYear(date: Date): string {
    return format(date, 'MMMM yyyy', { locale: fr });
}
