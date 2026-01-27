import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

async function seedTestBookings() {
    console.log('🌱 Génération de données de test pour les réservations...\n');

    try {
        // Récupérer les services existants
        const services = await prisma.service.findMany();
        if (services.length === 0) {
            console.error('❌ Aucun service trouvé. Exécutez d\'abord le seed principal.');
            return;
        }

        const service = services[0]; // Utiliser le premier service
        console.log(`📋 Service utilisé: ${service.name}\n`);

        // Récupérer ou créer un client de test
        let client = await prisma.client.findFirst({
            where: { phone: '0612345678' }
        });

        if (!client) {
            client = await prisma.client.create({
                data: {
                    name: 'Client Test',
                    phone: '0612345678',
                    email: 'test@example.com'
                }
            });
            console.log('✅ Client de test créé\n');
        }

        // Supprimer les anciennes réservations de test
        await prisma.booking.deleteMany({
            where: {
                clientId: client.id
            }
        });
        console.log('🗑️  Anciennes réservations de test supprimées\n');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Créer des réservations pour les 30 prochains jours
        const bookingsToCreate = [];

        for (let i = 1; i <= 30; i++) {
            const date = addDays(today, i);
            const dayOfWeek = date.getDay();

            // Ignorer les dimanches (0)
            if (dayOfWeek === 0) {
                console.log(`⏭️  Jour ${i}: Dimanche - ignoré`);
                continue;
            }

            // Stratégie de remplissage:
            // - Jours pairs (2, 4, 6, etc.): Quelques réservations (journée partiellement libre)
            // - Jours impairs (1, 3, 5, etc.): Beaucoup de réservations (journée presque complète)
            // - Certains jours: Complètement libres

            let slotsToBook: string[] = [];

            if (i % 5 === 0) {
                // Tous les 5 jours: Journée COMPLÈTEMENT LIBRE
                console.log(`✅ Jour ${i}: Complètement libre`);
                continue;
            } else if (i % 2 === 0) {
                // Jours pairs: Quelques réservations (matin occupé, après-midi libre)
                slotsToBook = ['09:00', '09:30', '10:00', '10:30'];
                console.log(`🟡 Jour ${i}: Partiellement occupé (matin)`);
            } else {
                // Jours impairs: Beaucoup de réservations (après-midi occupé)
                slotsToBook = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
                console.log(`🟠 Jour ${i}: Très occupé (après-midi)`);
            }

            // Créer les réservations pour ce jour
            for (const slot of slotsToBook) {
                const [hours, minutes] = slot.split(':').map(Number);
                const bookingDate = new Date(date);
                bookingDate.setHours(hours, minutes, 0, 0);

                // Calculer l'heure de fin
                const endTime = new Date(bookingDate);
                endTime.setMinutes(bookingDate.getMinutes() + service.duration);

                bookingsToCreate.push({
                    clientId: client.id,
                    serviceId: service.id,
                    date: bookingDate,
                    endTime: endTime,
                    status: 'CONFIRMED'
                });
            }
        }

        // Créer toutes les réservations en une fois
        const result = await prisma.booking.createMany({
            data: bookingsToCreate
        });

        console.log(`\n✅ ${result.count} réservations de test créées avec succès!\n`);
        console.log('📊 Résumé:');
        console.log('   - Jours complètement libres: Tous les 5 jours (5, 10, 15, 20, 25, 30)');
        console.log('   - Jours partiellement occupés: Jours pairs (matin occupé)');
        console.log('   - Jours très occupés: Jours impairs (après-midi occupé)');
        console.log('   - Dimanches: Automatiquement exclus\n');
        console.log('🎯 Vous pouvez maintenant tester le calendrier avec des créneaux variés!\n');

    } catch (error) {
        console.error('❌ Erreur lors de la génération des données:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedTestBookings();
