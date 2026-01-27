# 🏗️ Architecture de l'Application Salon de Coiffure

## Vue d'ensemble

Application web full-stack moderne construite avec Next.js 14, utilisant l'App Router pour une architecture optimale.

## 🎯 Principes de Conception

### 1. **Mobile-First**
- Design responsive avec Tailwind CSS
- Breakpoints adaptatifs
- Touch-friendly pour les interactions mobiles

### 2. **Performance**
- Server Components par défaut (Next.js 14)
- Client Components uniquement quand nécessaire
- Lazy loading des images
- Code splitting automatique

### 3. **Sécurité**
- Authentification JWT
- Validation des données (serveur + client)
- Protection CSRF
- Rate limiting (à implémenter)

### 4. **UX/UI**
- Design minimaliste et sobre
- Animations fluides (Framer Motion)
- Feedback visuel immédiat
- Messages d'erreur clairs

## 📐 Architecture Technique

### Frontend (Next.js 14 App Router)

```
app/
├── (public)/              # Routes publiques
│   ├── page.tsx          # Homepage
│   ├── booking/          # Réservation
│   ├── services/         # Liste des services
│   └── gallery/          # Galerie photos
├── (admin)/              # Routes protégées admin
│   └── dashboard/        # Dashboard admin
└── api/                  # API Routes
    ├── auth/            # Authentification
    ├── bookings/        # Gestion réservations
    ├── services/        # Gestion services
    └── gallery/         # Gestion galerie
```

### Backend (API Routes)

**Pattern utilisé**: RESTful API

- `GET /api/bookings` - Liste des réservations
- `POST /api/bookings` - Créer une réservation
- `GET /api/services` - Liste des services
- `POST /api/services` - Créer un service (admin)
- `POST /api/auth/login` - Connexion admin

### Base de Données (PostgreSQL + Prisma)

**Relations principales**:

```
User (Admin)
  ↓
Client ←→ Booking ←→ Service
  ↓
Product
  ↓
GalleryImage
  ↓
BusinessHours / ClosedDay
```

## 🔄 Flux de Données

### 1. Réservation Client

```
Client → Sélection Service
  ↓
Choix Date/Heure
  ↓
Validation Disponibilité (API)
  ↓
Vérification Dimanche/Passé
  ↓
Check Chevauchement
  ↓
Création Réservation
  ↓
Confirmation
```

### 2. Authentification Admin

```
Login Form
  ↓
POST /api/auth/login
  ↓
Vérification Email/Password (bcrypt)
  ↓
Génération JWT Token
  ↓
Stockage Token (localStorage/cookie)
  ↓
Accès Dashboard
```

## 🛡️ Sécurité

### Authentification
- **JWT** avec expiration 7 jours
- **bcrypt** pour hash des mots de passe (12 rounds)
- Token dans header `Authorization: Bearer <token>`

### Validation
- **Zod** pour validation des schémas (à implémenter)
- Validation côté serveur obligatoire
- Sanitization des inputs

### Protection Routes
- Middleware pour routes admin
- Vérification token sur chaque requête protégée

## 📊 Gestion des Horaires

### Logique Métier

1. **Horaires d'ouverture**
   - Table `BusinessHours` avec jours de la semaine
   - Dimanche = fermé par défaut
   - Configurable par l'admin

2. **Créneaux horaires**
   - Générés dynamiquement (30 min par défaut)
   - Basés sur durée du service
   - Filtrés selon disponibilité

3. **Prévention conflits**
   - Fonction `doSlotsOverlap()` vérifie chevauchements
   - Vérification en temps réel lors de la réservation
   - Lock optimiste (first-come, first-served)

4. **Jours fermés**
   - Table `ClosedDay` pour congés/fériés
   - Vérification avant affichage créneaux

## 🎨 Design System

### Couleurs

```css
Primary (Noir/Gris):
  - 900: #0c0a09 (Texte principal)
  - 800: #1c1917
  - 700: #292524
  - ...
  - 50: #f5f5f4 (Backgrounds)

Accent (Or):
  - DEFAULT: #d4af37
  - light: #e5c158
  - dark: #b8941f
```

### Typographie

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Sizes**: Scale modulaire (1.25)

### Composants

**Boutons**:
- `.btn-primary` - Action principale
- `.btn-secondary` - Action secondaire
- `.btn-accent` - CTA important

**Cards**:
- `.card` - Container standard
- Shadow subtile
- Border radius 12px

**Inputs**:
- `.input` - Champ de formulaire
- Focus ring accent
- Validation visuelle

## 🚀 Performance

### Optimisations

1. **Images**
   - Next.js Image component
   - Lazy loading
   - WebP format

2. **Code**
   - Tree shaking automatique
   - Code splitting par route
   - Dynamic imports pour composants lourds

3. **Database**
   - Indexes sur colonnes fréquemment requêtées
   - Connection pooling (Prisma)
   - Requêtes optimisées (select only needed fields)

4. **Caching**
   - Static Generation quand possible
   - Revalidation ISR pour données dynamiques
   - Client-side caching (React Query - à implémenter)

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Stratégie

- Mobile-first CSS
- Grid adaptatif (1 col → 2 cols → 3 cols)
- Navigation hamburger sur mobile
- Touch targets minimum 44x44px

## 🧪 Testing (À implémenter)

### Recommandations

1. **Unit Tests**
   - Jest pour fonctions utilitaires
   - Tests des validations

2. **Integration Tests**
   - Testing Library pour composants
   - Tests des flows utilisateur

3. **E2E Tests**
   - Playwright pour parcours complets
   - Tests du flow de réservation

## 🔮 Évolutions Futures

### Phase 2
- [ ] Dashboard admin complet
- [ ] Notifications (SMS/Email)
- [ ] Système de rappel automatique
- [ ] Gestion des absences coiffeur

### Phase 3
- [ ] Paiement en ligne (Stripe)
- [ ] Programme de fidélité
- [ ] Avis clients
- [ ] Multi-salon (franchise)

### Phase 4
- [ ] Application mobile (React Native)
- [ ] IA pour recommandations coupe
- [ ] Réalité augmentée (essai virtuel)
- [ ] Analytics avancés

## 📚 Documentation Technique

### Variables d'Environnement

```env
DATABASE_URL          # Connection PostgreSQL
JWT_SECRET           # Secret pour tokens JWT
NEXT_PUBLIC_APP_URL  # URL de l'application
```

### Scripts NPM

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Serveur production
npm run lint         # Linting
npx prisma studio    # Interface DB
npx prisma migrate   # Migrations
```

## 🤝 Contribution

### Workflow Git

1. Feature branch depuis `main`
2. Commits conventionnels
3. Pull Request avec review
4. Merge après validation

### Code Style

- ESLint + Prettier
- TypeScript strict mode
- Commentaires JSDoc pour fonctions complexes

---

**Dernière mise à jour**: 2024
**Version**: 1.0.0
