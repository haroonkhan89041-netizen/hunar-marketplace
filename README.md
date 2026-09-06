# HUNAR V1 — real application starter

Next.js + Supabase foundation based on the Google Stitch HUNAR design.

## Run
1. Install Node.js 20+.
2. `npm install`
3. Copy `.env.example` to `.env.local` and add Supabase URL + anon key.
4. `npm run dev`

## Database
Run `supabase/schema.sql` in the Supabase SQL Editor.

## Current foundation
Public homepage, talent search, freelancer profile, checkout, login/signup, work marketplace, categories, and how-it-works routes are included. Supabase schema covers profiles, categories, services, projects, orders, messages, reviews and transactions.

Next: real Supabase Auth, protected dashboards, CRUD, proposals, real-time chat, order lifecycle, reviews, wallet/withdrawals, admin roles and payment-provider integration.
