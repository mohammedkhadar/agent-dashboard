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

- [x] T001 Initialize Next.js 14 project with TypeScript strict mode, install dependencies (react, recharts, tailwindcss, @tanstack/react-query, date-fns, zod, msw) in package.json
- [x] T002 [P] Configure Tailwind CSS with design tokens (colors, spacing, typography) in tailwind.config.ts and src/styles/globals.css
- [x] T003 [P] Configure ESLint and Prettier with strict rules in .eslintrc.json and .prettierrc
- [x] T004 [P] Configure Vitest for unit/component tests in vitest.config.ts and React Testing Library in tests/setup.ts
- [x] T005 [P] Configure Playwright for e2e tests in playwright.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Define shared TypeScript interfaces for all API response types (Organization, UsageSummary, UsageTrendPoint, MemberUsage, OutcomeDistribution, ErrorCategory) in src/lib/types.ts
- [x] T007 Define Zod validation schemas matching all API contract response shapes in src/lib/schemas.ts
- [x] T008 Implement typed API client with fetch wrapper, Bearer token auth header, error handling, and Zod response validation in src/lib/api-client.ts
- [x] T009 [P] Create utility formatters for numbers (comma-separated), compute hours (2 decimal), token counts (abbreviated K/M), dates (org timezone via date-fns), and percentages in src/lib/formatters.ts
- [x] T010 [P] Define constants for date range presets (last 7/30/90 days) and pagination defaults (pageSize=10) in src/lib/constants.ts
- [x] T011 Create MSW mock fixture data covering normal, empty, error, and large-dataset scenarios in src/mocks/fixtures/
- [x] T012 Implement MSW request handlers for all 7 API endpoints (GET /api/org/profile, /api/usage/summary, /api/usage/trends, /api/usage/members, /api/usage/outcomes; POST /api/auth/login, /api/auth/logout) in src/mocks/handlers.ts
- [x] T013 Configure MSW server/browser setup with conditional activation via NEXT_PUBLIC_MOCK_API env var in src/mocks/server.ts and src/mocks/browser.ts
- [x] T014 Create root layout with TanStack Query provider, MSW initialization, and global styles in src/app/layout.tsx
- [x] T015 [P] Build reusable skeleton-card component for loading states in src/components/shared/skeleton-card.tsx
- [x] T016 [P] Build reusable error-banner component with retry button and staleness indicator in src/components/shared/error-banner.tsx
- [x] T017 [P] Build reusable empty-state component with configurable message and icon in src/components/shared/empty-state.tsx
- [x] T018 [P] Build nav-tabs component for dashboard section navigation (Overview, Members, Outcomes) in src/components/shared/nav-tabs.tsx
- [x] T019 Implement use-date-range hook managing date range state (presets + custom) and session persistence via sessionStorage in src/hooks/use-date-range.ts
- [x] T020 Build date-range-picker component with preset buttons (7d, 30d, 90d) wired to use-date-range hook in src/components/dashboard/date-range-picker.tsx
- *(T021 not used: shadcn/ui primitives setup merged into T022 during task generation.)*
- [x] T022 Initialize shadcn/ui primitives: install and configure Card, Table, Pagination, Popover, Calendar, Tabs components in src/components/ui/
- [x] T024 Implement use-org-profile hook using TanStack Query to fetch GET /api/org/profile for timezone and billing period in src/hooks/use-org-profile.ts
- [x] T040 Implement role-based access guard checking auth token claims for admin/manager/billing roles, redirecting unauthorized users to /login in src/components/shared/role-guard.tsx
- [x] T064 Build login page with email/password form calling POST /api/auth/login, storing auth in sessionStorage on success, displaying error on failure in src/app/login/page.tsx
- [x] T065 Write component tests for login page: form rendering, successful login redirect, invalid credentials error, network error, loading state in tests/component/login-page.test.tsx
- [x] T046 Write unit tests for formatters (number, token K/M, date with org timezone, percentage), API client (success, Zod validation failure, HTTP error mapping), and use-date-range hook (preset computation, sessionStorage persistence) in tests/unit/formatters.test.ts, tests/unit/api-client.test.ts, and tests/unit/use-date-range.test.ts
- [x] T060 Write integration tests verifying the full data-flow path (hook → API client → MSW handler → Zod validation → rendered state) for each of the 6 endpoints, covering success, validation failure, and HTTP error scenarios in tests/integration/api-flow.test.tsx

**Checkpoint**: Foundation ready — mock API layer operational, shared components built, date range controls functional, access guard active. User story implementation can now begin.

---

## Phase 3: User Story 1 — View Organization Usage Overview (Priority: P1) 🎯 MVP

