# 🔧 Guide de Dépannage (Troubleshooting)

## 🚨 Problèmes Courants et Solutions

### 1. Erreur: "Cannot find module '@prisma/client'"

**Cause**: Le client Prisma n'a pas été généré.

**Solution**:
```bash
npx prisma generate
```

---

### 2. Erreur: "DATABASE_URL is not defined"

**Cause**: Le fichier `.env` n'existe pas ou est mal configuré.

**Solution**:
```bash
# Copier le template
cp .env.example .env

# Éditer .env et ajouter votre URL PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/salon_coiffure"
```

---

### 3. Erreur: "relation does not exist"

**Cause**: Les migrations Prisma n'ont pas été appliquées.

**Solution**:
```bash
# Appliquer les migrations
npx prisma migrate dev --name init

# Ou reset complet (⚠️ supprime les données)
npx prisma migrate reset
```

---

### 4. Erreur: "Port 3000 is already in use"

**Cause**: Un autre processus utilise le port 3000.

**Solution**:
```bash
# Option 1: Tuer le processus
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Option 2: Utiliser un autre port
PORT=3001 npm run dev
```

---

### 5. Erreur: "Invalid `prisma.user.create()` invocation"

**Cause**: Violation de contrainte unique (email déjà existant).

**Solution**:
```bash
# Vérifier les données existantes
npx prisma studio

# Ou supprimer l'utilisateur existant
# Dans Prisma Studio ou via SQL
```

---

### 6. Page blanche / Erreur 500

**Cause**: Erreur JavaScript côté serveur.

**Solution**:
```bash
# 1. Vérifier les logs dans le terminal
npm run dev

# 2. Vérifier la console du navigateur (F12)

# 3. Rebuild
rm -rf .next
npm run dev

# 4. Vérifier les variables d'environnement
cat .env
```

---

### 7. Styles Tailwind ne s'appliquent pas

**Cause**: Configuration Tailwind incorrecte ou cache.

**Solution**:
```bash
# 1. Vérifier tailwind.config.ts
# content: ["./app/**/*.{js,ts,jsx,tsx}"]

# 2. Rebuild
rm -rf .next
npm run dev

# 3. Vérifier globals.css
# @tailwind base;
# @tailwind components;
# @tailwind utilities;
```

---

### 8. Erreur JWT "invalid token"

**Cause**: Token expiré ou JWT_SECRET différent.

**Solution**:
```bash
# 1. Vérifier JWT_SECRET dans .env
JWT_SECRET="votre-secret"

# 2. Se reconnecter pour obtenir un nouveau token

# 3. Vérifier l'expiration du token (7 jours par défaut)
```

---

### 9. Erreur "Cannot connect to database"

**Cause**: PostgreSQL n'est pas démarré ou URL incorrecte.

**Solution**:
```bash
# 1. Vérifier que PostgreSQL est démarré
# Windows
services.msc # Chercher PostgreSQL

# Linux/Mac
sudo service postgresql status

# 2. Tester la connexion
psql -U user -d salon_coiffure

# 3. Vérifier DATABASE_URL dans .env
```

---

### 10. Réservation échoue avec "Ce créneau n'est plus disponible"

**Cause**: Double réservation ou créneau dans le passé.

**Solution**:
```bash
# 1. Vérifier les réservations existantes
npx prisma studio
# Ouvrir table "Booking"

# 2. Vérifier l'heure du serveur
date

# 3. Choisir un autre créneau
```

---

### 11. Images ne se chargent pas

**Cause**: Domaine non autorisé dans next.config.mjs.

**Solution**:
```typescript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com', 'votre-domaine.com'],
  },
};
```

---

### 12. Erreur "Module not found" après npm install

**Cause**: Cache npm corrompu.

**Solution**:
```bash
# 1. Nettoyer le cache
npm cache clean --force

# 2. Supprimer node_modules
rm -rf node_modules
rm package-lock.json

# 3. Réinstaller
npm install
```

---

### 13. Build échoue en production

**Cause**: Erreurs TypeScript ou variables d'environnement manquantes.

**Solution**:
```bash
# 1. Vérifier les erreurs TypeScript
npm run build

# 2. Vérifier les variables d'environnement
# Ajouter dans Vercel/votre plateforme

# 3. Tester le build localement
npm run build
npm start
```

---

### 14. Seed échoue

**Cause**: Données en conflit ou schéma non synchronisé.

**Solution**:
```bash
# 1. Reset la base de données
npx prisma migrate reset

# 2. Regénérer le client
npx prisma generate

# 3. Relancer le seed
npx prisma db seed
```

---

### 15. Performance lente

**Cause**: Requêtes DB non optimisées ou trop de données.

**Solution**:
```typescript
// 1. Ajouter des indexes
// Dans schema.prisma
@@index([date])
@@index([clientId])

// 2. Limiter les résultats
const bookings = await prisma.booking.findMany({
  take: 50, // Limite à 50
  orderBy: { date: 'desc' },
});

// 3. Utiliser select pour limiter les champs
const bookings = await prisma.booking.findMany({
  select: {
    id: true,
    date: true,
    // Seulement les champs nécessaires
  },
});
```

---

## 🔍 Commandes de Diagnostic

### Vérifier l'état du projet
```bash
# Version Node.js
node --version  # Doit être >= 18

# Version npm
npm --version

# Dépendances installées
npm list --depth=0

# État de Prisma
npx prisma --version
npx prisma validate
```

### Vérifier la base de données
```bash
# Connexion PostgreSQL
psql -U user -d salon_coiffure

# Lister les tables
\dt

# Compter les enregistrements
SELECT COUNT(*) FROM "Booking";
SELECT COUNT(*) FROM "Service";

# Vérifier les migrations
npx prisma migrate status
```

### Vérifier les logs
```bash
# Logs Next.js
npm run dev
# Observer les erreurs dans le terminal

# Logs Prisma
# Activé automatiquement en dev dans lib/prisma.ts
```

---

## 📞 Besoin d'Aide Supplémentaire ?

### 1. Vérifier la Documentation
- README.md
- ARCHITECTURE.md
- QUICKSTART.md

### 2. Vérifier les Issues GitHub
- Rechercher si le problème a déjà été signalé

### 3. Créer une Issue
Inclure:
- Description du problème
- Étapes pour reproduire
- Messages d'erreur complets
- Environnement (OS, Node version, etc.)
- Screenshots si applicable

### 4. Ressources Externes
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Stack Overflow](https://stackoverflow.com)

---

## ✅ Checklist de Dépannage

Avant de demander de l'aide, vérifiez:

- [ ] Node.js >= 18 installé
- [ ] PostgreSQL démarré
- [ ] Fichier .env configuré
- [ ] `npm install` exécuté
- [ ] `npx prisma generate` exécuté
- [ ] `npx prisma migrate dev` exécuté
- [ ] Pas d'erreurs dans le terminal
- [ ] Pas d'erreurs dans la console navigateur
- [ ] Cache vidé (.next supprimé)
- [ ] Documentation consultée

---

*Guide de dépannage - Dernière mise à jour: 2024*
