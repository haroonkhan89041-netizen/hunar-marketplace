# HUNAR Marketplace

**Pakistan's Talent. The World's Opportunities.**

HUNAR is a professional freelance marketplace built with Next.js and Supabase, connecting Pakistani freelancers with clients globally.

## Current features

- Email authentication and protected user flows
- Client and freelancer profiles
- Freelancer talent discovery and category browsing
- Freelancer services with pricing and delivery times
- Client project posting and project discovery
- Proposal submission, validation and secure acceptance
- Secure service ordering and checkout requirements
- Order lifecycle with role-based status transitions
- Order-specific messaging and realtime chat
- Completed-order reviews with rating validation
- Service rating and review-count refresh
- Responsive marketplace UI for desktop and mobile
- Production-focused Supabase Row Level Security policies and security-definer RPCs
- Global 404 page and accessible navigation

## Production backend

HUNAR uses a dedicated Supabase PostgreSQL backend in the Asia Pacific (Mumbai) region. Core marketplace data includes profiles, categories, services, projects, orders, messages, reviews, transactions and proposals.

Database access is protected with Row Level Security. Sensitive marketplace actions such as accepting proposals, changing order status, rejecting proposals and creating service orders are handled through validated server-side database functions.

## Environment variables

Set these in local development and Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

`NEXT_PUBLIC_SUPABASE_ANON_KEY` can be used where the project is configured for the legacy Supabase anon key.

Never expose a Supabase service-role key in frontend code.

## Run locally

1. Install Node.js.
2. Run `npm install`.
3. Add the Supabase environment variables.
4. Run `npm run dev`.
5. Open the local URL shown by Next.js.

## Project structure

- `app/` — Next.js App Router pages and application UI
- `app/freelancer/` — freelancer discovery, profiles and service creation
- `app/project/` — client project creation, discovery and proposals
- `app/orders/` — order list, order details and lifecycle actions
- `app/messages/` — order messaging
- `app/profile/` — authenticated profile management
- `lib/` — Supabase client utilities
- `supabase/` — database migrations and backend configuration

## Remaining production work

- Connect a real payment gateway before taking live payments
- Build a full wallet and withdrawal workflow if marketplace payouts are enabled
- Add dedicated admin moderation and operational dashboards
- Configure production environment variables and domain settings in the hosting provider
- Run a final production build and end-to-end QA against the deployed environment

## Brand

**HUNAR** — Pakistan's Talent. The World's Opportunities.
