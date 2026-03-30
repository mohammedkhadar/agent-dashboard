<!--
  Sync Impact Report
  ===========================================================
  Version change: 0.0.0 → 1.0.0 (MAJOR — initial ratification)
  Modified principles: N/A (initial creation)
  Added sections:
    - Core Principles (4 principles)
    - Quality Gates
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ compatible (Constitution
      Check section is dynamic; no changes required)
    - .specify/templates/spec-template.md ✅ compatible (success
      criteria and requirements sections align with principles)
    - .specify/templates/tasks-template.md ✅ compatible (polish phase
      already includes performance, testing, and security tasks)
  Follow-up TODOs: none
  ===========================================================
-->

# Agent Dashboard Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

- All production code MUST pass static analysis with zero
  warnings before merge.
- Functions MUST have a single, clear responsibility; cyclomatic
  complexity MUST NOT exceed 10 per function.
- Dead code, commented-out code, and TODO hacks MUST NOT be
  merged into the main branch.
- Naming MUST be descriptive and consistent: variables reveal
  intent, booleans read as predicates, components reflect their
  purpose.
- Every module MUST expose a clear public API; internal helpers
  MUST remain unexported.

**Rationale**: A dashboard consumed by operators demands a
trustworthy, maintainable codebase. Strict quality gates prevent
technical debt from compounding across rapid iteration cycles.

### II. Testing Standards (NON-NEGOTIABLE)

- Every user-facing feature MUST ship with automated tests that
  cover its acceptance scenarios before the PR is approved.
- Unit tests MUST cover all business logic; integration tests
  MUST cover all API boundaries and data-flow paths.
- Tests MUST be deterministic — no flaky tests allowed in the
  main branch. A flaky test MUST be quarantined or fixed within
  24 hours of detection.
- Test names MUST describe the scenario under test in plain
  language (e.g., "displays error banner when API returns 500").
- Code coverage MUST NOT drop below the project baseline on any
  PR; regressions MUST block merge.

**Rationale**: An agent dashboard aggregates critical operational
data. Untested paths risk silent data corruption or misleading
displays that erode operator trust.

### III. User Experience Consistency

- All UI components MUST follow a single, documented design
  system (tokens, spacing, typography, color palette).
- Interactive elements MUST provide immediate visual feedback
  within 100 ms of user input (hover, press, focus states).
- Error states, empty states, and loading states MUST be
  explicitly designed and implemented for every view.
- Layout and navigation patterns MUST remain consistent across
  all pages; deviations require documented justification
  approved in code review.
- Accessibility MUST meet WCAG 2.1 AA: keyboard navigation,
  sufficient contrast, and semantic markup are required.

**Rationale**: Operators rely on the dashboard under pressure.
Consistent, predictable UX reduces cognitive load and
time-to-insight during incidents.

### IV. Performance Requirements

- Initial page load (Largest Contentful Paint) MUST complete
  within 2 seconds on a standard broadband connection
  (Lighthouse desktop preset).
- Client-side JavaScript bundle size MUST NOT exceed 250 KB
  gzipped for the initial route.
- API responses powering dashboard views MUST return within
  500 ms at the 95th percentile under normal load.
- Rendering of data tables and charts MUST maintain 60 fps
  for datasets up to 10,000 rows without virtualization lag.
- Performance budgets MUST be enforced in CI; regressions
  MUST block merge.

**Rationale**: A slow dashboard is an unused dashboard.
Operators need real-time visibility into agent status;
latency directly impacts decision speed.

## Quality Gates

All pull requests MUST satisfy every gate before merge:

1. **Lint & Format** — zero warnings from the configured
   linter and formatter.
2. **Type Check** — zero type errors (when a typed language
   or TypeScript is in use).
3. **Test Suite** — all tests pass; coverage does not regress
   below the project baseline.
4. **Performance Budget** — bundle size and LCP thresholds
   are within configured limits.
5. **Accessibility Audit** — automated a11y checks pass with
   no critical or serious violations.
6. **Code Review** — at least one approval from a maintainer
   who was not the PR author.

## Development Workflow

- Feature work MUST branch from `main` using the naming
  convention `###-feature-name`.
- Commits MUST follow Conventional Commits format
  (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `perf:`).
- PRs MUST reference the related spec or issue and include
  a concise description of changes.
- Merges to `main` MUST use squash-merge to keep history
  linear and readable.
- Broken builds on `main` MUST be treated as top priority;
  the responsible party MUST fix or revert within 1 hour.

## Governance

- This constitution supersedes all other development
  practices for the Agent Dashboard project.
- Amendments require: (1) a written proposal describing the
  change and rationale, (2) review by at least one
  maintainer, and (3) an updated version number following
  semantic versioning (MAJOR for principle removal or
  redefinition, MINOR for additions, PATCH for
  clarifications).
- All PRs and code reviews MUST verify compliance with
  these principles. Non-compliance MUST be flagged and
  resolved before merge.
- Complexity beyond what these principles prescribe MUST be
  justified in the PR description and approved explicitly.

**Version**: 1.0.0 | **Ratified**: 2026-03-30 | **Last Amended**: 2026-03-30
