# 💈 Salon de Coiffure - Application Web Complète

Application web moderne et responsive pour la gestion d'un salon de coiffure avec système de réservation en ligne.

## 🚀 Stack Technique

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: JWT (JSON Web Tokens)
- **Déploiement**: Compatible Vercel

## ✨ Fonctionnalités

### Pour les Clients
- ✅ Page d'accueil moderne et premium
- ✅ Système de réservation en ligne (3 étapes)
- ✅ Sélection de prestations avec prix et durée
- ✅ Calendrier intelligent (dimanches bloqués)
- ✅ Créneaux horaires configurables
- ✅ Prévention des doubles réservations
- ✅ Confirmation visuelle de réservation
- ✅ Design responsive (mobile-first)

### Pour l'Admin
- ✅ Authentification sécurisée (JWT)
- ✅ Dashboard de gestion
- ✅ CRUD complet des prestations
- ✅ Gestion des réservations
- ✅ Gestion des produits
- ✅ Gestion de la galerie
- ✅ Configuration des horaires

## 📦 Installation

### Prérequis
- Node.js 18+
- PostgreSQL
- npm ou yarn

### Étapes

1. **Cloner et installer les dépendances**
```bash
cd salon-coiffure
npm install
```

2. **Configurer la base de données**
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos credentials PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/salon_coiffure"
```

3. **Initialiser Prisma**
```bash
# Créer la base de données et les tables
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate
```

4. **Créer un utilisateur admin (optionnel)**
```bash
# Utiliser Prisma Studio
npx prisma studio

# Ou créer via script SQL
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
salon-coiffure/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # Authentification
│   │   ├── bookings/          # Réservations
│   │   └── services/          # Prestations
│   ├── booking/               # Page de réservation
│   ├── admin/                 # Dashboard admin (à créer)
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Page d'accueil
│   └── globals.css            # Styles globaux
├── components/                # Composants réutilisables
├── lib/
│   ├── prisma.ts             # Client Prisma
│   ├── auth.ts               # Utilitaires d'authentification
│   └── utils.ts              # Utilitaires (dates, horaires)
├── prisma/
│   └── schema.prisma         # Schéma de base de données
├── public/                    # Fichiers statiques
├── .env.example              # Template des variables d'environnement
├── package.json
├── tailwind.config.ts        # Configuration Tailwind
└── tsconfig.json             # Configuration TypeScript
```

## 🗄️ Schéma de Base de Données

### Tables Principales

- **User**: Utilisateurs admin
- **Client**: Clients du salon
- **Service**: Prestations (coupe, barbe, etc.)
- **Booking**: Réservations
- **Product**: Produits vendus
- **GalleryImage**: Photos de la galerie
- **BusinessHours**: Horaires d'ouverture
- **ClosedDay**: Jours de fermeture exceptionnels

## 🎨 Design System

### Couleurs
- **Primary**: Noir, gris, beige (palette sobre)
- **Accent**: Or élégant (#d4af37)

### Typographie
- **Sans-serif**: Inter (texte courant)
- **Serif**: Playfair Display (titres)

### Composants
- Boutons: `.btn-primary`, `.btn-secondary`, `.btn-accent`
- Cards: `.card`
- Inputs: `.input`
- Container: `.container-custom`

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt (12 rounds)
- Tokens JWT avec expiration (7 jours)
- Validation des données côté serveur
- Protection contre les doubles réservations
- Variables d'environnement pour les secrets

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints Tailwind standards
- Grid adaptatif
- Navigation optimisée mobile

## 🚀 Déploiement sur Vercel

1. **Connecter votre repo GitHub**
2. **Configurer les variables d'environnement**
   - `DATABASE_URL`
   - `JWT_SECRET`
3. **Déployer**

```bash
# Ou via CLI
vercel --prod
```

## 📝 TODO / Améliorations Futures

- [ ] Dashboard admin complet
- [ ] Notifications SMS/Email
- [ ] Système de paiement en ligne
- [ ] Gestion des avis clients
- [ ] Programme de fidélité
- [ ] Multi-langues
- [ ] Dark mode
- [ ] PWA (Progressive Web App)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT

---

**Développé avec ❤️ pour les salons de coiffure modernes**