**Goal**: Engineering manager sees summary cards (total sessions, compute hours, active users, total tokens) for the current billing period on dashboard load.

**Independent Test**: Load the dashboard at `/` with mock data and verify all 4 summary cards display correct values, plus empty/loading/error states render appropriately.

### Implementation for User Story 1

- [x] T023 Implement use-usage-summary hook using TanStack Query to fetch GET /api/usage/summary with date range params, handling loading/error/success states in src/hooks/use-usage-summary.ts
- [x] T025 Build summary-cards component rendering 4 metric cards (sessions, compute hours, active users, tokens) with formatted values, skeleton loading states, and empty-state message in src/components/dashboard/summary-cards.tsx
- [x] T026 Build the dashboard home page at src/app/page.tsx composing date-range-picker, summary-cards, nav-tabs, and error-banner with org profile providing default billing period date range
- [x] T027 [US1] Wire error state handling: when API fails, show error-banner with retry action and display cached values with staleness indicator via TanStack Query's staleTime/gcTime in src/app/page.tsx
- [x] T047 Write component tests for summary-cards rendering all 4 metrics, skeleton states, and empty-state in tests/component/summary-cards.test.tsx
- [x] T048 Write e2e test for dashboard home (viewport 1024px+): loads overview, verifies 4 summary cards, tests error retry in tests/e2e/overview.spec.ts

**Checkpoint**: Dashboard home page loads and displays the 4 summary cards with correct data from mock API. Empty, loading, and error states all render correctly. Tests pass. This is a fully functional MVP.

---

## Phase 4: User Story 2 — Analyze Usage Trends Over Time (Priority: P2)

**Goal**: User selects a date range and granularity to see time-series line charts for sessions/day, compute hours/day, and tokens/day with interactive tooltips.

**Independent Test**: On the Overview page at `/`, select "Last 30 days" and verify the combined line chart renders with 3 data series (sessions, compute hours, tokens). Hover a data point and verify tooltip shows exact values + period-over-period change.

### Implementation for User Story 2

- [x] T028 Implement use-usage-trends hook using TanStack Query to fetch GET /api/usage/trends with date range params in src/hooks/use-usage-trends.ts
- [x] T029 Build trend-charts component rendering a combined Recharts LineChart with 3 Line series (sessions, compute hours, tokens), dual Y-axes, legend, responsive container, zero-filled continuous timelines, and formatted axis labels in src/components/dashboard/trend-charts.tsx
- [x] T030 [US2] Implement custom Recharts tooltip component showing exact value, date formatted in org timezone, and percentage change from previous period in src/components/dashboard/trend-tooltip.tsx
- [x] T031 [US2] Integrate trend-charts into the overview page at src/app/page.tsx composing date-range-picker, trend-charts, summary-cards, nav-tabs, with loading/empty/error states
- [x] T049 Write component tests for trend-charts rendering combined chart with 3 series and tooltip display in tests/component/trend-charts.test.tsx
- [x] T050 Write e2e test for trend charts on the overview page: verify chart renders at `/` in tests/e2e/trends.spec.ts
- [x] T061 [US2] Wire error state with cached-data fallback and staleness indicator for trend charts on overview page, matching T027 pattern, in src/app/page.tsx

**Checkpoint**: Overview page renders interactive time-series charts alongside summary cards. Tooltips display exact values with period-over-period comparisons. Zero-filled gaps maintain continuous timeline. Tests pass.

---

## Phase 5: User Story 3 — Break Down Usage by Team Member (Priority: P3)

**Goal**: Manager views a sortable, paginated table of all organization members showing per-member session count, compute hours, tokens, success rate, and last active date.

**Independent Test**: Navigate to `/members`, verify table renders with correct columns sorted by sessions descending. Click column headers to sort. Verify pagination controls appear for >10 members. Verify zero-session members show "0" and "No activity".

### Implementation for User Story 3

- [x] T032 Implement use-member-usage hook using TanStack Query to fetch GET /api/usage/members with date range, page, pageSize, sortBy, and sortOrder params, using keepPreviousData for smooth pagination in src/hooks/use-member-usage.ts
- [x] T033 Build member-table component using shadcn/ui Table with sortable column headers (name, sessions, compute hours, tokens, success rate, last active), "Removed" badge for removed members, and "No activity" display for zero-session members in src/components/dashboard/member-table.tsx
- [x] T034 [US3] Wire pagination controls using shadcn/ui Pagination at 10 rows per page with page navigation in src/components/dashboard/member-table.tsx
- [x] T035 [US3] Build the members page at src/app/members/page.tsx composing date-range-picker, member-table, nav-tabs, with loading/empty/error states
- [x] T051 Write component tests for member-table with sorting, pagination, zero-session display, and "Removed" badge in tests/component/member-table.test.tsx
- [x] T052 Write e2e test for members page: sort by column, paginate, verify removed member badge in tests/e2e/members.spec.ts
- [x] T062 [US3] Wire error state with cached-data fallback and staleness indicator on members page, matching T027 pattern, in src/app/members/page.tsx

