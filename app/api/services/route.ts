import { NextRequest, NextResponse } from 'next/server';

// Mock data pour la démo
const mockServices = [
    {
        id: "s1",
        name: "Coupe Homme",
        description: "Coupe aux ciseaux et/ou tondeuse, finitions soignées, coiffage.",
        price: 35,
        duration: 30,
        image: "/images/service-coupe.png"
    },
    {
        id: "s2",
        name: "Barbe & Soins",
        description: "Taille de barbe experte, contours au rasoir, serviette chaude et soins hydratants.",
        price: 25,
        duration: 20,
        image: "/images/service-barbe.png"
    },
    {
        id: "s3",
        name: "Coupe + Barbe",
        description: "Le combo parfait : coupe de cheveux et entretien de la barbe pour un look impeccable.",
        price: 55,
        duration: 50,
        image: "/images/service-complet.png"
    },
    {
        id: "s4",
        name: "Coloration",
        description: "Coloration discrète pour camoufler les cheveux blancs ou changer de style.",
        price: 45,
        duration: 60,
        image: "/images/service-coloration.png"
    },
    {
        id: "s5",
        name: "Soins Visage",
        description: "Gommage, masque et massage du visage pour une peau revitalisée.",
        price: 30,
        duration: 30,
        image: "/images/hero-banner.png"
    }
];

export async function GET(request: NextRequest) {
    // Mode Démo : Renvoie toujours les données mockées
    return NextResponse.json(mockServices);
}

export async function POST(request: NextRequest) {
    return NextResponse.json({ message: "Mode démo : Création simulée" }, { status: 201 });
}
