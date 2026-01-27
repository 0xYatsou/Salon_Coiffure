import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const reviews = await prisma.review.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: "desc" },
            take: 6, // On en prend quelques-uns pour l'affichage
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Error fetching public reviews:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, rating, comment } = body;

        if (!name || !rating || !comment) {
            return NextResponse.json(
                { error: "Tous les champs sont obligatoires" },
                { status: 400 }
            );
        }

        const review = await prisma.review.create({
            data: {
                name,
                rating: parseInt(rating),
                comment,
                isPublished: false, // Par défaut, non publié pour modération
            },
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