**Checkpoint**: Members view displays a fully sortable, paginated table. Sorting by any column works in both directions. Pagination navigates smoothly. Removed members show badge. Zero-session members show correct fallback values. Tests pass.

---

## Phase 6: User Story 4 — Monitor Agent Session Outcomes (Priority: P4)

**Goal**: User views a donut chart of session outcomes (success/error/timeout/cancelled) with counts and percentages, plus a ranked list of error categories.

**Independent Test**: Navigate to `/outcomes`, verify donut chart segments match mock data proportions. Verify error category list is sorted by frequency. Verify 100% success scenario shows congratulatory empty state for errors.

### Implementation for User Story 4

- [x] T036 Implement use-session-outcomes hook using TanStack Query to fetch GET /api/usage/outcomes with date range params in src/hooks/use-session-outcomes.ts
- [x] T037 Build outcome-chart component rendering a Recharts PieChart (donut variant) with 4 outcome segments, count labels, percentage labels, and a center total in src/components/dashboard/outcome-chart.tsx
- [x] T038 [P] [US4] Build error-category-list component rendering a ranked list of error categories with count, percentage bar, and category label, with congratulatory empty state when no errors exist in src/components/dashboard/error-category-list.tsx
- [x] T039 [US4] Build the outcomes page at src/app/outcomes/page.tsx composing date-range-picker, outcome-chart, error-category-list, nav-tabs, with loading/empty/error states
- [x] T053 Write component tests for outcome-chart segments/percentages and error-category-list ranking/empty state in tests/component/outcomes.test.tsx
- [x] T054 Write e2e test for outcomes page: verify donut chart, error list, 100% success empty state in tests/e2e/outcomes.spec.ts
- [x] T063 [US4] Wire error state with cached-data fallback and staleness indicator on outcomes page, matching T027 pattern, in src/app/outcomes/page.tsx

**Checkpoint**: Outcomes view displays donut chart with correct proportions and error category ranking. All edge states (100% success, no data, API error) render correctly. Tests pass.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T042 [P] Ensure all Recharts components and shadcn/ui tables meet WCAG 2.1 AA: add aria-labels, keyboard navigation for chart tooltips, and sufficient color contrast for chart segments in src/components/dashboard/
- [x] T043 Verify bundle size stays under 250 KB gzipped for initial route using next/bundle-analyzer, add dynamic imports for Recharts components if needed in next.config.js
- [x] T044 Run quickstart.md validation: verify npm install, npm run dev, npm run build, npm run lint, npm run typecheck all pass cleanly
- [x] T045 Code cleanup: remove unused imports, verify consistent naming conventions, ensure no TODO hacks per constitution principle I
- [x] T055 Wire axe-core accessibility checks into Playwright e2e tests; configure as CI gate and set minimum viewport to 1024px for all e2e tests per SC-005 in playwright.config.ts
- [x] T056 Run large-dataset MSW fixture (500 members, 100k sessions) against member table and charts to verify rendering performance per SC-003
- [x] T057 Verify all interactive elements (buttons, sort headers, date-range controls, chart hover) provide visual feedback within 100 ms per constitution Principle III, using Playwright timing assertions in tests/e2e/accessibility.spec.ts
- [x] T058 Add Lighthouse CI assertion for LCP < 2 s on the overview route (`/`) and bundle size < 250 KB gzipped; configure as a blocking CI step in a GitHub Actions workflow or local script per constitution Principle IV
- [x] T059 Add API p95 latency assertion (< 500 ms) against MSW handlers in a Vitest integration test exercising all 6 endpoints under simulated load per constitution Principle IV

---

## Phase 8: User Story 5 — Logout Functionality (Priority: P1)

**Goal**: Authenticated user can sign out from the dashboard. A user identity indicator shows the logged-in user's name and role, and a logout button clears the session and redirects to the login page.

**Independent Test**: Log in as any demo user, verify user identity is displayed in the dashboard header, click the logout button, verify sessionStorage is cleared and the browser redirects to `/login`. Verify that navigating back to `/` after logout redirects to `/login` again.

### Implementation for User Story 5

