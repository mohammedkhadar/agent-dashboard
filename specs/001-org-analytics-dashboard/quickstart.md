# Quickstart: Org Analytics Dashboard

**Feature**: 001-org-analytics-dashboard
**Date**: 2026-03-30

---

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+ or pnpm 9+

## Setup

```bash
# Clone and checkout the feature branch
git clone <repo-url> agent-dashboard
cd agent-dashboard
git checkout 001-org-analytics-dashboard

# Install dependencies
npm install

# Start development server with MSW mock API
npm run dev
```

The dashboard is available at `http://localhost:3000`.

## Project Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Next.js dev server with MSW mocks enabled |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run typecheck` | Run TypeScript compiler check |
| `npm run test` | Run Vitest unit + component tests |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:a11y` | Run accessibility audit via Playwright + axe-core |
| `npm run analyze` | Bundle size analysis |

## Key Directories

```
src/app/              → Pages (Next.js App Router)
src/components/ui/    → shadcn/ui primitives
src/components/dashboard/ → Dashboard-specific components
src/hooks/            → React Query data hooks
src/lib/              → API client, types, utilities
src/mocks/            → MSW handlers and fixtures
tests/                → Unit, component, and e2e tests
```

## Development Workflow

1. **Mock-first**: All API interactions use MSW handlers in `src/mocks/handlers.ts`. Modify fixtures in `src/mocks/fixtures/` to test different data scenarios (empty states, error states, large datasets).

2. **Component development**: Build components in isolation using the mock data layer. Each dashboard section (summary cards, trend charts, member table, outcome chart) is an independent component.

3. **Testing**:
   - Write unit tests for hooks and utilities in `tests/unit/`
   - Write component tests for rendering behavior in `tests/component/`
   - Write e2e tests for full user journeys in `tests/e2e/`

4. **Quality gates before PR**:
   ```bash
   npm run lint && npm run typecheck && npm run test && npm run test:e2e
   ```

## Connecting to Real API

Replace the MSW mock layer with the real data service by updating `src/lib/api-client.ts` with the production base URL. The MSW handlers are only active when `NEXT_PUBLIC_MOCK_API=true` (default in development).

```env
# .env.local (development — mocks enabled)
NEXT_PUBLIC_MOCK_API=true

# .env.production (production — real API)
NEXT_PUBLIC_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```
