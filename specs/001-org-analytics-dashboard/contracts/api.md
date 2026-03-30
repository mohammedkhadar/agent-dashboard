# API Contracts: Org Analytics Dashboard

**Feature**: 001-org-analytics-dashboard
**Date**: 2026-03-30
**Protocol**: REST over HTTPS
**Format**: JSON
**Auth**: Bearer token in `Authorization` header (existing auth system)

All endpoints are scoped to the authenticated user's organization. The `organizationId` is derived from the auth token — never passed as a URL parameter.

---

## Common Headers

**Request**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response**:
```
Content-Type: application/json
X-Request-Id: <uuid>
```

## Common Query Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| startDate | ISO 8601 date | Yes | Start of date range (inclusive) |
| endDate | ISO 8601 date | Yes | End of date range (inclusive) |

## Common Error Response

```json
{
  "error": {
    "code": "UNAUTHORIZED | FORBIDDEN | BAD_REQUEST | INTERNAL_ERROR",
    "message": "Human-readable error description"
  }
}
```

| HTTP Status | Code | When |
|-------------|------|------|
| 401 | UNAUTHORIZED | Invalid or expired token |
| 403 | FORBIDDEN | User lacks required role (admin, manager, billing) |
| 400 | BAD_REQUEST | Invalid query params (bad dates, invalid granularity) |
| 500 | INTERNAL_ERROR | Unexpected server failure |

---

## Endpoints

### GET /api/usage/summary

Returns the aggregate usage summary for the organization within a date range.

**Query Parameters**: `startDate`, `endDate` (common)

**Response** `200 OK`:
```json
{
  "data": {
    "periodStart": "2026-03-01",
    "periodEnd": "2026-03-30",
    "totalSessions": 4230,
    "totalComputeHours": 1285.50,
    "totalTokens": 89420150,
    "activeUserCount": 42
  }
}
```

**Maps to**: FR-001 (summary overview), User Story 1

---

### GET /api/usage/trends

Returns time-series usage data aggregated by the specified granularity.

**Query Parameters**:

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| startDate | ISO 8601 date | Yes | Start of date range |
| endDate | ISO 8601 date | Yes | End of date range |
| granularity | enum | Yes | `daily` \| `weekly` \| `monthly` |

**Response** `200 OK`:
```json
{
  "data": {
    "granularity": "daily",
    "points": [
      {
        "date": "2026-03-01",
        "sessions": 142,
        "computeHours": 43.20,
        "tokens": 2980050
      },
      {
        "date": "2026-03-02",
        "sessions": 0,
        "computeHours": 0,
        "tokens": 0
      }
    ]
  }
}
```

**Notes**:
- Zero-filled: dates with no data return zero values (not omitted).
- Weekly granularity: `date` is the ISO week start (Monday).
- Monthly granularity: `date` is the first of the month.

**Maps to**: FR-002, FR-003, User Story 2

---

### GET /api/usage/members

Returns per-member usage breakdown with pagination and sorting.

**Query Parameters**:

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| startDate | ISO 8601 date | Yes | — | Start of date range |
| endDate | ISO 8601 date | Yes | — | End of date range |
| page | integer | No | 1 | Page number (1-indexed) |
| pageSize | integer | No | 25 | Items per page (max 100) |
| sortBy | enum | No | `sessions` | `sessions` \| `computeHours` \| `totalTokens` \| `successRate` \| `lastActiveAt` |
| sortOrder | enum | No | `desc` | `asc` \| `desc` |

**Response** `200 OK`:
```json
{
  "data": {
    "members": [
      {
        "memberId": "uuid-001",
        "memberName": "Alice Chen",
        "memberEmail": "alice@example.com",
        "memberStatus": "active",
        "sessions": 312,
        "computeHours": 95.40,
        "totalTokens": 6520300,
        "successRate": 0.94,
        "lastActiveAt": "2026-03-29T14:23:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "totalItems": 47,
      "totalPages": 2
    }
  }
}
```

**Notes**:
- Removed members are included with `memberStatus: "removed"`.
- Members with zero sessions show `successRate: 0` and `lastActiveAt: null`.

**Maps to**: FR-004, FR-014, FR-015, User Story 3

---

### GET /api/usage/outcomes

Returns session outcome distribution for the organization.

**Query Parameters**: `startDate`, `endDate` (common)

**Response** `200 OK`:
```json
{
  "data": {
    "totalSessions": 4230,
    "outcomes": [
      { "outcome": "success", "count": 3810, "percentage": 90.07 },
      { "outcome": "error", "count": 253, "percentage": 5.98 },
      { "outcome": "timeout", "count": 127, "percentage": 3.00 },
      { "outcome": "cancelled", "count": 40, "percentage": 0.95 }
    ],
    "errorCategories": [
      { "category": "context_limit_exceeded", "count": 102, "percentage": 40.32 },
      { "category": "tool_execution_failed", "count": 89, "percentage": 35.18 },
      { "category": "rate_limited", "count": 62, "percentage": 24.51 }
    ]
  }
}
```

**Notes**:
- `errorCategories` is empty array `[]` when there are no error sessions.
- Percentages in `outcomes` sum to ~100 (rounding). Percentages in `errorCategories` are relative to total error sessions.

**Maps to**: FR-005, FR-006, User Story 4

---

### GET /api/org/profile

Returns the organization's profile information (needed for timezone and billing period).

**Query Parameters**: None

**Response** `200 OK`:
```json
{
  "data": {
    "id": "uuid-org",
    "name": "Acme Corp",
    "timezone": "America/New_York",
    "billingPeriodStart": "2026-03-01",
    "billingPeriodEnd": "2026-03-31"
  }
}
```

**Maps to**: FR-011 (timezone), FR-002 (default date range from billing period)
