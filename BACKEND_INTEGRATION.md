# Backend Integration Checklist

Everything the frontend needs from the backend developer before Genesis Pro
LTD can go from demo mode to a real, production-connected site. Hand this
file to whoever is building the VPS backend — it's the exact contract the
frontend already codes against in `lib/api/`.

Nothing here is optional filler: every endpoint listed is already called by
a page in the dashboard. If an endpoint below isn't built yet, that one
screen simply keeps showing demo data (or a loading/error state) until it
is — the two sides can be built and connected incrementally.

---

## 1. Infrastructure basics

- [ ] **A base API URL**, reachable over HTTPS from the public internet
      (e.g. `https://api.genesispro.com`). This is the one value that goes
      into the frontend's `NEXT_PUBLIC_API_BASE_URL` env var — nothing else
      in the frontend should ever hardcode the VPS IP or hostname.
- [ ] **CORS** configured on the backend to allow the frontend's deployed
      origin (its Render URL, and any custom domain later), with
      `Access-Control-Allow-Credentials: true`.
- [ ] **Session auth via httpOnly cookie.** The frontend never stores a
      token in localStorage — it expects the backend to set a `Secure`,
      `httpOnly`, `SameSite` session cookie on login, and to accept it on
      every subsequent request (the frontend sends `credentials: "include"`
      on every call).
- [ ] **401 handling.** Any request made with an expired/invalid session
      should return HTTP 401 — the frontend already listens for this and
      redirects the user to `/login`.
- [ ] **JSON in, JSON out** for all endpoints below except the KYC document
      upload, which is `multipart/form-data`.

## 2. Environment variables the frontend needs from you

| Variable                   | Value                                                    |
| --------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`  | Your HTTPS API base URL, e.g. `https://api.genesispro.com` |
| `NEXT_PUBLIC_APP_MODE`      | Set to `production` once the endpoints below are live      |

These get set in Render's dashboard (or `.env.local` for local testing) — no
code changes needed on the frontend side to switch over.

## 3. Security ground rules

- The frontend **never** handles a Bitcoin private key, signs a transaction,
  or generates a deposit address itself — it only displays what you return.
- The frontend **never** computes or trusts a balance/P&L figure it wasn't
  given by the backend — all financial figures are authoritative from your
  side.
- No API secret, database credential, or wallet key should ever be required
  *in* the frontend — if an endpoint needs one, it stays server-side on the
  VPS.
- Withdrawal requests are just that — *requests*. The backend must validate
  amount, balance, and destination address before broadcasting anything.

---

## 4. Endpoint contract, by domain

Types referenced below (`User`, `Position`, `WalletSummary`, etc.) are
defined precisely in `lib/api/types.ts` — treat that file as the
source of truth for field names and shapes.

### Auth — `lib/api/services/auth.ts`

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/auth/login` | `{ email, password }` | `{ user }` — also sets the session cookie |
| POST | `/auth/logout` | — | `204` |
| POST | `/auth/register` | registration fields (name, DOB, address, account preferences, ID type — see the 5-step form) | `{ user }` |
| GET | `/auth/session` | — | `{ user }` (401 if not logged in) |
| POST | `/auth/forgot-password` | `{ email }` | `204` |

### Users — `lib/api/services/users.ts`

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/users/me` | — | `User` |
| PATCH | `/users/me` | `{ firstName?, lastName?, email? }` | `User` |
| POST | `/users/me/password` | `{ currentPassword, newPassword }` | `204` |

### Accounts — `lib/api/services/accounts.ts`

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/accounts/me` | — | `{ accountType: "Basic" \| "Professional" \| "Premium" }` |
| POST | `/accounts/me/upgrade` | `{ accountType }` | `User` |

### Markets — `lib/api/services/markets.ts`

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/markets` | `MarketInstrument[]` — `{ symbol, category, price, changePercent }` |
| GET | `/markets/:symbol` | `MarketInstrument` |

This should be backed by a real, licensed market-data feed before going
live — the site explicitly avoids implying live prices until then.

### Portfolio — `lib/api/services/portfolio.ts`

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/portfolio/summary` | `PortfolioSummary` — `{ balance, availableFunds, unrealizedPl, todayPl, todayPlPercent, equityCurve[] }` |
| GET | `/portfolio/positions` | `Position[]` — `{ id, symbol, side, size, entryPrice, currentPrice, pl }` |

### Trading — `lib/api/services/trading.ts`

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/trading/orders` | `{ symbol, side: "Buy"\|"Sell", orderType: "Market"\|"Limit"\|"Stop", quantity }` | `Position` |
| DELETE | `/trading/positions/:id` | — | `204` |

