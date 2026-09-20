# Backend: API & Services

The backend is an Express + TypeScript API server using Prisma ORM with PostgreSQL. Source lives under `backend/src/`.

## Entrypoints

### `backend/src/app.ts` — Express application setup
- Creates the Express app, configures CORS (origin from `config.cors.origin`), JSON body parsing.
- Mounts Swagger UI at `/api-docs`.
- Health check at `/health` → `{ status: 'ok' }`.
- Auth routes at `${config.api.prefix}/auth`.
- Transaction routes at `${config.api.prefix}/transactions`.
- Error middleware registered last.

### `backend/src/server.ts` — HTTP server
- Imports `app` from `app.ts`.
- Starts listening on `process.env.PORT || config.port || 3000`.
- Skips `app.listen` when `NODE_ENV === 'test'` so tests import `app` directly without binding a port.

### `backend/src/config/index.ts` — Environment configuration
Loaded via `dotenv.config()`. Exports a single `config` object:

| Key | Env Var | Default |
|-----|---------|---------|
| `env` | `NODE_ENV` | `development` |
| `port` | `PORT` | `3000` |
| `database.url` | `DATABASE_URL` | — |
| `api.prefix` | `API_PREFIX` | `/api/v1` |
| `cors.origin` | `CORS_ORIGIN` | `['http://localhost:5173', 'http://finance-tracker-frontend:5173']` (comma-separated) |
| `rateLimit.windowMs` | `RATE_LIMIT_WINDOW` | `900000` (15 min) |
| `rateLimit.max` | `RATE_LIMIT_MAX_REQUESTS` | `100` |
| `jwt.secret` | `JWT_SECRET` | `your-secret-key` |
| `jwt.expiresIn` | `JWT_EXPIRES_IN` | `24h` |

> **Note:** Rate limiting config is defined but not currently wired into any middleware. It may be a planned feature.

## API Routes

### Auth Routes (`backend/src/routes/auth.routes.ts`)

| Method | Path | Auth | Validation | Handler |
|--------|------|------|-----------|---------|
| POST | `/api/v1/auth/register` | None | `express-validator` body checks | `UserService.register` |
| POST | `/api/v1/auth/login` | None | `express-validator` body checks | `UserService.login` |

**Register** requires: `email` (valid email), `password` (min 6 chars), `firstName` (2–50 chars), `lastName` (2–50 chars).

**Login** requires: `email` (valid email), `password` (non-empty).

### Transaction Routes (`backend/src/routes/transaction.routes.ts`)

All transaction routes require JWT authentication via `authenticateToken` middleware (applied with `router.use`).

| Method | Path | Validation | Handler |
|--------|------|-----------|---------|
| POST | `/api/v1/transactions` | `validateTransaction` | `TransactionController.createTransaction` |
| GET | `/api/v1/transactions` | `validateTransactionFilters` | `TransactionController.listTransactions` |
| GET | `/api/v1/transactions/categories` | — | `TransactionController.getCategories` |

## Controllers

### `TransactionController` (`backend/src/controllers/transaction.controller.ts`)
Thin controller class with three methods. Each extracts `req.user.userId` from the JWT payload, delegates to `TransactionService`, and returns JSON. Throws `Error('User not authenticated')` if `userId` is missing (should not happen if `authenticateToken` runs first).

## Services

### `UserService` (`backend/src/services/user.service.ts`)
- **`register({ email, password, firstName, lastName })`** — Checks for existing email (throws `AuthError`), hashes password with bcrypt (10 salt rounds), creates user via Prisma, generates JWT, returns `{ user, token }`.
- **`login({ email, password })`** — Finds user by email, compares password hash, throws `AuthError('Invalid credentials')` on mismatch, generates JWT, returns `{ user, token }`.
- **`generateToken(userId, email, firstName, lastName)`** — Signs JWT with `config.jwt.secret` and `config.jwt.expiresIn`.

### `TransactionService` (`backend/src/services/transaction.service.ts`)
- **`createTransaction(data, userId)`** — Validates amount > 0, validates category matches type via `TRANSACTION_CATEGORIES`, creates via Prisma. Maps Prisma `Decimal` to `number` using `.toNumber()`.
- **`listTransactions(filters, userId)`** — Queries Prisma with user-scoped `where` clause, optional `type`, `category`, `date` range (`startDate`/`endDate`). Orders by `date: desc`. Maps `Decimal` → `number`.
- **`getCategories(userId)`** — Returns unique categories from all user's transactions. Fetches all transactions then computes unique categories via `Set` — could be optimized with a `distinct` or `groupBy` query.

