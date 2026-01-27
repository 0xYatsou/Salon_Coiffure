# 🧪 GUIDE DE TEST RAPIDE

## ⚡ Tests Prioritaires (5 minutes)

### 1. Test Réservation avec Disponibilité ⭐⭐⭐

**Objectif:** Vérifier que la vérification temps réel fonctionne

**Étapes:**
1. Ouvrir http://localhost:3000/booking
2. Sélectionner un service (ex: "Coupe Homme")
3. Sélectionner une date (demain par exemple)
4. **OBSERVER:** Les créneaux affichés (normalement tous disponibles si DB vide)
5. Remplir le formulaire et CRÉER une réservation à 10:00
6. **IMPORTANT:** Retourner sur `/booking`
7. Sélectionner le MÊME service et la MÊME date
8. **VÉRIFIER:** Le créneau 10:00 ne doit PLUS apparaître ✅

**Résultat attendu:**
- ✅ Créneau 10:00 disparaît de la liste
- ✅ Toast de succès s'affiche
- ✅ Impossible de double-réserver

---

### 2. Test Validation Formulaire ⭐⭐

**Objectif:** Vérifier que la validation Zod fonctionne

**Étapes:**
1. Sur `/booking`, aller jusqu'à l'étape 3 (formulaire)
2. Entrer un téléphone invalide: `123`
3. Cliquer "Confirmer"
4. **VÉRIFIER:** Message d'erreur sous le champ téléphone
5. Corriger avec un vrai numéro: `06 12 34 56 78`
6. **VÉRIFIER:** Erreur disparaît

**Résultat attendu:**
- ✅ Message d'erreur rouge sous le champ
- ✅ Toast d'erreur s'affiche
- ✅ Formulaire ne se soumet pas

---

### 3. Test Page Services ⭐

**Objectif:** Vérifier que la page existe et fonctionne

**Étapes:**
1. Aller sur http://localhost:3000
2. Cliquer sur "Nos prestations" (header)
3. **VÉRIFIER:** Page `/services` s'affiche
4. Cliquer sur "Réserver" sur un service
5. **VÉRIFIER:** Redirigé vers `/booking` avec service pré-sélectionné

**Résultat attendu:**
- ✅ Page services s'affiche
- ✅ Grille de services visible
- ✅ Lien "Réserver" fonctionne
- ✅ Service pré-sélectionné sur page booking

---

### 4. Test Middleware Admin ⭐⭐

**Objectif:** Vérifier la protection des routes

**Étapes:**
1. Ouvrir une fenêtre de navigation privée
2. Aller directement sur http://localhost:3000/admin/dashboard
3. **VÉRIFIER:** Redirigé vers `/admin/login`
4. Se connecter avec `admin@salon.com` / `admin123`
5. **VÉRIFIER:** Redirigé vers `/admin/dashboard`

**Résultat attendu:**
- ✅ Impossible d'accéder au dashboard sans login
- ✅ Redirection automatique vers login
- ✅ Après login, accès autorisé

---

### 5. Test Notifications Toast ⭐

**Objectif:** Vérifier le système de notifications

**Étapes:**
1. Sur `/booking`, créer une réservation valide
2. **OBSERVER:** Toast vert "Réservation confirmée" en haut à droite
3. Attendre 5 secondes
4. **VÉRIFIER:** Toast disparaît automatiquement

**Résultat attendu:**
- ✅ Toast vert s'affiche
- ✅ Animation d'entrée fluide
- ✅ Auto-disparition après 5s
- ✅ Bouton X pour fermer manuellement

---

## 🔍 Tests Approfondis (15 minutes)

### 6. Test Race Condition (Transaction)

**Objectif:** Vérifier qu'on ne peut pas créer 2 réservations simultanées

