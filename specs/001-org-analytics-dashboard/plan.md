# Implementation Plan: Org Analytics Dashboard

**Branch**: `001-org-analytics-dashboard` | **Date**: 2026-03-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-org-analytics-dashboard/spec.md`

## Summary

Build a customer-facing organizational-level analytics dashboard that displays agent usage metrics (sessions, compute hours, tokens, outcomes) across an organization. The dashboard is a read-only web application consuming data from an existing internal API. It covers four core views: usage overview (P1), usage trends with time-series charts (P2), per-member usage breakdown (P3), and session outcome monitoring (P4). The frontend is a single-page application with mock API layer for initial development.

## Technical Context

**Language/Version**: TypeScript 5.4+
**Primary Dependencies**: Next.js 14 (App Router), React 18, Recharts (charting), Tailwind CSS 3 (styling), shadcn/ui (component library)
**Storage**: N/A (read-only dashboard; data consumed via REST API; mock data layer for development)
**Testing**: Vitest (unit), React Testing Library (component), Playwright (e2e)
**Target Platform**: Modern desktop browsers (Chrome, Firefox, Safari, Edge — latest 2 versions), viewport ≥ 1024px
**Project Type**: Web application (frontend SPA with Next.js API routes as BFF proxy)
**Performance Goals**: LCP < 2s, bundle < 250 KB gzipped (initial route), 60 fps chart/table rendering up to 10k rows
**Constraints**: API p95 < 500ms, data freshness ≤ 5 min delay, WCAG 2.1 AA accessibility
**Scale/Scope**: Up to 500 members per org, 100k sessions per billing period, single dashboard page with tabbed/sectioned views

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. Code Quality** | ✅ PASS | TypeScript strict mode enforces type safety; ESLint + Prettier configured; Next.js App Router enforces modular structure with clear component boundaries |
| **II. Testing Standards** | ✅ PASS | Three-tier testing strategy (Vitest unit, RTL component, Playwright e2e) covers all acceptance scenarios; spec defines 14+ acceptance scenarios across 4 stories |
| **III. UX Consistency** | ✅ PASS | shadcn/ui + Tailwind design tokens provide single design system; spec explicitly requires loading/empty/error states for every view (FR-008, FR-009, FR-010); WCAG 2.1 AA required |
| **IV. Performance** | ✅ PASS | Performance budgets defined (LCP < 2s, bundle < 250KB gz, 60fps); Next.js code splitting + dynamic imports enforce bundle limits; virtualization planned for large tables |

**Gate Result**: PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-org-analytics-dashboard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/                     # Next.js App Router pages
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Dashboard home (overview)
│   ├── trends/
│   │   └── page.tsx         # Usage trends view
│   ├── members/
│   │   └── page.tsx         # Member breakdown view
│   └── outcomes/
│       └── page.tsx         # Session outcomes view
├── components/
│   ├── ui/                  # shadcn/ui primitives (card, table, chart, etc.)
│   ├── dashboard/           # Dashboard-specific composed components
│   │   ├── summary-cards.tsx
│   │   ├── trend-charts.tsx
│   │   ├── member-table.tsx
│   │   ├── outcome-chart.tsx
│   │   ├── error-category-list.tsx
│   │   ├── date-range-picker.tsx
│   │   └── granularity-toggle.tsx
│   └── shared/              # Cross-cutting components
│       ├── skeleton-card.tsx
│       ├── error-banner.tsx
│       ├── empty-state.tsx
│       └── nav-tabs.tsx
├── hooks/                   # Custom React hooks
│   ├── use-usage-summary.ts
│   ├── use-usage-trends.ts
│   ├── use-member-usage.ts
│   ├── use-session-outcomes.ts
│   └── use-date-range.ts
├── lib/                     # Utilities and API client
│   ├── api-client.ts        # Typed fetch wrapper for data service
│   ├── formatters.ts        # Number, date, token formatting
│   ├── types.ts             # Shared TypeScript interfaces
│   └── constants.ts         # Date presets, pagination defaults
├── mocks/                   # Mock data layer for development
│   ├── handlers.ts          # MSW request handlers
│   ├── fixtures/            # Static fixture data
│   └── server.ts            # MSW server setup
└── styles/
    └── globals.css          # Tailwind base + design tokens

tests/
├── unit/                    # Vitest unit tests (hooks, formatters, utils)
├── component/               # React Testing Library component tests
└── e2e/                     # Playwright end-to-end tests
```

**Structure Decision**: Single Next.js project (no separate backend) since the dashboard is a read-only consumer of an existing data API. Next.js API routes serve as a thin BFF proxy if needed for auth token forwarding. This avoids unnecessary infrastructure complexity.

## Complexity Tracking

> No constitution violations — table intentionally left empty.
