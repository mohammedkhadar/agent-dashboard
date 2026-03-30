# Data Model: Org Analytics Dashboard

**Feature**: 001-org-analytics-dashboard
**Date**: 2026-03-30
**Source**: Entities from [spec.md](spec.md), decisions from [research.md](research.md)

---

## Entities

### Organization

The top-level customer account. All dashboard data is scoped to a single organization.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| name | string | Display name |
| timezone | string (IANA) | e.g., "America/New_York" — used for all timestamp display (FR-011) |
| billingPeriodStart | ISO 8601 date | Start of current billing period |
| billingPeriodEnd | ISO 8601 date | End of current billing period |

### Member

A user belonging to an organization.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| organizationId | string (UUID) | FK → Organization |
| name | string | Display name |
| email | string | Email address |
| role | enum | `admin` \| `manager` \| `member` \| `billing` |
| status | enum | `active` \| `removed` |
| joinedAt | ISO 8601 datetime | When member joined the organization |

**Relationships**: A Member belongs to exactly one Organization. A Member has zero or more Agent Sessions.

### AgentSession

A single execution of a cloud agent by a member.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| memberId | string (UUID) | FK → Member |
| organizationId | string (UUID) | FK → Organization (denormalized for query efficiency) |
| startedAt | ISO 8601 datetime | Session start timestamp |
| endedAt | ISO 8601 datetime \| null | Session end timestamp (null if in-progress) |
| computeDurationMs | integer | Compute time in milliseconds |
| outcome | enum | `success` \| `error` \| `timeout` \| `cancelled` |
| errorCategory | string \| null | Category label if outcome is `error` (e.g., "context_limit_exceeded", "tool_execution_failed", "rate_limited") |
| inputTokens | integer | Number of input tokens consumed |
| outputTokens | integer | Number of output tokens produced |

**Derived fields** (computed, not stored):
- `totalTokens` = `inputTokens` + `outputTokens`
- `computeHours` = `computeDurationMs` / 3,600,000

### UsageSummary (computed aggregate)

Not a persisted entity — derived from AgentSession queries over a time range.

| Field | Type | Description |
|-------|------|-------------|
| periodStart | ISO 8601 date | Start of aggregation period |
| periodEnd | ISO 8601 date | End of aggregation period |
| totalSessions | integer | Count of sessions in period |
| totalComputeHours | number (2 decimal) | Sum of compute hours |
| totalTokens | integer | Sum of all tokens (input + output) |
| activeUserCount | integer | Count of distinct members with ≥ 1 session |

### MemberUsage (computed aggregate)

Per-member usage summary for a time range.

| Field | Type | Description |
|-------|------|-------------|
| memberId | string (UUID) | FK → Member |
| memberName | string | Display name |
| memberEmail | string | Email |
| memberStatus | enum | `active` \| `removed` |
| sessions | integer | Count of sessions |
| computeHours | number (2 decimal) | Sum of compute hours |
| totalTokens | integer | Sum of all tokens |
| successRate | number (0-1) | Proportion of sessions with outcome `success` |
| lastActiveAt | ISO 8601 datetime \| null | Most recent session start (null if no sessions) |

### UsageTrendPoint (computed aggregate)

A single data point in a time-series trend.

| Field | Type | Description |
|-------|------|-------------|
| date | ISO 8601 date | Start of the bucket (day/week/month) |
| sessions | integer | Count of sessions in bucket |
| computeHours | number (2 decimal) | Sum of compute hours in bucket |
| tokens | integer | Sum of tokens in bucket |

### OutcomeDistribution (computed aggregate)

Session outcome breakdown for a time range.

| Field | Type | Description |
|-------|------|-------------|
| outcome | enum | `success` \| `error` \| `timeout` \| `cancelled` |
| count | integer | Number of sessions with this outcome |
| percentage | number (0-100) | Proportion of total sessions |

### ErrorCategory (computed aggregate)

Error breakdown when sessions have errors.

| Field | Type | Description |
|-------|------|-------------|
| category | string | Error category label |
| count | integer | Number of sessions with this error category |
| percentage | number (0-100) | Proportion of total error sessions |

---

## Validation Rules

- `organizationId` must be a valid UUID matching the authenticated user's organization.
- `billingPeriodStart` must be before `billingPeriodEnd`.
- `computeDurationMs` must be ≥ 0.
- `inputTokens` and `outputTokens` must be ≥ 0.
- `outcome` must be one of the four enum values.
- `errorCategory` must be non-null when `outcome` is `error`; must be null otherwise.
- `role` must be one of the four enum values.
- `status` must be `active` or `removed`.
- `successRate` must be between 0 and 1 inclusive.
- Date range queries: `startDate` must be ≤ `endDate`; maximum range is 365 days.

---

## State Transitions

### AgentSession.outcome

Sessions are received in their final state from the data service (the dashboard does not track in-progress sessions). No state transitions occur within the dashboard.

### Member.status

```
active → removed  (member removal; irreversible from dashboard perspective)
```

Removed members remain visible in historical data with a "Removed" badge. They are excluded from the `activeUserCount` aggregate.
