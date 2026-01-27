import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedReviews() {
    console.log("🌱 Seeding reviews...");

    const reviews = [
        {
            name: "Jean Dupont",
            rating: 5,
            comment: "Excellente coupe, très professionnel ! Je recommande vivement.",
            isPublished: true,
        },
        {
            name: "Marie Martin",
            rating: 4,
            comment: "Très satisfaite de ma nouvelle coiffure. Salon accueillant.",
            isPublished: true,
        },
        {
            name: "Pierre Durand",
            rating: 5,
            comment: "Le meilleur barbier du quartier. Attention aux détails incroyable.",
            isPublished: false,
        },
        {
            name: "Sophie Lefebvre",
            rating: 2,
            comment: "Un peu déçue par l'attente, mais la coupe est correcte.",
            isPublished: false,
        },
    ];

    for (const review of reviews) {
        await prisma.review.create({
            data: review,
        });
    }

    console.log(`✅ ${reviews.length} avis créés !`);
    await prisma.$disconnect();
}

seedReviews().catch(console.error);