**Étapes:**
1. Ouvrir 2 onglets sur `/booking`
2. Dans les DEUX onglets, sélectionner le même service et la même date/heure
3. Remplir les formulaires dans les deux
4. Cliquer "Confirmer" dans les DEUX onglets **RAPIDEMENT** (< 1 seconde d'écart)
5. **VÉRIFIER:** Un seul doit réussir, l'autre doit afficher "Créneau plus disponible"

**Résultat attendu:**
- ✅ Une seule réservation créée
- ✅ L'autre reçoit une erreur 409
- ✅ Pas de doublon en base de données

---

### 7. Test Validation Téléphone

**Formats à tester:**

| Format | Valide ? | Résultat attendu |
|--------|----------|------------------|
| `06 12 34 56 78` | ✅ Oui | Accepté |
| `0612345678` | ✅ Oui | Accepté |
| `+33 6 12 34 56 78` | ✅ Oui | Accepté |
| `123` | ❌ Non | Erreur |
| `abcdefghij` | ❌ Non | Erreur |
| `` (vide) | ❌ Non | Erreur |

---

### 8. Test Créneaux Indisponibles

**Objectif:** Vérifier le message "Aucun créneau disponible"

**Étapes:**
1. Créer des réservations pour TOUS les créneaux d'une journée
2. Retourner sur `/booking`
3. Sélectionner cette date
4. **VÉRIFIER:** Message "Aucun créneau disponible" avec icône warning

**Résultat attendu:**
- ✅ Message jaune affiché
- ✅ Icône AlertCircle
- ✅ Suggestion de choisir une autre date

---

### 9. Test Navigation Entre Étapes

**Objectif:** Vérifier qu'on ne perd pas les données

**Étapes:**
1. Étape 1: Sélectionner un service
2. Étape 2: Sélectionner date et heure
3. Étape 3: Remplir le formulaire
4. Cliquer "← Retour" (étape 2)
5. **VÉRIFIER:** Date et heure toujours sélectionnées
6. Cliquer "← Retour" (étape 1)
7. **VÉRIFIER:** Service toujours sélectionné

**Résultat attendu:**
- ✅ Données conservées lors de la navigation
- ✅ Pas de perte d'information

---

### 10. Test Admin - Gestion Services

**Objectif:** Vérifier le CRUD des services

**Étapes:**
1. Se connecter à `/admin/login`
2. Aller sur "Services"
3. Cliquer "Nouveau service"
4. Créer un service avec prix négatif: `-10`
5. **VÉRIFIER:** Erreur de validation
6. Corriger avec prix valide: `50`
7. **VÉRIFIER:** Service créé avec succès
8. Modifier le service
9. Supprimer le service
10. **VÉRIFIER:** Service supprimé

**Résultat attendu:**
- ✅ Validation du prix fonctionne
- ✅ Création réussie
- ✅ Modification réussie
- ✅ Suppression réussie

---

## 🐛 Tests de Cas Limites

### 11. Test Dimanche Fermé

**Étapes:**
1. Sur `/booking`, essayer de sélectionner un dimanche
2. **VÉRIFIER:** Aucun dimanche n'apparaît dans le calendrier

---

### 12. Test Date Passée

**Étapes:**
1. Essayer de créer une réservation via API avec une date passée
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test",
    "clientPhone": "0612345678",
    "serviceId": "1",
    "date": "2020-01-01T10:00:00Z"
  }'
```
2. **VÉRIFIER:** Erreur 400 "Impossible de réserver dans le passé"

---

### 13. Test Service Inactif

**Étapes:**
1. Admin: Désactiver un service (toggle "Actif")
2. Retourner sur `/booking`
3. **VÉRIFIER:** Service n'apparaît plus dans la liste
4. Essayer de réserver via API avec ce serviceId
5. **VÉRIFIER:** Erreur "Service n'est plus disponible"

---

## ✅ CHECKLIST RAPIDE

Cochez au fur et à mesure :

**Réservation**
- [ ] Vérification disponibilité temps réel
- [ ] Validation formulaire
- [ ] Toasts de succès/erreur
- [ ] Pas de double-réservation
- [ ] Navigation fluide entre étapes

**Pages**
- [ ] Page d'accueil fonctionne
- [ ] Page services existe et fonctionne
- [ ] Page booking fonctionne
- [ ] Admin login fonctionne
- [ ] Admin dashboard fonctionne

**Sécurité**
- [ ] Middleware protège routes admin
- [ ] Validation Zod côté serveur
- [ ] Transaction atomique réservations
- [ ] Pas de race condition

**UX**
- [ ] Toasts au lieu d'alert()
- [ ] Messages d'erreur clairs
- [ ] Loader pendant chargement
- [ ] Design responsive

---

## 🚨 SI UN TEST ÉCHOUE

### Problème: Créneaux tous disponibles même après réservation

**Solution:**
1. Vérifier que l'API `/api/bookings/available-slots` est appelée
2. Ouvrir DevTools → Network → Vérifier la réponse
3. Vérifier que `selectedDate` et `selectedService` sont définis

### Problème: Toast ne s'affiche pas

**Solution:**
1. Ouvrir DevTools → Console → Chercher erreurs
2. Vérifier que `showToast` est importé
3. Vérifier que le container est créé dans le DOM

### Problème: Validation ne fonctionne pas

**Solution:**
1. Vérifier que Zod est installé: `npm list zod`
2. Vérifier les imports dans `route.ts`
3. Vérifier les logs serveur

### Problème: Middleware ne redirige pas

**Solution:**
1. Vérifier que `middleware.ts` est à la racine
2. Redémarrer le serveur dev
3. Vérifier le matcher dans `middleware.ts`

---

## 📊 RÉSULTAT ATTENDU

**Si tous les tests passent:**
- ✅ Application fonctionnelle
- ✅ Sécurité renforcée
- ✅ UX améliorée
- ✅ Prête pour tests utilisateurs

**Temps total:** ~20 minutes
**Tests critiques:** 5
**Tests approfondis:** 5
**Tests cas limites:** 3

---

**Bon test ! 🚀**
