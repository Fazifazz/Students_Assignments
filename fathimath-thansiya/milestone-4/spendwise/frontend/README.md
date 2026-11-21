# SpendWise — Frontend

React 18 + Vite single-page app. JavaScript (ES6+), Material UI 6, React Router 6,
TanStack Query 5, Axios, React Hook Form + Zod, Recharts, Day.js, React Toastify.

## Scripts

```bash
npm run dev       # dev server on :5173 (proxies /api -> VITE_PROXY_TARGET)
npm run build     # production bundle in dist/
npm run preview   # serve the production bundle locally
npm run lint      # ESLint (flat config)
```

## Environment

Copy `.env.example` to `.env`:

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_URL` | Base URL for API calls | `/api` |
| `VITE_PROXY_TARGET` | Where the dev proxy forwards `/api` | `http://localhost:5000` |

`.env` is git-ignored; only `.env.example` is committed. **Never put a secret in a
`VITE_*` variable** — they are embedded in the public bundle.

## Structure

```
src/
├── app/            App shell: providers + router wiring
├── components/     Reusable UI
│   ├── charts/     Recharts wrappers (bar, pie, line)
│   ├── common/     Card, SummaryCard, PageHeader, FormDialog, ConfirmDialog, states
│   ├── layout/     Sidebar, Header, mobile drawer
│   └── transactions/ Reusable transaction table
├── config/         env + navigation configuration
├── features/       Feature slices (auth, dashboard, transactions, categories, budgets,
│   │               savingsGoals, analytics) — each with api.js query hooks
├── hooks/          useDebouncedValue, usePreferences
├── layouts/        AppLayout (shell that hosts the routes)
├── pages/          Route-level screens
├── routes/         Route table + route guards
├── services/       axios instance + API modules
├── theme/          MUI theme and design tokens
└── utils/          money, format, validation, budget, constants
```

## Conventions

- **Money** — every amount crosses the wire as integer paise (`amountPaise`). `utils/money.js`
  converts at the display boundary only. User input is parsed with `parseAmountToMinorUnits`,
  which rejects anything that is not a clean decimal with at most two fraction digits.
- **Data fetching** — components never call axios directly. `services/api/*` performs
  requests; `features/*/api.js` wraps them in TanStack Query hooks with cache keys and
  invalidation.
- **Forms** — React Hook Form + Zod via `@hookform/resolvers/zod`. Schemas live in
  `utils/validation.js`. **The resolver schema must be an object schema** (`z.object({...})`)
  so its output maps onto the form fields — a bare field schema validates silently and the
  submit handler never runs.
- **Design system** — all colours, radii and shadows live in `theme/index.js`. Components
  must not hard-code brand colours.
- **States** — every data surface renders a skeleton while loading, an `EmptyState` when
  there is nothing to show, and an `ErrorState` with a retry action on failure.
- **Layout** — CSS grid (`<Box sx={{ display: 'grid', gridTemplateColumns: {...} }}>`), not
  MUI `Grid`. MUI v6's `Grid` uses negative margins for spacing, which overflows the
  viewport on narrow screens.
- **Charts** — animation is disabled so charts never render blank on resize or when a
  filter changes.

## Authentication

The session token is an HTTP-only cookie set by the backend. The frontend never reads,
writes or stores a token. `features/auth/AuthContext.jsx` restores the session on boot with
a single `GET /api/auth/me` and clears its cache on sign-in and sign-out.

The only thing in `localStorage` is `spendwise.preferences` (currency and notification
toggles) — display settings, never credentials.
