import { z } from 'zod';

/**
 * Schémas de validation Zod pour l'application
 */

// Validation téléphone français
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

// Validation réservation
export const bookingSchema = z.object({
    clientName: z.string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(100, "Le nom est trop long"),

    clientPhone: z.string()
        .regex(phoneRegex, "Format de téléphone invalide (ex: 06 12 34 56 78)"),

    clientEmail: z.string()
        .email("Email invalide")
        .optional()
        .or(z.literal('')),

    serviceId: z.string()
        .min(1, "ID de service requis"),

    date: z.string()
        .datetime("Date invalide")
        .refine((date) => new Date(date) > new Date(), {
            message: "La date doit être dans le futur"
        }),
});

export type BookingInput = z.infer<typeof bookingSchema>;

// Validation service
export const serviceSchema = z.object({
    name: z.string()
        .min(3, "Le nom doit contenir au moins 3 caractères")
        .max(100, "Le nom est trop long"),

    description: z.string()
        .min(10, "La description doit contenir au moins 10 caractères")
        .max(500, "La description est trop longue"),

    price: z.number()
        .positive("Le prix doit être positif")
        .max(1000, "Le prix est trop élevé"),

    duration: z.number()
        .int("La durée doit être un nombre entier")
        .min(5, "La durée minimale est 5 minutes")
        .max(300, "La durée maximale est 5 heures"),

    active: z.boolean().optional(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

// Validation login
export const loginSchema = z.object({
    email: z.string()
        .email("Email invalide"),

    password: z.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Validation créneau horaire
export const timeSlotSchema = z.object({
    date: z.string().datetime(),
    serviceId: z.string().min(1, "ID de service requis"),
});

export type TimeSlotInput = z.infer<typeof timeSlotSchema>;
