# HUNAR Marketplace

Next.js + Supabase freelance marketplace for Pakistani talent and global clients.

## Production backend
A dedicated Supabase project has been created for HUNAR in the Asia Pacific (Mumbai) region. The database schema includes profiles, categories, services, projects, orders, messages, reviews and transactions, with Row Level Security enabled.

## Environment variables
Set these in local development and Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The public project URL is available from the Supabase dashboard. Never expose a Supabase service-role key in frontend code.

## Run
1. `npm install`
2. Add the environment variables above.
3. `npm run dev`

## Marketplace roadmap
Authentication, protected dashboards, service/project CRUD, proposals, real-time messaging, order lifecycle, reviews, wallet/withdrawals, admin controls and payment-provider integration are the next application-layer steps.
