# 🤝 Guide de Contribution

## Bienvenue !

Merci de votre intérêt pour contribuer à ce projet. Ce guide vous aidera à comprendre comment participer efficacement.

## 📋 Table des Matières

1. [Code de Conduite](#code-de-conduite)
2. [Comment Contribuer](#comment-contribuer)
3. [Standards de Code](#standards-de-code)
4. [Workflow Git](#workflow-git)
5. [Tests](#tests)
6. [Documentation](#documentation)

## 🤝 Code de Conduite

- Soyez respectueux et professionnel
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est meilleur pour le projet
- Montrez de l'empathie envers les autres contributeurs

## 💡 Comment Contribuer

### Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Créez une issue avec:
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Screenshots si applicable
   - Environnement (OS, navigateur, version Node)

### Proposer une Fonctionnalité

1. Créez une issue "Feature Request"
2. Décrivez:
   - Le problème que ça résout
   - La solution proposée
   - Les alternatives considérées
   - Impact sur l'existant

### Soumettre du Code

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Standards de Code

### TypeScript

```typescript
// ✅ BON
interface User {
  id: string;
  email: string;
  name: string;
}

function createUser(data: User): Promise<User> {
  // Implementation
}

// ❌ MAUVAIS
function createUser(data: any) {
  // Implementation
}
```

### React Components

```tsx
// ✅ BON - Composant fonctionnel avec types
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
}

// ❌ MAUVAIS - Pas de types
export function Button({ label, onClick, variant }) {
  // ...
}
```

### Naming Conventions

```typescript
// Variables et fonctions: camelCase
const userName = "John";
function getUserById(id: string) {}

// Composants React: PascalCase
function UserProfile() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// Fichiers:
// - Composants: PascalCase (UserProfile.tsx)
// - Utils: camelCase (dateUtils.ts)
// - API Routes: kebab-case (user-profile.ts)
```

### Structure des Fichiers

```typescript
// 1. Imports externes
import { useState } from 'react';
import { format } from 'date-fns';

// 2. Imports internes
import { Button } from '@/components/Button';
import { formatDate } from '@/lib/utils';

// 3. Types/Interfaces
interface Props {
  // ...
}

// 4. Constantes
const DEFAULT_VALUE = 10;

// 5. Composant/Fonction principale
export function MyComponent() {
  // ...
}

// 6. Exports secondaires
export { type Props };
```

### Commentaires

```typescript
// ✅ BON - Commentaire utile
/**
 * Calcule le prix total avec les taxes
 * @param basePrice - Prix de base HT
 * @param taxRate - Taux de taxe (ex: 0.20 pour 20%)
 * @returns Prix TTC arrondi à 2 décimales
 */
function calculateTotalPrice(basePrice: number, taxRate: number): number {
  return Math.round((basePrice * (1 + taxRate)) * 100) / 100;
}

// ❌ MAUVAIS - Commentaire inutile
// Cette fonction additionne deux nombres
function add(a: number, b: number) {
  return a + b;
}
```

## 🌿 Workflow Git

### Branches

```
main
  ├── develop
  │   ├── feature/user-authentication
  │   ├── feature/booking-system
  │   └── bugfix/date-validation
  └── hotfix/critical-security-fix
```

### Commits Conventionnels

Format: `<type>(<scope>): <subject>`

Types:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage (pas de changement de code)
- `refactor`: Refactoring
- `test`: Ajout/modification de tests
- `chore`: Maintenance

Exemples:
```bash
git commit -m "feat(booking): add time slot validation"
git commit -m "fix(api): prevent double bookings"
git commit -m "docs(readme): update installation steps"
git commit -m "refactor(utils): simplify date formatting"
```

### Pull Requests

Template:
```markdown
## Description
[Description claire des changements]

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai commenté les parties complexes
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai testé localement

## Screenshots (si applicable)
[Ajouter des screenshots]
```

## 🧪 Tests

### Structure

```
app/
  ├── components/
  │   ├── Button.tsx
  │   └── Button.test.tsx
  └── lib/
      ├── utils.ts
      └── utils.test.ts
```

### Exemple de Test

```typescript
// utils.test.ts
import { describe, it, expect } from 'vitest';
import { calculateEndTime } from './utils';

describe('calculateEndTime', () => {
  it('should add minutes to start time', () => {
    const start = new Date('2024-01-01T10:00:00');
    const result = calculateEndTime(start, 30);
    
    expect(result.getHours()).toBe(10);
    expect(result.getMinutes()).toBe(30);
  });

  it('should handle hour overflow', () => {
    const start = new Date('2024-01-01T23:45:00');
    const result = calculateEndTime(start, 30);
    
    expect(result.getDate()).toBe(2);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(15);
  });
});
```

## 📚 Documentation

### Code

- Utilisez JSDoc pour les fonctions publiques
- Commentez les algorithmes complexes
- Expliquez le "pourquoi", pas le "quoi"

### README

Mettez à jour le README si vous:
- Ajoutez une dépendance
- Changez la configuration
- Ajoutez une fonctionnalité majeure
- Modifiez le processus d'installation

### CHANGELOG

Format:
```markdown
## [1.1.0] - 2024-01-15

### Added
- Système de notification par email
- Export des réservations en CSV

### Changed
- Amélioration de la performance du calendrier
- Mise à jour de la palette de couleurs

### Fixed
- Correction du bug de double réservation
- Fix du responsive sur mobile

### Deprecated
- API v1 (sera supprimée en v2.0)
```

## 🔍 Code Review

### Pour les Reviewers

Vérifiez:
- [ ] Le code respecte les standards
- [ ] Les tests passent
- [ ] Pas de code dupliqué
- [ ] Pas de secrets exposés
- [ ] Performance acceptable
- [ ] Accessibilité respectée
- [ ] Documentation à jour

### Pour les Auteurs

Avant de soumettre:
- [ ] Testez localement
- [ ] Relisez votre code
- [ ] Vérifiez les lints
- [ ] Mettez à jour la doc
- [ ] Squash les commits si nécessaire

## 🚀 Déploiement

### Checklist Pré-Déploiement

- [ ] Tests passent
- [ ] Build réussit
- [ ] Variables d'environnement configurées
- [ ] Migrations DB appliquées
- [ ] Documentation à jour
- [ ] CHANGELOG mis à jour

## 📞 Questions ?

- Créez une issue avec le tag "question"
- Consultez la documentation existante
- Rejoignez les discussions

## 🎉 Merci !

Chaque contribution, petite ou grande, est appréciée. Merci de faire partie de ce projet !

---

*Dernière mise à jour: 2024*