- [x] T066 Export `getAuth` function from src/components/shared/role-guard.tsx (currently module-private) and add a `clearAuth` helper that removes the "auth" key from sessionStorage, so logout logic can reuse the auth utilities
- [x] T067 [P] Add `POST /api/auth/logout` MSW handler in src/mocks/handlers.ts that returns `{ data: { success: true } }` with status 200 for API symmetry with the login endpoint
- [x] T068 Build user-menu component in src/components/shared/user-menu.tsx displaying the logged-in user's name and role from sessionStorage, a Lucide `LogOut` icon button that calls `clearAuth()`, invalidates all TanStack Query caches via `queryClient.clear()`, and redirects to `/login` via `router.push("/login")`
- [x] T069 Integrate user-menu into dashboard header: add `<UserMenu />` to the top-right section of each dashboard page (src/app/page.tsx, src/app/members/page.tsx, src/app/outcomes/page.tsx) alongside the existing DateRangePicker
- [x] T070 Write component tests for user-menu: renders user name and role, clicking logout clears sessionStorage and redirects to /login, renders nothing when no auth in tests/component/user-menu.test.tsx
- [x] T071 Write e2e test for logout flow: log in → verify user-menu visible → click logout → verify redirect to /login → verify cannot access / without re-login in tests/e2e/auth-logout.spec.ts

**Checkpoint**: Dashboard shows the logged-in user's identity in the header across all pages. Clicking logout clears auth state and redirects to login. Re-navigating to protected pages without auth redirects back to login. Tests pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3–6)**: All depend on Foundational phase completion
  - **Phase 3 (US1) MUST complete before Phase 4 (US2)**: both write to `src/app/page.tsx`; parallel execution causes merge conflicts
  - **Phases 5 and 6 (US3, US4)** can run in parallel with each other and with Phases 3–4 (each uses a different page file)
  - Or sequentially in priority order: P1 → P2 → P3 → P4
- **Polish (Phase 7)**: Depends on all user stories being complete
- **Logout (Phase 8)**: Depends on Phase 2 (auth infrastructure). Can proceed independently from Phases 3–7.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on other stories. Creates the dashboard shell that other stories reuse.
- **User Story 2 (P2)**: MUST start after Phase 3 (US1) completes — T031 integrates trend-charts into `src/app/page.tsx`, the same file T026 creates. Reuses date-range-picker and nav-tabs from Phase 2.
- **User Story 3 (P3)**: Can start after Phase 2 — independent page and hook. Reuses date-range-picker and nav-tabs from Phase 2.
- **User Story 4 (P4)**: Can start after Phase 2 — independent page and hook. Reuses date-range-picker and nav-tabs from Phase 2.
- **User Story 5 (Logout)**: Can start after Phase 2. Touches dashboard page headers (page.tsx, members/page.tsx, outcomes/page.tsx) so should run after Phases 3–6 to avoid merge conflicts.

### Within Each User Story

- Hook (data fetching) before component (rendering)
- Component before page (composition)
- Core implementation before edge-state handling

### Parallel Opportunities

**Phase 1**: T002, T003, T004, T005 can all run in parallel after T001
**Phase 2**: T009+T010 in parallel; T015+T016+T017+T018 in parallel; T011 before T012 before T013
**Phases 3–6**: Phase 3 (US1) → Phase 4 (US2) sequential (shared page.tsx); Phases 5+6 (US3, US4) can run in parallel with each other and with Phases 3–4
**Phase 7**: T042 leads; T043, T044, T045, T055, T056 sequential
**Phase 8**: T066+T067 in parallel → T068 → T069 → T070+T071 in parallel

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
       │         │
       │         └──→ Phase 4 (US2): T028 → T029 → T030 → T031 → T049+T050
       ├──→ Phase 5 (US3): T032 → T033 → T034 → T035 → T051+T052
       └──→ Phase 6 (US4): T036 → T037 → T038 → T039 → T053+T054
```

## Parallel Example: Logout (Phase 8)

```
T066 (export getAuth/clearAuth) ──┐
T067 (MSW logout handler)     ────┤
                                   └──→ T068 (user-menu component) ──→ T069 (integrate into pages) ──→ T070+T071 (tests in parallel)
```

---

## Implementation Strategy

**MVP First**: Complete Phase 1 + Phase 2 + Phase 3 (User Story 1) for a deployable dashboard showing the usage overview. This delivers the core value proposition — instant visibility into agent consumption.

**Incremental Delivery**: Each subsequent user story (Phases 4–6) adds an independent tab/section. The dashboard is valuable and testable after each phase.

**Suggested MVP Scope**: Phases 1–3 (Setup + Foundational + User Story 1 Overview)
