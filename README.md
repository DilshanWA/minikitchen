# Mini Kitchen

A responsive restaurant experience built with Next.js 16, React, Tailwind CSS, and Supabase.

## Run locally

```bash
npm install
npm run dev
```

The app reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from `.env.local`. Never put a Supabase service-role key in a `NEXT_PUBLIC_` variable.

## Enable reservations

1. Open the Supabase SQL Editor for your project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql).
3. Confirm the two variables above point to the same project.

The reservation form validates required fields in the browser and again inside the Server Action before inserting into `public.reservations`. It returns a clear error state when Supabase is unavailable rather than showing a false confirmation.

## Checks

```bash
npm run lint
npm run build
```
