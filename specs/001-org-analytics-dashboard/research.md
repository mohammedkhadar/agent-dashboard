# Research: Org Analytics Dashboard

**Feature**: 001-org-analytics-dashboard
**Date**: 2026-03-30
**Purpose**: Resolve all technology decisions and unknowns before Phase 1 design.

---

## 1. Frontend Framework

**Decision**: Next.js 14 with App Router

**Rationale**: Next.js provides file-based routing, built-in code splitting, and server components for optimal initial load performance. The App Router supports React Server Components which enables streaming SSR for the dashboard shell while client components handle interactive charts.

**Alternatives considered**:
- **Vite + React Router**: Lighter build tooling but lacks built-in SSR, API route proxy layer, and streaming. Would require additional infrastructure for the BFF proxy pattern.
- **Remix**: Strong data-loading model but less ecosystem support for dashboard-style charting libraries. Nested route loaders are overkill for a single-page dashboard.
- **Plain React SPA (CRA)**: No SSR, no code splitting out of the box, maintenance mode. Would miss LCP < 2s target without significant manual optimization.

---

## 2. Charting Library

**Decision**: Recharts 2.x

**Rationale**: Recharts is built on React components and D3, providing declarative chart composition that fits naturally into the React component model. It supports line charts (for trends), donut/pie charts (for outcomes), and custom tooltips. Actively maintained with strong TypeScript support.

**Alternatives considered**:
- **Chart.js + react-chartjs-2**: Canvas-based rendering is performant, but imperative API style doesn't compose as naturally with React. Tooltip customization requires more boilerplate.
- **Nivo**: Beautiful defaults and excellent accessibility, but larger bundle size (~80 KB gzipped) for the chart primitives we need. Recharts covers the same use cases at ~45 KB.
- **D3 direct**: Maximum flexibility but requires significant custom code for responsive charts, tooltips, and accessibility. Too much low-level work for standard dashboard charts.
- **Tremor**: Purpose-built for dashboards but tightly coupled to its own design system. Using it alongside shadcn/ui would create design system conflicts (violates Constitution III).

---

## 3. Component Library & Design System

**Decision**: shadcn/ui + Tailwind CSS 3

**Rationale**: shadcn/ui provides unstyled, accessible, composable primitives (tables, cards, dialogs, pagination, date pickers) built on Radix UI. Components are copied into the project (not installed as a dependency) so they can be customized without version conflicts. Tailwind CSS provides the design token system (spacing, colors, typography) needed for Constitution Principle III compliance.

**Alternatives considered**:
- **Material UI (MUI)**: Full design system but opinionated styling. Overriding Material Design to match a custom brand requires significant theme configuration. Bundle size is substantially larger.
- **Ant Design**: Comprehensive component library with built-in charts, but heavy (300+ KB), opinionated Chinese design conventions, and harder to customize without LESS overrides.
- **Headless UI + custom CSS**: Fewer pre-built primitives than shadcn/ui; would require building table, pagination, and date picker from scratch.

---

## 4. State Management & Data Fetching

**Decision**: React Query (TanStack Query) v5 + React Context for UI state

**Rationale**: The dashboard is read-only with no complex client-side mutations. React Query handles server state (caching, refetching, loading/error states, stale-while-revalidate) which directly supports FR-010, FR-011, and FR-013. UI state (selected date range, granularity, sort order) is minimal and scoped — React Context + `useState` suffices without a global store.

**Alternatives considered**:
- **SWR**: Similar caching model but less control over query invalidation, dependent queries, and pagination caching. TanStack Query's `keepPreviousData` is essential for smooth pagination in the member table.
- **Redux Toolkit + RTK Query**: Excessive for a read-only dashboard. Redux introduces boilerplate (slices, reducers, selectors) that adds complexity without benefit when there's no shared mutable state.
- **Zustand**: Good for client-side state but doesn't address server-state caching and refetching. Would still need a data-fetching layer on top.

---

## 5. Testing Strategy

**Decision**: Three-tier testing (Vitest + React Testing Library + Playwright)

**Rationale**:
- **Vitest**: Fast, ESM-native unit test runner that shares the Vite config used by Next.js tooling. Tests hooks (data transformation, formatting) and utility functions. Runs in <5s for the expected test suite size.
- **React Testing Library**: Component-level tests that verify rendering behavior (loading states, empty states, data display, sort interactions) without implementation coupling. Covers Constitution II requirement for acceptance scenario tests.
- **Playwright**: End-to-end tests against the running app with MSW mocking the API layer. Validates full user journeys (load dashboard → select date range → verify chart → sort table). Provides cross-browser coverage.

