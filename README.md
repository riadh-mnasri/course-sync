# CourseSync

La liste de courses du foyer, synchronisée en temps réel entre tous les appareils. Ajoutez un article sur votre téléphone, il apparaît instantanément sur celui de votre conjoint(e). CourseSync apprend aussi vos habitudes d'achat et suggère de rajouter les articles que vous rachetez régulièrement.

## Fonctionnalités

- Liste partagée en temps réel (Supabase Realtime) : pas de rechargement nécessaire, les changements apparaissent instantanément sur tous les appareils connectés
- Cochez les articles pendant vos courses, puis videz le panier en une fois à la fin pour archiver l'historique d'achat
- Suggestions automatiques basées sur la fréquence de rachat de chaque article
- Interface bilingue français / anglais
- Design soigné, pensé mobile-first

## Stack technique

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS 4
- [Supabase](https://supabase.com) (Postgres + Realtime) pour la synchronisation des données
- [next-intl](https://next-intl.dev) pour l'internationalisation

## Développement local

### Prérequis

- Node.js 20+
- Un projet Supabase (gratuit) : [supabase.com](https://supabase.com)

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```
NEXT_PUBLIC_SUPABASE_URL=https://<votre-projet>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre-clé-anon-ou-publishable>
```

### Base de données

Le schéma se trouve dans `supabase/migrations/20260731000001_init.sql`. Il crée :

- la table `items` (liste active, avec Realtime activé)
- la table `item_history` (historique des achats, pour les suggestions)
- la vue `item_habits` (calcul de la fréquence de rachat par article)

Appliquer ce fichier SQL sur votre projet Supabase (via l'éditeur SQL du dashboard, ou `psql`).

### Lancer le serveur de dev

```bash
npm install
npm run dev
```

L'application est disponible sur [http://localhost:3900](http://localhost:3900).

### Tests

```bash
npm run lint
npm run build
```

## Déploiement

Déployé sur [Vercel](https://vercel.com). Penser à configurer les variables d'environnement `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans les paramètres du projet Vercel.

## Licence

© 2026 Riadh MNASRI
