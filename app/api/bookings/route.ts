import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Simulation de succès pour la démo
        // On renvoie un ID fictif
        const mockBooking = {
            id: "booking_" + Date.now(),
            ...body,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        // Simuler un petit délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json(mockBooking, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la réservation' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    // Mock pour l'admin dashboard si nécessaire via API (mais le dashboard utilise déjà des mocks internes)
    return NextResponse.json([]);
}
