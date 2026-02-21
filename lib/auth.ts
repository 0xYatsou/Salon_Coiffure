import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

/**
 * Génère un token JWT
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d',
    });
}

/**
 * Vérifie et décode un token JWT
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
}

/**
 * Hash un mot de passe
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

/**
 * Compare un mot de passe avec son hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Extrait le token depuis les headers
 */
export function getTokenFromHeaders(headers: Headers): string | null {
    const authHeader = headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

/**
 * Vérifie l'authentification dans une requête API
 * Checks: 1) auth-token cookie, 2) Authorization Bearer header
 */
export async function verifyAuth(request: Request): Promise<JWTPayload | null> {
    // Try cookie first (parse Cookie header manually since plain Request has no .cookies)
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => {
            const [key, ...val] = c.trim().split('=');
            return [key, val.join('=')];
        })
    );
    const cookieToken = cookies['auth-token'];

    // Fallback to Authorization header
    const headerToken = getTokenFromHeaders(request.headers);

    const token = cookieToken || headerToken;
    if (!token) return null;

    return verifyToken(token);
}

