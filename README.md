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
- [Docker](https://www.docker.com) (pour faire tourner Supabase en local, isolé de la production)
- Le [CLI Supabase](https://supabase.com/docs/guides/local-development/cli/getting-started)

### Base de données locale

Le développement utilise une instance Supabase 100% locale (Postgres + Realtime dans Docker), séparée de la base de production. Aucune donnée réelle n'est jamais touchée pendant le dev.

```bash
supabase start
```

Cette commande applique automatiquement le schéma de `supabase/migrations/20260731000001_init.sql` (table `items`, table `item_history`, vue `item_habits`) sur la base locale. À l'arrêt : `supabase stop`.

### Variables d'environnement

`.env.local` (non versionné) pointe vers l'instance locale :

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé anon affichée par `supabase status`>
```

Les identifiants de production (utilisés uniquement par Vercel) sont dans `.env.production.local` (non versionné, à ne jamais utiliser en dev).

### Lancer le serveur de dev

```bash
npm install
supabase start
npm run dev
```

L'application est disponible sur [http://localhost:3900](http://localhost:3900). Le Studio Supabase local (pour inspecter les données de dev) est sur [http://localhost:54323](http://localhost:54323).

### Tests

```bash
npm run lint
npm run build
```

## Déploiement

Déployé sur [Vercel](https://vercel.com). Penser à configurer les variables d'environnement `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans les paramètres du projet Vercel.

## Licence

© 2026 Riadh MNASRI
