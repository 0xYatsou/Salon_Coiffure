
# 🚀 Guide de Connexion Base de Données Vercel (PostgreSQL)

Pour que votre site fonctionne en ligne, nous devons connecter une "vraie" base de données. Vercel rend cela très simple (et gratuit).

## Étape 1 : Créer la Base de Données sur Vercel

1. Allez sur votre tableau de bord Vercel (https://vercel.com/dashboard).
2. Cliquez sur votre projet `salon-coiffure`.
3. Allez dans l'onglet **Storage** (en haut).
4. Cliquez sur le bouton **Create Database** -> Sélectionnez **Postgres**.
5. Acceptez les conditions et donnez un nom (ex: `salon-db`), choisissez la région (ex: `Frankfurt` ou `Paris` si dispo).
6. Cliquez sur **Create**.

## Étape 2 : Connecter la Base au Projet

1. Une fois la base créée, Vercel vous proposera peut-être un bouton **"Connect Project"**. Si oui, cliquez dessus et sélectionnez votre projet.
2. Sinon, allez dans les **Settings** de votre projet -> **Environment Variables**.
3. Vous devriez voir des variables ajoutées automatiquement (`POSTGRES_PRISMA_URL`, `POSTGRES_URL`, etc.). Si elles sont là, c'est gagné ! ✅

## Étape 3 : Initialiser la Base de Données

Maintenant que la base est liée, nous devons créer les tables (Clients, Réservations, etc.) dedans.

Depuis votre terminal local (VS Code), lancez ces commandes une par une :

1. Récupérez les variables d'environnement de Vercel vers votre PC local :
   ```bash
   npx vercel env pull .env.development.local
   ```

2. Poussez le schéma vers la base de données en ligne :
   ```bash
   npx prisma db push
   ```

3. (Optionnel) Lancez le studio pour voir vos données :
   ```bash
   npx prisma studio
   ```

## Étape 4 : Redéployer

Une fois la base initialisée, relancez simplement un déploiement pour que le site de production "sache" qu'il doit utiliser cette base :

```bash
npx vercel deploy --prod
```