**Alternatives considered**:
- **Jest**: Slower cold starts due to CJS transform overhead. Vitest is drop-in compatible with Jest's API but runs 2-3x faster for TypeScript projects.
- **Cypress**: Good DX for e2e but heavier than Playwright in CI, single-browser per run, and flakier with network interception. Playwright's multi-browser parallelism is better for the cross-browser requirement.

---

## 6. Mock Data Layer

**Decision**: MSW (Mock Service Worker) 2.x

**Rationale**: MSW intercepts network requests at the service worker level, enabling the same mock handlers to be used in both development (browser) and tests (Node). This means the mock API contract is defined once and validated consistently across environments. MSW supports REST handlers matching the expected data API patterns.

**Alternatives considered**:
- **JSON files + fetch wrapper**: Simplest approach but doesn't exercise the actual fetch path. Mocks are tightly coupled to the import layer rather than the network boundary.
- **Mirage.js**: Full mock server with ORM-like data relationships. Overkill for a read-only dashboard — we don't need mutation handling, relationship tracking, or request serialization.
- **Next.js API routes with static data**: Works for development but can't be reused in component/e2e tests without running the full server.

---

## 7. Date Handling

**Decision**: date-fns 3.x

**Rationale**: date-fns provides tree-shakeable, pure functions for date formatting, range computation, ISO week calculation, and time zone display. Only the functions actually used are bundled (~3-5 KB for the expected usage). The spec requires ISO week aggregation (US2), time zone display (FR-011), and date range presets (FR-002).

**Alternatives considered**:
- **Day.js**: Smaller base size but plugin system for time zones and ISO weeks adds complexity. Mutability chain pattern is less idiomatic with React's immutable state model.
- **Luxon**: Full-featured but larger (~20 KB gzipped). Built-in Intl support is nice but exceeds what's needed.
- **Native Intl.DateTimeFormat**: Sufficient for display formatting but lacks range computation, ISO week math, and period comparison utilities needed for the trend charts.

---

## 8. API Client Pattern

**Decision**: Typed fetch wrapper with Zod response validation

**Rationale**: A thin typed wrapper around `fetch` keeps the API layer minimal. Zod schemas validate API response shapes at runtime, catching backend contract drift before it causes silent rendering bugs. This directly supports the reliability requirements in Constitution Principle II.

**Alternatives considered**:
- **Axios**: Adds ~13 KB for features (interceptors, transforms) that `fetch` handles natively. The main benefit (request cancellation) is now available via `AbortController`.
- **tRPC**: Requires a tRPC backend — not appropriate when consuming an existing external API.
- **GraphQL (Apollo/urql)**: Adds a query language layer over what is a simple REST API. Over-engineered for 4-5 read-only endpoints.

---

## 9. Accessibility Approach

**Decision**: Built-in via shadcn/ui (Radix primitives) + axe-core automated checks

**Rationale**: shadcn/ui components are built on Radix UI which provides WCAG-compliant keyboard navigation, ARIA attributes, and focus management out of the box. axe-core (via @axe-core/playwright) runs automated accessibility audits in the Playwright e2e suite, enforcing Constitution Quality Gate #5 in CI.

**Alternatives considered**:
- **Manual ARIA management**: Error-prone and time-consuming. Radix handles the hard accessibility patterns (modals, dropdowns, tooltips) correctly by default.
- **React Aria (Adobe)**: Excellent accessibility primitives but lower-level than Radix. Would require more assembly work to build the component library.

---

## 10. Performance Monitoring

**Decision**: Next.js built-in Web Vitals reporting + bundlesize CI check

**Rationale**: Next.js `reportWebVitals` captures LCP, FID, CLS metrics natively. A `bundlesize` check in CI (via `@next/bundle-analyzer` + a threshold assertion) enforces the 250 KB gzipped budget from Constitution Principle IV. No external APM service needed for v1.

**Alternatives considered**:
- **Lighthouse CI**: Full synthetic performance audit in CI. Useful but slow (~30-60s per run) and introduces flakiness from headless Chrome variability. Better suited for periodic audits than PR gates.
- **Sentry Performance**: Production monitoring — valuable but out of scope for the initial build phase. Can be added in a polish phase.
