# Genesis Pro LTD

A modern, premium financial brokerage frontend for Genesis Pro LTD — built with
Next.js (App Router), TypeScript, and Tailwind CSS. Dark navy/gold/blue design,
full marketing site, account onboarding, legal pages, and a client dashboard
with a Bitcoin wallet, deposit, and withdrawal experience.

The frontend is built **API-ready**: it never talks to a database or wallet
infrastructure directly. All account, trading, and wallet data flows through a
single service layer in `lib/api/`, which currently returns clearly-labelled
demo data and is designed to be pointed at a real backend with one environment
variable. See [Backend Integration](#backend-integration) below for exactly
what to get from your backend developer.

## Tech stack

- **Next.js 16** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS**
- **qrcode** for Bitcoin deposit address QR codes
- No database, auth provider, or payment SDK is bundled — those live on the
  backend.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | Description                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the local dev server                |
| `npm run build` | Production build                          |
| `npm start`     | Run the production build (binds to `PORT`)|
| `npm run lint`  | Lint with ESLint                          |

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need. The site works
out of the box with **no environment variables set** — it runs in demo mode
with clearly-labelled placeholder data everywhere.

| Variable                    | Purpose                                                                 |
| ---------------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL`   | Base URL of the backend API (e.g. `https://api.genesispro.com`). Required to leave demo mode. |
| `NEXT_PUBLIC_APP_MODE`       | `demo` (default) or `production`. Production only activates once `NEXT_PUBLIC_API_BASE_URL` is also set — see `lib/api/config.ts`. |
| `NEXT_PUBLIC_SITE_URL`       | Public URL this site is deployed at, used for metadata/sitemap/robots.  |

The rest of the variables in `.env.example` (database, KYC provider, payments,
Bitcoin node, etc.) are **backend-only** placeholders documenting the
integration surface — they are never read by this frontend.

## Project structure

```
app/                     Routes (App Router)
  (marketing sections)   Homepage sections live in components/sections/
  login/, open-account/  Auth flows
  dashboard/             Client dashboard (portfolio, wallet, trade, etc.)
  legal/                 Privacy, terms, risk disclosure, cookie, AML/KYC, complaints
components/               Shared UI components
lib/api/                 API service layer (see below)
lib/data.ts              Static marketing content (nav, FAQs, account types, etc.)
```

## API service layer

Every piece of dynamic data in the dashboard goes through `lib/api/`:

```
lib/api/
  config.ts       API_BASE_URL + demo/production mode resolution
  client.ts       fetch wrapper: timeouts, retries, session-expiry handling
  types.ts        Shared response types — the contract for the backend
  mock.ts         Demo-mode fixtures (never shipped as real data in production)
  services/
    auth.ts         login, logout, register, session, password reset
    users.ts        profile, change password
    accounts.ts     account type / upgrade
    markets.ts       instrument prices
    portfolio.ts     balance, positions
    trading.ts       place/close orders
    wallet.ts        balances, transfers
    bitcoin.ts       BTC deposit address, deposits, withdrawals
    usdt.ts          USDT (TRC20/ERC20/BEP20) deposit address, deposits, withdrawals
    deposits.ts      re-exports bitcoin + usdt deposit functions
    withdrawals.ts   re-exports bitcoin + usdt withdrawal functions
    transactions.ts  transaction history
    kyc.ts           verification status, document upload
    notifications.ts in-app notifications
    support.ts       support tickets
    accountRequests.ts  public Open Account form submission
    admin.ts         admin: list/create/delete users, edit balances, review account requests
```

Each service function checks `IS_DEMO_MODE`: in demo mode it returns mock data
with a simulated delay; otherwise it calls the real backend via `apiFetch()`.
**No UI component calls `fetch` directly** — this is what lets the backend
get wired in without touching any page or component.

## How accounts get created

There is no self-service signup. The "Open Account" form (`/open-account`)
submits a request via `accountRequestsApi` — it does not create a live
account. An admin reviews submissions at `/admin/requests`, copies the
details or clicks through to a pre-filled Create User form, and creates
the account manually via `adminApi`. See `/admin` (Overview, Users,
Account Requests) for the full admin panel: listing/creating/deleting
users and editing balances.

**`/admin` has no real authentication in this codebase.** It's not linked
from public navigation and is excluded from search indexing, but that is
not access control — anyone with the URL can reach it. Before going live,
every `/admin/*` backend endpoint must verify the caller holds an admin
role, and the `/admin` frontend route itself should redirect to login for
non-admin sessions. See `BACKEND_INTEGRATION.md` for the full endpoint
contract and what "done" needs to look like here specifically.

## Deployment (Render)

This repo includes a `render.yaml` blueprint. Either:

1. **Blueprint deploy**: In Render, "New +" → "Blueprint", point it at this
   repo. It reads `render.yaml` automatically.
2. **Manual Web Service**: Create a Node web service with:
   - Build command: `npm ci && npm run build`
   - Start command: `npm start`
   - Health check path: `/`
   - Env vars: set `NEXT_PUBLIC_SITE_URL` to your Render URL once assigned,
     and `NEXT_PUBLIC_API_BASE_URL` / `NEXT_PUBLIC_APP_MODE=production` once
     the backend is ready.

`npm start` binds to the `PORT` Render injects automatically.

## Backend Integration

The backend (auth, database, trading engine, Bitcoin wallet infrastructure) is
being built separately and will run on a VPS. **Nothing in this frontend holds
private keys, signs transactions, or trusts client-supplied balances** — it
only displays what the backend returns.

For the full endpoint-by-endpoint contract — what to request from your backend
developer before flipping the site into production mode — see the checklist
document: **`BACKEND_INTEGRATION.md`** in this repo (also delivered as a
shareable doc alongside this README).

The short version of what you need back from him:

1. A base API URL (e.g. `https://api.genesispro.com`) reachable over HTTPS.
2. Every endpoint listed in `BACKEND_INTEGRATION.md`, matching the request/
   response shapes in `lib/api/types.ts`.
3. Session handling via an **httpOnly, Secure cookie** set on login — the
   frontend never stores a token in localStorage.
4. CORS configured to allow this site's deployed origin, with
   `credentials: true`.
5. Confirmation of how Bitcoin/USDT deposit confirmations and status updates
   reach the frontend (polling the existing `GET` endpoints is enough to
   start), and which USDT network(s) — TRC20, ERC20, BEP20 — you'll support.

Once you have that, set `NEXT_PUBLIC_API_BASE_URL` and
`NEXT_PUBLIC_APP_MODE=production` in Render's environment variables and
redeploy — no frontend code changes required.
