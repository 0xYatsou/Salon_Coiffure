import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date || !serviceId) {
        return NextResponse.json(
            { error: 'Date et serviceId requis' },
            { status: 400 }
        );
    }

    // Mode Démo : Génère des créneaux aléatoires
    // On simule des disponibilités de 9h à 19h
    const slots = [];
    const baseDate = new Date(date);
    // Assurer que c'est la bonne journée locale

    // Créneaux toutes les 30 min
    const startHour = 9;
    const endHour = 18;

    for (let h = startHour; h <= endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
            // Ignorer la pause midi
            if (h === 12 || h === 13) continue;

            const slotTime = new Date(baseDate);
            slotTime.setHours(h, m, 0, 0);

            // Simuler quelques créneaux indisponibles aléatoirement (20% de chance)
            const isAvailable = Math.random() > 0.2;

            if (isAvailable) {
                slots.push(slotTime.toISOString());
            }
        }
    }

    return NextResponse.json({ availableSlots: slots });
}
