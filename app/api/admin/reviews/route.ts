import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth"; // I need to check if this exists or create it

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const body = await request.json();
        const { id, isPublished } = body;

        if (!id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        const review = await prisma.review.update({
            where: { id },
            data: { isPublished },
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        await prisma.review.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Avis supprimé" });
    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json(
            { error: "Erreur serveur" },
            { status: 500 }
        );
    }
}