> **Note:** There are no update (PUT) or delete (DELETE) endpoints — transactions are write-once. Edit/delete buttons exist in the frontend `TransactionTable` but are non-functional stubs.

## Middleware

### `authenticateToken` (`backend/src/middlewares/auth.middleware.ts`)
Extracts Bearer token from `Authorization` header, verifies with `jwt.verify`. On success, attaches decoded payload to `req.user` as `JWTPayload`. Throws `AuthError` for missing or invalid tokens.

### `validation.middleware.ts`
- **`validateTransaction`** — Body validation chain: `type` must be in `TransactionType` enum, `category` must be valid for the given `type`, `amount` must be float ≥ 0.01, `date` must be ISO 8601.
- **`validateTransactionFilters`** — Query validation: optional `type`, `category` (must match type if both provided), `startDate`/`endDate` (ISO 8601).
- **`validateRequest`** — Used by auth routes; collects `express-validator` errors and throws `ValidationError`.

> **Note:** Two different error-handling strategies coexist — transaction validation chains use `validateResults` (responds 400 directly), while `validateRequest` throws `ValidationError` to the error middleware. Both work but the inconsistency is worth knowing when adding new validation.

### `error.middleware.ts`
Catches all errors with `statusCode` property (from `ValidationError` / `AuthError`). Defaults to 500. Includes stack trace in development mode.

## Types & Error Utilities

### `backend/src/types/index.ts`
- `TransactionType` enum: `INCOME`, `EXPENSE`
- `TRANSACTION_CATEGORIES` constant: type → allowed category names
- `TransactionCategory` type: union of all category strings
- `CreateTransactionDTO`, `Transaction`, `TransactionFilters` interfaces

### `backend/src/types/auth.types.ts`
- `RegisterUserDTO`, `LoginUserDTO` interfaces
- `JWTPayload`: `{ userId, email, firstName, lastName }`
- `AuthenticatedRequest`: extends Express `Request` with optional `user?: JWTPayload`

### `backend/src/utils/error.util.ts`
- `ValidationError` — extends `Error`, sets `statusCode = 400`
- `AuthError` — extends `Error`, sets `statusCode = 401`

### `backend/src/types/user.types.ts`
- Defines `User`, `CreateUserDTO`, `LoginDTO`, `AuthResponse` — appears partially superseded by `auth.types.ts`. The `User` interface here includes `password` and lacks `firstName`/`lastName`, suggesting an earlier design iteration. New code should prefer `auth.types.ts`.

## Swagger / OpenAPI

`backend/src/config/swagger.config.ts` generates OpenAPI 3.0 specs from JSDoc annotations in route files. Schemas include `TransactionType`, `TransactionCategories`, `Transaction`, `Error`. Security scheme is `bearerAuth` (JWT). Served at `/api-docs` via `swagger-ui-express`.

## Database & Prisma

- **Schema:** `backend/prisma/schema.prisma` — defines `User` and `Transaction` models (see [Architecture Overview](../architecture/overview.md#data-model) for field details).
- **Migrations:** Three migrations under `backend/prisma/migrations/` — init, add User model, add description to Transaction.
- **Seeds:** `backend/prisma/seed.ts` orchestrates `seeds/create-user.ts` (creates default user with hashed password) and `seeds/create-transactions.ts` (creates sample income/expense transactions for the default user).
- **Utility:** `backend/scripts/generate-hash.ts` — CLI tool for generating bcrypt password hashes for development/testing.

> **Note:** The `description` field on the Transaction model was added in migration `20241223071754` but is not referenced in the backend service or controller layer. It exists in the Prisma schema and is returned by Prisma queries, but there is no validation or DTO for it. The frontend `TransactionForm` does have an optional `description` field in its Zod schema, but the backend `CreateTransactionDTO` does not include it. This means descriptions entered on the frontend are not persisted by the backend.

## Where to Start When Changing the Backend

- **Adding a new API route:** Add route in `routes/`, controller method in `controllers/`, service method in `services/`. Add JSDoc OpenAPI annotations in the route file.
- **Changing validation rules:** Update `middlewares/validation.middleware.ts` and the corresponding `express-validator` chains.
- **Adding a new transaction category:** Update `TRANSACTION_CATEGORIES` in both `backend/src/types/index.ts` and `frontend/src/constants/transactions.ts` to keep them in sync.
- **Database schema changes:** Edit `prisma/schema.prisma`, run `npx prisma migrate dev --name <description>`, update types if needed.
- **Environment changes:** Update `config/index.ts` and `backend/.env.example`.
