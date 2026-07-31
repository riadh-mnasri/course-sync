# CourseSync

The household shopping list, synced in real time across every device. Add an item on your phone, it appears instantly on your partner's. CourseSync also learns your shopping habits and suggests re-adding items you buy regularly.

## Features

- Shared, real-time list (Supabase Realtime): no refresh needed, changes appear instantly on every connected device
- Check items off while shopping, then clear the cart at once at the end to archive purchase history
- Automatic suggestions based on how often each item is repurchased
- Bilingual French / English interface
- Polished, mobile-first design

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS 4
- [Supabase](https://supabase.com) (Postgres + Realtime) for data sync
- [next-intl](https://next-intl.dev) for internationalization

## Local development

### Prerequisites

- Node.js 20+
- [Docker](https://www.docker.com) (to run Supabase locally, isolated from production)
- The [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)

### Local database

Development uses a fully local Supabase instance (Postgres + Realtime in Docker), separate from the production database. No real data is ever touched during development.

```bash
supabase start
```

This automatically applies the schema from `supabase/migrations/20260731000001_init.sql` (`items` table, `item_history` table, `item_habits` view) to the local database. To stop: `supabase stop`.

### Environment variables

`.env.local` (not committed) points to the local instance:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key printed by `supabase status`>
```

Production credentials (used only by Vercel) live in `.env.production.local` (not committed, never use in dev).

### Run the dev server

```bash
npm install
supabase start
npm run dev
```

The app is available at [http://localhost:3900](http://localhost:3900). The local Supabase Studio (to inspect dev data) is at [http://localhost:54323](http://localhost:54323).

### Tests

```bash
npm run lint
npm run build
```

## Deployment

Deployed on [Vercel](https://vercel.com). Remember to configure the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in the Vercel project settings.

## License

© 2026 Riadh MNASRI