### Wallet — `lib/api/services/wallet.ts`

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/wallet/summary` | — | `WalletSummary` — `{ totalBalanceUsd, availableBalanceUsd, pendingBalanceUsd, assets: [{ asset, total, available, pending }] }` |
| POST | `/wallet/transfer` | `{ fromAsset, toAsset, amount }` | `204` |

### Bitcoin — `lib/api/services/bitcoin.ts` (used by both the Deposits and Withdrawals pages)

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/bitcoin/deposit-address` | — | `{ address, network: "Bitcoin", assignedAt }` |
| GET | `/bitcoin/deposits` | — | `BitcoinDeposit[]` — `{ id, amountBtc, status, confirmations, confirmationsRequired, txId, createdAt }` |
| GET | `/bitcoin/withdrawals` | — | `BitcoinWithdrawal[]` — `{ id, destinationAddress, amountBtc, networkFeeBtc, status, txId, createdAt }` |
| POST | `/bitcoin/withdrawals` | `{ destinationAddress, amountBtc }` | `BitcoinWithdrawal` |

`status` on both deposits and withdrawals must be one of: `pending`,
`confirming`, `confirmed`, `completed`, `failed`, `cancelled` — the frontend
renders a status badge keyed exactly to these six values.

**Question for your brother:** how should the frontend learn about a status
change (new confirmation, deposit completed) — is polling the `GET`
endpoints above sufficient to start, or will there be a websocket/webhook
later? Polling is fine for launch; it's worth confirming so nobody builds a
websocket layer that isn't needed yet.

### USDT — `lib/api/services/usdt.ts` (used by both the Deposits and Withdrawals pages)

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/usdt/deposit-address?network=TRC20\|ERC20\|BEP20` | — | `{ address, network, assignedAt }` |
| GET | `/usdt/deposits` | — | `UsdtDeposit[]` — `{ id, amountUsdt, network, status, confirmations, confirmationsRequired, txId, createdAt }` |
| GET | `/usdt/withdrawals` | — | `UsdtWithdrawal[]` — `{ id, destinationAddress, amountUsdt, network, networkFeeUsdt, status, txId, createdAt }` |
| POST | `/usdt/withdrawals` | `{ destinationAddress, amountUsdt, network }` | `UsdtWithdrawal` |

USDT is multi-chain — the same `status` values as Bitcoin apply, but every
deposit address and withdrawal is tied to a specific network (`TRC20`,
`ERC20`, or `BEP20`). The frontend lets the client pick a network before
requesting a deposit address or submitting a withdrawal; the backend should
reject a withdrawal whose destination address doesn't look valid for the
selected network. If you're only supporting one network at launch (TRC20 is
the cheapest/most common for USDT), that's fine — just confirm which one so
the frontend can default to it.

### Transactions — `lib/api/services/transactions.ts`

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/transactions` | `Transaction[]` — `{ id, type: "Deposit"\|"Withdrawal"\|"Trade Settlement"\|"Transfer", asset, amount, status, txId, date }` |

### KYC — `lib/api/services/kyc.ts`

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/kyc/status` | — | `{ status: "not_started"\|"pending"\|"verified"\|"rejected", submittedDocuments: [{ type, status, uploadedAt }] }` |
| POST | `/kyc/documents` | multipart: `documentType`, `file` | `202` |

The frontend never verifies identity itself — it just relays the uploaded
document to whichever KYC provider the backend integrates with.

### Notifications — `lib/api/services/notifications.ts`

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/notifications` | `NotificationItem[]` — `{ id, title, body, read, createdAt }` |
| POST | `/notifications/:id/read` | `204` |

### Support — `lib/api/services/support.ts`

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/support/tickets` | — | `SupportTicket[]` — `{ id, subject, status, createdAt }` |
| POST | `/support/tickets` | `{ topic, details }` | `SupportTicket` |

---

## 5. Suggested rollout order

You don't need all of this on day one. A sensible build order for your
backend developer:

1. **Auth** (`/auth/login`, `/auth/session`, `/auth/register`) — nothing
   else matters until sessions work.
2. **Users / Accounts** — basic profile.
3. **Wallet + Bitcoin + USDT** — this is the core "why we're doing this"
   feature: deposit address, deposit status, withdrawal request + status,
   for both assets.
4. **Portfolio / Transactions** — history and balances.
5. **Markets / Trading** — can stay on demo data the longest, since it
   needs a licensed market-data feed and execution engine, which is a
   bigger lift than the rest.
6. **KYC / Notifications / Support** — round these out once the core money
   flows are solid.

## 6. What "done" looks like for one endpoint

Take any row above, e.g. `GET /wallet/summary`. It's done when:

- It's live at `https://<your-api-url>/wallet/summary`.
- It requires the session cookie (returns 401 without one).
- It returns exactly the shape in `lib/api/types.ts` → `WalletSummary`.
- CORS allows the deployed frontend origin with credentials.

Once every endpoint in a section above meets that bar, flip
`NEXT_PUBLIC_APP_MODE=production` and `NEXT_PUBLIC_API_BASE_URL` in Render —
no frontend code changes needed.
