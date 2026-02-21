import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTestData() {
    console.log('🎯 Création des données de test...\n');

    // 1. Récupérer les services existants
    const services = await prisma.service.findMany();
    if (services.length === 0) {
        console.error('❌ Aucun service trouvé. Lancez d\'abord: npx prisma db seed');
        process.exit(1);
    }
    console.log(`✅ ${services.length} services trouvés`);

    // 2. Créer des clients test
    const clients = await Promise.all([
        prisma.client.upsert({
            where: { phone: '06 12 34 56 78' },
            update: {},
            create: { name: 'Jean Dupont', phone: '06 12 34 56 78', email: 'jean.dupont@email.com' },
        }),
        prisma.client.upsert({
            where: { phone: '06 98 76 54 32' },
            update: {},
            create: { name: 'Pierre Martin', phone: '06 98 76 54 32', email: 'pierre.martin@email.com' },
        }),
        prisma.client.upsert({
            where: { phone: '06 11 22 33 44' },
            update: {},
            create: { name: 'Thomas Leroy', phone: '06 11 22 33 44', email: 'thomas.leroy@email.com' },
        }),
        prisma.client.upsert({
            where: { phone: '06 55 66 77 88' },
            update: {},
            create: { name: 'Marc Bernard', phone: '06 55 66 77 88', email: 'marc.bernard@email.com' },
        }),
        prisma.client.upsert({
            where: { phone: '06 99 88 77 66' },
            update: {},
            create: { name: 'Nicolas Petit', phone: '06 99 88 77 66', email: 'nicolas.petit@email.com' },
        }),
        prisma.client.upsert({
            where: { phone: '06 44 33 22 11' },
            update: {},
            create: { name: 'Sophie Lambert', phone: '06 44 33 22 11', email: 'sophie.lambert@email.com' },
        }),
        prisma.client.upsert({
            where: { phone: '06 77 88 99 00' },
            update: {},
            create: { name: 'Lucas Moreau', phone: '06 77 88 99 00', email: 'lucas.moreau@email.com' },
        }),
        prisma.client.upsert({
            where: { phone: '06 33 44 55 66' },
            update: {},
            create: { name: 'Emma Durand', phone: '06 33 44 55 66', email: 'emma.durand@email.com' },
        }),
    ]);
    console.log(`✅ ${clients.length} clients créés`);

    // 3. Créer des réservations de test
    //    - Dates futures variées (prochains jours)
    //    - Différents statuts: confirmed, completed, cancelled, et 3x PENDING (à modifier)
    const now = new Date();
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1); tomorrow.setHours(10, 0, 0, 0);
    const dayAfter = new Date(now); dayAfter.setDate(now.getDate() + 2); dayAfter.setHours(0, 0, 0, 0);
    const day3 = new Date(now); day3.setDate(now.getDate() + 3); day3.setHours(0, 0, 0, 0);
    const day4 = new Date(now); day4.setDate(now.getDate() + 4); day4.setHours(0, 0, 0, 0);
    const day5 = new Date(now); day5.setDate(now.getDate() + 5); day5.setHours(0, 0, 0, 0);
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1); yesterday.setHours(0, 0, 0, 0);

    const bookingsData = [
        // ✅ Réservations CONFIRMÉES
        {
            client: clients[0], service: services[0],
            date: setTime(tomorrow, 10, 0),
            status: 'confirmed',
        },
        {
            client: clients[1], service: services[1],
            date: setTime(tomorrow, 14, 30),
            status: 'confirmed',
        },
        {
            client: clients[5], service: services[2] || services[0],
            date: setTime(dayAfter, 9, 0),
            status: 'confirmed',
        },

        // ✅ Réservations TERMINÉES (passées)
        {
            client: clients[2], service: services[0],
            date: setTime(yesterday, 11, 0),
            status: 'completed',
        },
        {
            client: clients[3], service: services[1],
            date: setTime(yesterday, 15, 0),
            status: 'completed',
        },

        // ❌ Réservation ANNULÉE
        {
            client: clients[4], service: services[3] || services[0],
            date: setTime(dayAfter, 16, 0),
            status: 'cancelled',
        },

        // ⏳ 3 réservations EN ATTENTE (à modifier par l'admin !)
        {
            client: clients[6], service: services[0],
            date: setTime(day3, 10, 30),
            status: 'pending',
        },
        {
            client: clients[7], service: services[2] || services[0],
            date: setTime(day4, 11, 0),
            status: 'pending',
        },
        {
            client: clients[4], service: services[1],
            date: setTime(day5, 14, 0),
            status: 'pending',
        },
    ];

    // Supprimer les anciennes réservations de test
    await prisma.booking.deleteMany({});
    console.log('🗑️  Anciennes réservations supprimées');

    let created = 0;
    for (const b of bookingsData) {
        const endTime = new Date(b.date.getTime() + b.service.duration * 60000);
        await prisma.booking.create({
            data: {
                clientId: b.client.id,
                serviceId: b.service.id,
                date: b.date,
                endTime,
                status: b.status,
            },
        });
        created++;
    }
    console.log(`✅ ${created} réservations créées (dont 3 en attente à modifier)`);

    // 4. Créer des avis test
    await prisma.review.deleteMany({});
    const reviews = await Promise.all([
        prisma.review.create({
            data: { name: 'Marie Martin', rating: 5, comment: 'Service impeccable ! Mon coiffeur a parfaitement compris ce que je voulais. Je recommande vivement ce salon.', isPublished: true },
        }),
        prisma.review.create({
            data: { name: 'Jean Dupont', rating: 4, comment: 'Très bon accueil et coupe réussie. Le salon est propre et agréable. Je reviendrai.', isPublished: true },
        }),
        prisma.review.create({
            data: { name: 'Sophie Lambert', rating: 5, comment: 'Excellente expérience ! L\'ambiance est top et le résultat est bluffant. Mon nouveau salon préféré !', isPublished: true },
        }),
        prisma.review.create({
            data: { name: 'Lucas Moreau', rating: 3, comment: 'Bonne coupe mais l\'attente était un peu longue. Le staff est sympathique.', isPublished: false },
        }),
        prisma.review.create({
            data: { name: 'Emma Durand', rating: 5, comment: 'TOP ! Des vrais professionnels. La barbe est nickel. Prix raisonnable pour la qualité.', isPublished: false },
        }),
    ]);
    console.log(`✅ ${reviews.length} avis créés (dont 2 en attente de modération)`);

    // Résumé
    console.log('\n📊 Résumé des données de test:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  📅 Réservations confirmées: 3`);
    console.log(`  ✅ Réservations terminées:  2`);
    console.log(`  ❌ Réservations annulées:   1`);
    console.log(`  ⏳ Réservations EN ATTENTE: 3 ← à modifier !`);
    console.log(`  💬 Avis publiés:           3`);
    console.log(`  💬 Avis en modération:     2`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

function setTime(base: Date, hours: number, minutes: number): Date {
    const d = new Date(base);
    d.setHours(hours, minutes, 0, 0);
    return d;
}

seedTestData()
    .then(() => {
        console.log('\n🎉 Données de test créées avec succès !');
        process.exit(0);
    })
    .catch((e) => {
        console.error('❌ Erreur:', e);
        process.exit(1);
    });
