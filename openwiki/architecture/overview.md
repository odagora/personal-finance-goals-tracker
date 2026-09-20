# Architecture Overview

## System Layout

```
┌──────────────┐     HTTP/REST      ┌──────────────┐     Prisma      ┌──────────────┐
│   Frontend   │  ────────────────▶ │   Backend    │  ────────────▶  │  PostgreSQL  │
│  React SPA   │  VITE_API_URL      │  Express API │  DATABASE_URL   │     16       │
│  (Vite)      │  ◀──────────────── │  (Node 20)   │  ◀────────────  │              │
└──────────────┘    JSON + JWT      └──────────────┘                 └──────────────┘
```

Three services compose via `docker-compose.yml`:

- **frontend** — Vite dev server on port 5173, proxies API calls to the backend.
- **app** — Express API on port 3000, runs Prisma migrations on startup.
- **db** — PostgreSQL 16 on port 5432.

## Request Flow

### Authentication Flow

1. User submits login/register form on the frontend.
2. Frontend `AuthProvider` calls `POST /api/v1/auth/login` or `POST /api/v1/auth/register`.
3. Backend `UserService` validates credentials, hashes passwords with bcrypt, signs a JWT containing `{ userId, email, firstName, lastName }`.
4. Frontend stores the JWT in `localStorage`, sets it as the default Axios `Authorization` header, and decodes it via `jwt-decode` to populate user state.
5. On subsequent requests, the Axios request interceptor attaches the token. The backend `authenticateToken` middleware verifies it and injects `req.user`.

### Transaction Flow

1. Authenticated user navigates to `/transactions` (protected route).
2. `ListTransactions` page fetches transactions via `transactionService.getAll(filters)` → `GET /api/v1/transactions?type=&category=&startDate=&endDate=`.
3. `TransactionController.listTransactions` reads `req.user.userId` from the JWT payload, delegates to `TransactionService.listTransactions(filters, userId)`.
4. `TransactionService` queries Prisma with user-scoped `where` clause and optional filters, returns results ordered by `date: desc`.
5. The page also fetches unique categories via `GET /api/v1/transactions/categories`.
6. Creating a transaction: user fills the `TransactionForm` (Zod-validated), frontend calls `POST /api/v1/transactions`, backend validates the category matches the type, creates via Prisma, and the frontend shows a toast notification.

## Data Model

### User (`backend/prisma/schema.prisma`)

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key, auto-generated |
| email | String | Unique constraint |
| firstName | String (VarChar 50) | |
| lastName | String (VarChar 50) | |
| password | String | bcrypt hash (10 salt rounds) |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |
| transactions | Transaction[] | Relation |

### Transaction

| Field | Type | Notes |
|-------|------|-------|
| id | String (UUID) | Primary key, auto-generated |
| type | String (VarChar 10) | `INCOME` or `EXPENSE` |
| category | String (VarChar 50) | Must be valid for the type |
| amount | Decimal (10,2) | Must be > 0 |
| date | DateTime | Transaction date |
| description | String? (Text) | Optional, added in migration 2024-12-23 |
| userId | String | FK → User.id |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

**Indexes:** `userId`, `type`, `category`.

### Migration History

1. `20241118024055_init` — Initial Transaction table with indexes.
2. `20241209001834_add_user_model` — User table, unique email, FK from Transaction to User.
3. `20241223071754_add_description_to_transaction` — Added optional `description` column.

## Domain Concepts

### Transaction Types & Categories

Defined identically on both frontend (`frontend/src/constants/transactions.ts`) and backend (`backend/src/types/index.ts`):

- **INCOME**: Salary, Freelance, Investments, Gifts, Other Income (5 categories — both sides agree)
- **EXPENSE**: Backend has 9: Food, Transportation, Housing, Utilities, Healthcare, Entertainment, Shopping, Education, Other Expenses. Frontend has 7: Food, Transportation, Housing, Utilities, Shopping, Education, Other Expenses — **missing Healthcare and Entertainment**.

> **Known discrepancy:** The frontend `constants/transactions.ts` is missing `Healthcare` and `Entertainment` from the EXPENSE list. The backend is the source of truth for validation — if a user somehow creates a transaction with the Healthcare category (e.g., via API), the frontend won't display it in filter dropdowns.

### Error Handling

- `ValidationError` (status 400) — invalid input, bad category/type match, amount ≤ 0.
- `AuthError` (status 401) — missing/invalid token, invalid credentials.
- Unhandled errors default to 500 via `errorMiddleware`.
- In development mode, the error response includes the stack trace.

### API Prefix

All API routes are mounted under `/api/v1` (configurable via `API_PREFIX` env var). Health check is at `/health` (outside the API prefix). Swagger docs are at `/api-docs`.

## Historical Context

The repository evolved in three phases (visible in git history):

1. **Auth foundation** — User registration, login, JWT auth, ProtectedRoute, AuthProvider context.
2. **Transactions feature** — Transaction model, CRUD service, list page with filters/pagination, new transaction form with Zod validation, type-dependent categories.
3. **CI/CD & deployment** — Dockerfiles, GitHub Actions workflows, Railway backend deployment, Vercel frontend deployment, CORS configuration, environment hardening.

See [Backend: API & Services](../backend/api-and-services.md) and [Frontend: SPA Overview](../frontend/spa-overview.md) for implementation details.
