# 📦 Dépendances du Projet

## Vue d'Ensemble

Ce document liste toutes les dépendances utilisées dans le projet et explique leur rôle.

---

## 🎯 Dependencies (Production)

### Framework & Core

#### next (14.2.0)
**Rôle**: Framework React full-stack  
**Utilisation**: Base de l'application (App Router, API Routes, SSR)  
**Pourquoi**: Framework moderne, performant, avec routing intégré

#### react (^18.2.0)
**Rôle**: Bibliothèque UI  
**Utilisation**: Composants, hooks, state management  
**Pourquoi**: Standard de l'industrie pour les interfaces

#### react-dom (^18.2.0)
**Rôle**: Rendu React dans le DOM  
**Utilisation**: Rendu des composants dans le navigateur  
**Pourquoi**: Requis par React

---

### Base de Données

#### @prisma/client (^5.9.0)
**Rôle**: ORM (Object-Relational Mapping)  
**Utilisation**: Requêtes type-safe vers PostgreSQL  
**Pourquoi**: Type-safety, migrations automatiques, excellent DX

**Exemples d'utilisation**:
```typescript
// Créer une réservation
const booking = await prisma.booking.create({
  data: { ... }
});

// Récupérer des services
const services = await prisma.service.findMany();
```

---

### Authentification & Sécurité

#### bcryptjs (^2.4.3)
**Rôle**: Hash de mots de passe  
**Utilisation**: Sécuriser les mots de passe admin  
**Pourquoi**: Standard de l'industrie, sécurisé (12 rounds)

**Exemples d'utilisation**:
```typescript
// Hash un mot de passe
const hash = await bcrypt.hash(password, 12);

// Vérifier un mot de passe
const isValid = await bcrypt.compare(password, hash);
```

#### jsonwebtoken (^9.0.2)
**Rôle**: Génération et vérification de JWT  
**Utilisation**: Authentification stateless  
**Pourquoi**: Standard pour les API REST, scalable

**Exemples d'utilisation**:
```typescript
// Générer un token
const token = jwt.sign({ userId }, SECRET, { expiresIn: '7d' });

// Vérifier un token
const payload = jwt.verify(token, SECRET);
```

---

### Utilitaires

#### date-fns (^3.3.0)
**Rôle**: Manipulation de dates  
**Utilisation**: Formatage, calculs, validations de dates  
**Pourquoi**: Léger, modulaire, meilleur que Moment.js

**Exemples d'utilisation**:
```typescript
import { format, addMinutes, isBefore } from 'date-fns';

// Formater une date
format(new Date(), 'dd/MM/yyyy');

// Ajouter des minutes
addMinutes(startTime, 30);

// Comparer des dates
isBefore(date1, date2);
```

#### zod (^3.22.0)
**Rôle**: Validation de schémas  
**Utilisation**: Validation des données d'entrée  
**Pourquoi**: Type-safe, excellente intégration TypeScript

**Exemples d'utilisation**:
```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

schema.parse(data); // Valide ou throw
```

---

### UI & Animations

#### framer-motion (^11.0.0)
**Rôle**: Animations React  
**Utilisation**: Animations fluides des composants  
**Pourquoi**: Performant, API simple, animations complexes faciles

**Exemples d'utilisation**:
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Contenu
</motion.div>
```

#### lucide-react (^0.323.0)
**Rôle**: Icônes  
**Utilisation**: Icônes SVG (Calendar, User, etc.)  
**Pourquoi**: Moderne, léger, grande collection

**Exemples d'utilisation**:
```typescript
import { Calendar, User, Mail } from 'lucide-react';

<Calendar className="w-5 h-5" />
```

#### react-hook-form (^7.50.0)
**Rôle**: Gestion de formulaires  
**Utilisation**: Formulaires performants avec validation  
**Pourquoi**: Performant (peu de re-renders), excellente DX

**Exemples d'utilisation**:
```typescript
const { register, handleSubmit } = useForm();

