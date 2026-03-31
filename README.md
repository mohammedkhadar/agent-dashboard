# Agent Dashboard

Customer-facing organizational analytics dashboard for cloud-based AI agent usage. Engineering managers and billing admins can monitor session counts, compute hours, token consumption, member breakdowns, and session outcome quality across their organization.

## Features

- **Usage Overview** — summary cards (sessions, compute hours, active users, tokens) with date range filtering
- **Trend Charts** — time-series line charts with interactive tooltips and period-over-period comparisons
- **Member Breakdown** — sortable, paginated table of per-member usage metrics
- **Session Outcomes** — donut chart of success/error/timeout/cancelled with ranked error categories
- **Role-based access** — admin, manager, and billing roles only
- **Mock API** — MSW-powered dev environment; no backend required to run locally

## Demo Accounts

| Email | Password | Role |
|---|---|---|
| alice@acme.com | admin123 | Admin |
| bob@acme.com | manager123 | Manager |
| carol@acme.com | billing123 | Billing |
| dave@acme.com | member123 | Member (redirected to login) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with any demo account above.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Dev server with MSW mocks |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Vitest unit + component + integration tests |
| `npm run test:e2e` | Playwright e2e tests |
| `npm run test:a11y` | Accessibility audit (axe-core) |
| `npm run analyze` | Bundle size analysis |

## Stack

- **Framework**: Next.js 14 (App Router) + TypeScript 5.4
- **UI**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Data fetching**: TanStack Query
- **Mocking**: MSW 2
- **Testing**: Vitest, React Testing Library, Playwright

## Project Structure

```
src/
├── app/              # Pages (/, /members, /outcomes, /login)
├── components/
│   ├── dashboard/    # Feature components (charts, tables, cards)
│   ├── shared/       # Cross-cutting (nav, error banner, skeleton)
│   └── ui/           # shadcn/ui primitives
├── hooks/            # TanStack Query data hooks
├── lib/              # API client, types, formatters, constants
└── mocks/            # MSW handlers and fixtures

tests/
├── unit/             # Hooks, formatters, API client
├── component/        # React Testing Library
├── integration/      # Full data-flow (hook → MSW → render)
└── e2e/              # Playwright user journeys
```

## Connecting to a Real API

The mock layer is active when `NEXT_PUBLIC_MOCK_API=true` (set automatically in development). To point at a real backend:

```env
# .env.local
NEXT_PUBLIC_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

See `src/lib/api-client.ts` for the full API contract and `specs/001-org-analytics-dashboard/contracts/` for endpoint schemas.

## Next steps
- Localisation
- Setup and trigger alerts
- Team level views
- Figma MCP setup
