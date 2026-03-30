# Tasks: Org Analytics Dashboard

**Input**: Design documents from `/specs/001-org-analytics-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Constitution Principle II (NON-NEGOTIABLE) requires automated tests for every user-facing feature. Test tasks are included per phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (Next.js App Router)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency installation, and base configuration

- [ ] T001 Initialize Next.js 14 project with TypeScript strict mode, install dependencies (react, recharts, tailwindcss, @tanstack/react-query, date-fns, zod, msw) in package.json
- [ ] T002 [P] Configure Tailwind CSS with design tokens (colors, spacing, typography) in tailwind.config.ts and src/styles/globals.css
- [ ] T003 [P] Configure ESLint and Prettier with strict rules in .eslintrc.json and .prettierrc
- [ ] T004 [P] Configure Vitest for unit/component tests in vitest.config.ts and React Testing Library in tests/setup.ts
- [ ] T005 [P] Configure Playwright for e2e tests in playwright.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Define shared TypeScript interfaces for all API response types (Organization, UsageSummary, UsageTrendPoint, MemberUsage, OutcomeDistribution, ErrorCategory) in src/lib/types.ts
- [ ] T007 Define Zod validation schemas matching all API contract response shapes in src/lib/schemas.ts
- [ ] T008 Implement typed API client with fetch wrapper, Bearer token auth header, error handling, and Zod response validation in src/lib/api-client.ts
- [ ] T009 [P] Create utility formatters for numbers (comma-separated), compute hours (2 decimal), token counts (abbreviated K/M), dates (org timezone via date-fns), and percentages in src/lib/formatters.ts
- [ ] T010 [P] Define constants for date range presets (today, last 7/30/90 days), pagination defaults (pageSize=25), and granularity options in src/lib/constants.ts
- [ ] T011 Create MSW mock fixture data covering normal, empty, error, and large-dataset scenarios in src/mocks/fixtures/
- [ ] T012 Implement MSW request handlers for all 5 API endpoints (GET /api/usage/summary, /api/usage/trends, /api/usage/members, /api/usage/outcomes, /api/org/profile) in src/mocks/handlers.ts
- [ ] T013 Configure MSW server/browser setup with conditional activation via NEXT_PUBLIC_MOCK_API env var in src/mocks/server.ts and src/mocks/browser.ts
- [ ] T014 Create root layout with TanStack Query provider, MSW initialization, and global styles in src/app/layout.tsx
- [ ] T015 [P] Build reusable skeleton-card component for loading states in src/components/shared/skeleton-card.tsx
- [ ] T016 [P] Build reusable error-banner component with retry button and staleness indicator in src/components/shared/error-banner.tsx
- [ ] T017 [P] Build reusable empty-state component with configurable message and icon in src/components/shared/empty-state.tsx
- [ ] T018 [P] Build nav-tabs component for dashboard section navigation (Overview, Trends, Members, Outcomes) in src/components/shared/nav-tabs.tsx
- [ ] T019 Implement use-date-range hook managing date range state (presets + custom), granularity toggle, and session persistence via sessionStorage in src/hooks/use-date-range.ts
- [ ] T020 Build date-range-picker component with preset buttons (today, 7d, 30d, 90d, custom) wired to use-date-range hook in src/components/dashboard/date-range-picker.tsx
- [ ] T021 Build granularity-toggle component (daily/weekly/monthly) wired to use-date-range hook in src/components/dashboard/granularity-toggle.tsx
- [ ] T022 Initialize shadcn/ui primitives: install and configure Card, Table, Pagination, Popover, Calendar, Tabs components in src/components/ui/
- [ ] T024 Implement use-org-profile hook using TanStack Query to fetch GET /api/org/profile for timezone and billing period in src/hooks/use-org-profile.ts
- [ ] T040 Implement role-based access guard checking auth token claims for admin/manager/billing roles, redirecting unauthorized users with a 403 message in src/app/layout.tsx
- [ ] T046 Write unit tests for formatters (number, token K/M, date, percentage), API client (success, Zod validation failure, HTTP error mapping), and use-date-range hook (preset computation, sessionStorage persistence, granularity toggle) in tests/unit/formatters.test.ts, tests/unit/api-client.test.ts, and tests/unit/use-date-range.test.ts

**Checkpoint**: Foundation ready — mock API layer operational, shared components built, date range controls functional, access guard active. User story implementation can now begin.

---

## Phase 3: User Story 1 — View Organization Usage Overview (Priority: P1) 🎯 MVP

**Goal**: Engineering manager sees summary cards (total sessions, compute hours, active users, total tokens) for the current billing period on dashboard load.

**Independent Test**: Load the dashboard at `/` with mock data and verify all 4 summary cards display correct values, plus empty/loading/error states render appropriately.

### Implementation for User Story 1

- [ ] T023 Implement use-usage-summary hook using TanStack Query to fetch GET /api/usage/summary with date range params, handling loading/error/success states in src/hooks/use-usage-summary.ts
- [ ] T025 Build summary-cards component rendering 4 metric cards (sessions, compute hours, active users, tokens) with formatted values, skeleton loading states, and empty-state message in src/components/dashboard/summary-cards.tsx
- [ ] T026 Build the dashboard home page at src/app/page.tsx composing date-range-picker, summary-cards, nav-tabs, and error-banner with org profile providing default billing period date range
- [ ] T027 [US1] Wire error state handling: when API fails, show error-banner with retry action and display cached values with staleness indicator via TanStack Query's staleTime/gcTime in src/app/page.tsx
- [ ] T047 Write component tests for summary-cards rendering all 4 metrics, skeleton states, and empty-state in tests/component/summary-cards.test.tsx
- [ ] T048 Write e2e test for dashboard home (viewport 1024px+): loads overview, verifies 4 summary cards, tests error retry in tests/e2e/overview.spec.ts

**Checkpoint**: Dashboard home page loads and displays the 4 summary cards with correct data from mock API. Empty, loading, and error states all render correctly. Tests pass. This is a fully functional MVP.

---

## Phase 4: User Story 2 — Analyze Usage Trends Over Time (Priority: P2)

**Goal**: User selects a date range and granularity to see time-series line charts for sessions/day, compute hours/day, and tokens/day with interactive tooltips.

**Independent Test**: Navigate to `/trends`, select "Last 30 days" with daily granularity, and verify 3 line charts render with correct data points. Switch to weekly/monthly and verify re-aggregation. Hover a data point and verify tooltip shows exact value + period-over-period change.

### Implementation for User Story 2

- [ ] T028 Implement use-usage-trends hook using TanStack Query to fetch GET /api/usage/trends with date range and granularity params in src/hooks/use-usage-trends.ts
- [ ] T029 Build trend-charts component rendering 3 Recharts LineCharts (sessions, compute hours, tokens) with responsive containers, zero-filled continuous timelines, and formatted axis labels in src/components/dashboard/trend-charts.tsx
- [ ] T030 [US2] Implement custom Recharts tooltip component showing exact value, date formatted in org timezone, and percentage change from previous period in src/components/dashboard/trend-tooltip.tsx
- [ ] T031 [US2] Build the trends page at src/app/trends/page.tsx composing date-range-picker, granularity-toggle, trend-charts, nav-tabs, with loading/empty/error states
- [ ] T049 Write component tests for trend-charts rendering 3 charts, granularity switching, and tooltip display in tests/component/trend-charts.test.tsx
- [ ] T050 Write e2e test for trends page: date range selection, granularity toggle, chart interaction in tests/e2e/trends.spec.ts

**Checkpoint**: Trends view renders interactive time-series charts. Granularity switching works. Tooltips display exact values with period-over-period comparisons. Zero-filled gaps maintain continuous timeline. Tests pass.

---

## Phase 5: User Story 3 — Break Down Usage by Team Member (Priority: P3)

**Goal**: Manager views a sortable, paginated table of all organization members showing per-member session count, compute hours, tokens, success rate, and last active date.

**Independent Test**: Navigate to `/members`, verify table renders with correct columns sorted by sessions descending. Click column headers to sort. Verify pagination controls appear for >25 members. Verify zero-session members show "0" and "No activity".

### Implementation for User Story 3

- [ ] T032 Implement use-member-usage hook using TanStack Query to fetch GET /api/usage/members with date range, page, pageSize, sortBy, and sortOrder params, using keepPreviousData for smooth pagination in src/hooks/use-member-usage.ts
- [ ] T033 Build member-table component using shadcn/ui Table with sortable column headers (name, sessions, compute hours, tokens, success rate, last active), "Removed" badge for removed members, and "No activity" display for zero-session members in src/components/dashboard/member-table.tsx
- [ ] T034 [US3] Wire pagination controls using shadcn/ui Pagination at 25 rows per page with page navigation in src/components/dashboard/member-table.tsx
- [ ] T035 [US3] Build the members page at src/app/members/page.tsx composing date-range-picker, member-table, nav-tabs, with loading/empty/error states
- [ ] T051 Write component tests for member-table with sorting, pagination, zero-session display, and "Removed" badge in tests/component/member-table.test.tsx
- [ ] T052 Write e2e test for members page: sort by column, paginate, verify removed member badge in tests/e2e/members.spec.ts

**Checkpoint**: Members view displays a fully sortable, paginated table. Sorting by any column works in both directions. Pagination navigates smoothly. Removed members show badge. Zero-session members show correct fallback values. Tests pass.

---

## Phase 6: User Story 4 — Monitor Agent Session Outcomes (Priority: P4)

**Goal**: User views a donut chart of session outcomes (success/error/timeout/cancelled) with counts and percentages, plus a ranked list of error categories.

**Independent Test**: Navigate to `/outcomes`, verify donut chart segments match mock data proportions. Verify error category list is sorted by frequency. Verify 100% success scenario shows congratulatory empty state for errors.

### Implementation for User Story 4

- [ ] T036 Implement use-session-outcomes hook using TanStack Query to fetch GET /api/usage/outcomes with date range params in src/hooks/use-session-outcomes.ts
- [ ] T037 Build outcome-chart component rendering a Recharts PieChart (donut variant) with 4 outcome segments, count labels, percentage labels, and a center total in src/components/dashboard/outcome-chart.tsx
- [ ] T038 [P] [US4] Build error-category-list component rendering a ranked list of error categories with count, percentage bar, and category label, with congratulatory empty state when no errors exist in src/components/dashboard/error-category-list.tsx
- [ ] T039 [US4] Build the outcomes page at src/app/outcomes/page.tsx composing date-range-picker, outcome-chart, error-category-list, nav-tabs, with loading/empty/error states
- [ ] T053 Write component tests for outcome-chart segments/percentages and error-category-list ranking/empty state in tests/component/outcomes.test.tsx
- [ ] T054 Write e2e test for outcomes page: verify donut chart, error list, 100% success empty state in tests/e2e/outcomes.spec.ts

**Checkpoint**: Outcomes view displays donut chart with correct proportions and error category ranking. All edge states (100% success, no data, API error) render correctly. Tests pass.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T041 [P] Add organization timezone indicator (e.g., "Times shown in EST") visible on all views in src/components/shared/timezone-indicator.tsx
- [ ] T042 [P] Ensure all Recharts components and shadcn/ui tables meet WCAG 2.1 AA: add aria-labels, keyboard navigation for chart tooltips, and sufficient color contrast for chart segments in src/components/dashboard/
- [ ] T043 Verify bundle size stays under 250 KB gzipped for initial route using next/bundle-analyzer, add dynamic imports for Recharts components if needed in next.config.js
- [ ] T044 Run quickstart.md validation: verify npm install, npm run dev, npm run build, npm run lint, npm run typecheck all pass cleanly
- [ ] T045 Code cleanup: remove unused imports, verify consistent naming conventions, ensure no TODO hacks per constitution principle I
- [ ] T055 Wire axe-core accessibility checks into Playwright e2e tests; configure as CI gate and set minimum viewport to 1024px for all e2e tests per SC-005 in playwright.config.ts
- [ ] T056 Run large-dataset MSW fixture (500 members, 100k sessions) against member table and charts to verify rendering performance per SC-003

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3–6)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (different pages, independent hooks)
  - Or sequentially in priority order: P1 → P2 → P3 → P4
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on other stories. Creates the dashboard shell that other stories reuse.
- **User Story 2 (P2)**: Can start after Phase 2 — independent page and hook. Reuses date-range-picker and nav-tabs from Phase 2.
- **User Story 3 (P3)**: Can start after Phase 2 — independent page and hook. Reuses date-range-picker and nav-tabs from Phase 2.
- **User Story 4 (P4)**: Can start after Phase 2 — independent page and hook. Reuses date-range-picker and nav-tabs from Phase 2.

### Within Each User Story

- Hook (data fetching) before component (rendering)
- Component before page (composition)
- Core implementation before edge-state handling

### Parallel Opportunities

**Phase 1**: T002, T003, T004, T005 can all run in parallel after T001
**Phase 2**: T009+T010 in parallel; T015+T016+T017+T018 in parallel; T011 before T012 before T013
**Phases 3–6**: All four user stories can proceed in parallel once Phase 2 is complete (each touches different files)
**Phase 7**: T041+T042 in parallel; T043, T044, T045, T055, T056 sequential

---

## Parallel Example: User Story 1

```
T023 (use-usage-summary) ──→ T025 (summary-cards) ──→ T026 (page.tsx) ──→ T027 (error wiring) ──→ T047+T048 (tests)
```

## Parallel Example: After Phase 2

```
Phase 2 complete (includes T024 use-org-profile)
       │
       ├──→ Phase 3 (US1): T023 → T025 → T026 → T027 → T047+T048
       ├──→ Phase 4 (US2): T028 → T029 → T030 → T031 → T049+T050
       ├──→ Phase 5 (US3): T032 → T033 → T034 → T035 → T051+T052
       └──→ Phase 6 (US4): T036 → T037 → T038 → T039 → T053+T054
```

---

## Implementation Strategy

**MVP First**: Complete Phase 1 + Phase 2 + Phase 3 (User Story 1) for a deployable dashboard showing the usage overview. This delivers the core value proposition — instant visibility into agent consumption.

**Incremental Delivery**: Each subsequent user story (Phases 4–6) adds an independent tab/section. The dashboard is valuable and testable after each phase.

**Suggested MVP Scope**: Phases 1–3 (Setup + Foundational + User Story 1 Overview)