<input {...register('email')} />
```

---

## 🛠️ DevDependencies (Développement)

### TypeScript

#### typescript (^5)
**Rôle**: Langage typé  
**Utilisation**: Type-safety dans tout le projet  
**Pourquoi**: Prévention d'erreurs, meilleure DX, refactoring sûr

#### @types/node (^20)
**Rôle**: Types Node.js  
**Utilisation**: Types pour les APIs Node  
**Pourquoi**: Requis pour TypeScript

#### @types/react (^18)
**Rôle**: Types React  
**Utilisation**: Types pour les composants React  
**Pourquoi**: Requis pour TypeScript + React

#### @types/react-dom (^18)
**Rôle**: Types React DOM  
**Utilisation**: Types pour react-dom  
**Pourquoi**: Requis pour TypeScript

#### @types/bcryptjs (^2.4.6)
**Rôle**: Types bcryptjs  
**Utilisation**: Types pour bcrypt  
**Pourquoi**: Type-safety pour l'authentification

#### @types/jsonwebtoken (^9.0.5)
**Rôle**: Types JWT  
**Utilisation**: Types pour jsonwebtoken  
**Pourquoi**: Type-safety pour les tokens

---

### Styling

#### tailwindcss (^3.4.0)
**Rôle**: Framework CSS utility-first  
**Utilisation**: Styling de toute l'application  
**Pourquoi**: Rapide, flexible, design system intégré

**Configuration**: `tailwind.config.ts`

#### postcss (^8)
**Rôle**: Transformateur CSS  
**Utilisation**: Requis par Tailwind  
**Pourquoi**: Traite les directives Tailwind

#### autoprefixer (^10.0.1)
**Rôle**: Préfixes CSS automatiques  
**Utilisation**: Compatibilité navigateurs  
**Pourquoi**: Support multi-navigateurs automatique

---

### Database

#### prisma (^5.9.0)
**Rôle**: CLI et outils Prisma  
**Utilisation**: Migrations, génération client, Prisma Studio  
**Pourquoi**: Gestion complète de la base de données

**Commandes**:
```bash
npx prisma migrate dev    # Créer migration
npx prisma generate       # Générer client
npx prisma studio         # Interface graphique
```

#### ts-node (^10.9.2)
**Rôle**: Exécution TypeScript  
**Utilisation**: Exécuter le script de seed  
**Pourquoi**: Permet d'exécuter prisma/seed.ts

---

### Linting

#### eslint (^8)
**Rôle**: Linter JavaScript/TypeScript  
**Utilisation**: Détection d'erreurs et bonnes pratiques  
**Pourquoi**: Code quality, prévention de bugs

#### eslint-config-next (14.2.0)
**Rôle**: Configuration ESLint pour Next.js  
**Utilisation**: Rules spécifiques Next.js  
**Pourquoi**: Bonnes pratiques Next.js automatiques

---

## 📊 Statistiques

```
Total Dependencies:       8
Total DevDependencies:   13
Total:                   21

Taille estimée:          ~500 MB (node_modules)
```

---

## 🔄 Mises à Jour

### Vérifier les mises à jour
```bash
npm outdated
```

### Mettre à jour
```bash
# Mises à jour mineures
npm update

# Mises à jour majeures (attention!)
npx npm-check-updates -u
npm install
```

---

## 🎯 Dépendances par Fonctionnalité

### Authentification
- bcryptjs
- jsonwebtoken
- @types/bcryptjs
- @types/jsonwebtoken

### Base de Données
- @prisma/client
- prisma

### UI/UX
- react
- react-dom
- framer-motion
- lucide-react
- tailwindcss

### Formulaires
- react-hook-form
- zod

### Dates
- date-fns

### Framework
- next
- typescript

---

## ⚠️ Notes Importantes

### Versions Fixes vs Flexibles

```json
"next": "14.2.0"           // Version exacte (recommandé pour Next.js)
"react": "^18.2.0"         // Version compatible (^)
"@types/node": "^20"       // Version majeure
```

### Peer Dependencies

Certaines dépendances requièrent d'autres packages:
- `framer-motion` requiert `react` et `react-dom`
- `lucide-react` requiert `react`
- `react-hook-form` requiert `react`

---

## 🔐 Sécurité

### Audit de Sécurité
```bash
npm audit
npm audit fix
```

### Dépendances Critiques

Ces packages gèrent des données sensibles:
- **bcryptjs**: Mots de passe
- **jsonwebtoken**: Authentification
- **@prisma/client**: Accès base de données

⚠️ **Toujours maintenir à jour !**

---

## 📚 Documentation Officielle

- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [date-fns](https://date-fns.org/docs)
- [Zod](https://zod.dev)

---

## 🎓 Alternatives Considérées

| Besoin | Choisi | Alternative | Pourquoi choisi |
|--------|--------|-------------|-----------------|
| ORM | Prisma | TypeORM | Meilleure DX, type-safety |
| Dates | date-fns | Moment.js | Plus léger, modulaire |
| Icônes | Lucide | Heroicons | Plus d'icônes |
| Forms | React Hook Form | Formik | Plus performant |
| CSS | Tailwind | Styled Components | Utility-first, rapide |

---

*Documentation des dépendances - Dernière mise à jour: 2024*
