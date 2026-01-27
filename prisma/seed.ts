import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Créer un utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@salon.com' },
        update: {},
        create: {
            email: 'admin@salon.com',
            password: hashedPassword,
            name: 'Admin Salon',
            role: 'admin',
        },
    });

    console.log('✅ Admin créé:', admin.email);

    // Créer des services
    const services = await Promise.all([
        prisma.service.upsert({
            where: { id: '1' },
            update: {},
            create: {
                id: '1',
                name: 'Coupe Homme',
                description: 'Coupe personnalisée avec consultation de style et shampoing inclus',
                price: 35,
                duration: 30,
                order: 1,
            },
        }),
        prisma.service.upsert({
            where: { id: '2' },
            update: {},
            create: {
                id: '2',
                name: 'Barbe & Soins',
                description: 'Taille et entretien de la barbe avec produits premium',
                price: 25,
                duration: 20,
                order: 2,
            },
        }),
        prisma.service.upsert({
            where: { id: '3' },
            update: {},
            create: {
                id: '3',
                name: 'Formule Complète',
                description: 'Coupe + Barbe + Soins du visage',
                price: 55,
                duration: 50,
                order: 3,
            },
        }),
        prisma.service.upsert({
            where: { id: '4' },
            update: {},
            create: {
                id: '4',
                name: 'Coloration',
                description: 'Coloration complète avec produits professionnels',
                price: 45,
                duration: 60,
                order: 4,
            },
        }),
    ]);

    console.log('✅ Services créés:', services.length);

    // Créer les horaires d'ouverture
    const businessHours = await Promise.all([
        // Dimanche - Fermé
        prisma.businessHours.upsert({
            where: { dayOfWeek: 0 },
            update: {},
            create: {
                dayOfWeek: 0,
                openTime: '00:00',
                closeTime: '00:00',
                isOpen: false,
            },
        }),
        // Lundi
        prisma.businessHours.upsert({
            where: { dayOfWeek: 1 },
            update: {},
            create: {
                dayOfWeek: 1,
                openTime: '09:00',
                closeTime: '19:00',
                isOpen: true,
            },
        }),
        // Mardi
        prisma.businessHours.upsert({
            where: { dayOfWeek: 2 },
            update: {},
            create: {
                dayOfWeek: 2,
                openTime: '09:00',
                closeTime: '19:00',
                isOpen: true,
            },
        }),
        // Mercredi
        prisma.businessHours.upsert({
            where: { dayOfWeek: 3 },
            update: {},
            create: {
                dayOfWeek: 3,
                openTime: '09:00',
                closeTime: '19:00',
                isOpen: true,
            },
        }),
        // Jeudi
        prisma.businessHours.upsert({
            where: { dayOfWeek: 4 },
            update: {},
            create: {
                dayOfWeek: 4,
                openTime: '09:00',
                closeTime: '19:00',
                isOpen: true,
            },
        }),
        // Vendredi
        prisma.businessHours.upsert({
            where: { dayOfWeek: 5 },
            update: {},
            create: {
                dayOfWeek: 5,
                openTime: '09:00',
                closeTime: '19:00',
                isOpen: true,
            },
        }),
        // Samedi
        prisma.businessHours.upsert({
            where: { dayOfWeek: 6 },
            update: {},
            create: {
                dayOfWeek: 6,
                openTime: '09:00',
                closeTime: '18:00',
                isOpen: true,
            },
        }),
    ]);

    console.log('✅ Horaires créés:', businessHours.length);

    // Créer quelques produits
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'Shampoing Premium',
                description: 'Shampoing professionnel pour cheveux normaux',
                price: 25,
                stock: 50,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Cire Coiffante',
                description: 'Cire de coiffage tenue forte',
                price: 18,
                stock: 30,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Huile à Barbe',
                description: 'Huile nourrissante pour barbe',
                price: 22,
                stock: 25,
            },
        }),
    ]);

    console.log('✅ Produits créés:', products.length);

    console.log('🎉 Seeding terminé !');
    console.log('\n📝 Credentials admin:');
    console.log('Email: admin@salon.com');
    console.log('Password: admin123');
}

main()
    .catch((e) => {
        console.error('❌ Erreur lors du seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
