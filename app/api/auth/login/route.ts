import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/login - Connexion admin (Mode Démo)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Mode Démo : Authentification statique
        if (email === "admin@salon.com" && password === "admin123") {
            const mockToken = "demo_admin_token_" + Date.now();

            return NextResponse.json({
                token: mockToken,
                user: {
                    id: "admin_1",
                    email: "admin@salon.com",
                    name: "Admin Démo",
                    role: "ADMIN",
                },
            });
        }

        return NextResponse.json(
            { error: 'Identifiants invalides' },
            { status: 401 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la connexion' },
            { status: 500 }
        );
    }
}
