import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

/**
 * POST /api/auth/login - Connexion admin
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 1. Chercher l'utilisateur dans la DB
        console.log(`[Login] Searching for user: ${email}`);
        const user = await prisma.user.findUnique({
            where: { email }
        });
        console.log(`[Login] DB Result:`, user ? `Found (ID: ${user.id})` : 'Not Found');

        // 2. Vérifier si l'utilisateur existe
        if (!user) {
            // Fallback pour le mode démo si la DB est vide ou pas encore seedée en prod (sécurité)
            if (email === "admin@salon.com" && password === "admin123") {
                const mockToken = "demo_admin_token_" + Date.now();
                return NextResponse.json({
                    token: mockToken,
                    user: { id: "admin_1", email, name: "Admin Démo", role: "ADMIN" }
                });
            }

            return NextResponse.json(
                { error: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        // 3. Vérifier le mot de passe
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Identifiants invalides' },
                { status: 401 }
            );
        }

        // 4. Générer le token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la connexion' },
            { status: 500 }
        );
    }
}
