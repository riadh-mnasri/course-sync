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
- A Supabase project (free tier): [supabase.com](https://supabase.com)

### Environment variables

Create a `.env.local` file at the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-or-publishable-key>
```

### Database

The schema lives in `supabase/migrations/20260731000001_init.sql`. It creates:

- the `items` table (active list, with Realtime enabled)
- the `item_history` table (purchase history, for suggestions)
- the `item_habits` view (computes repurchase frequency per item)

Apply this SQL file to your Supabase project (via the dashboard SQL editor, or `psql`).

### Run the dev server

```bash
npm install
npm run dev
```

The app is available at [http://localhost:3900](http://localhost:3900).

### Tests

```bash
npm run lint
npm run build
```

## Deployment

Deployed on [Vercel](https://vercel.com). Remember to configure the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in the Vercel project settings.

## License

© 2026 Riadh MNASRI
