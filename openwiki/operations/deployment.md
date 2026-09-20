# Operations & Deployment

## Docker

### Development (`docker-compose.yml`)
Three services on a `finance-tracker-network` bridge network:

| Service | Container | Image | Port | Notes |
|---------|-----------|-------|------|-------|
| `frontend` | `finance-tracker-frontend` | Built from `frontend/Dockerfile` | 5173 | Dev target stage, hot-reload via volume mount, `--host 0.0.0.0` |
| `app` | `finance-tracker-app` | Built from `backend/Dockerfile` | 3000 | Runs `prisma generate` + `prisma migrate deploy` + `npm run dev` on startup |
| `db` | `finance-tracker-db` | `postgres:16` | 5432 | Persistent volume `postgres_data` |

**Volume mounts:** Frontend and backend source directories are mounted for hot-reload. `node_modules` is an anonymous volume to prevent host overrides.

**Environment:** Backend gets `DATABASE_URL`, `CORS_ORIGIN`, `NODE_ENV=development` from compose. Frontend gets `VITE_API_URL` pointing to `localhost:3000`.

### Backend Dockerfiles

- **`backend/Dockerfile`** (dev) — Node 20 slim, installs OpenSSL, copies source, runs `npm install`, generates Prisma client, exposes 3000, runs `npm run dev`.
- **`backend/Dockerfile.prod`** (production) — Node 20 slim, installs OpenSSL, `npm ci`, accepts `DATABASE_URL` as build arg, runs `prisma generate` + `prisma migrate deploy`, builds TypeScript, sets `NODE_ENV=production`, runs `npm start`.

### Frontend Dockerfiles

- **`frontend/Dockerfile`** (dev) — Not detailed here, uses build target stages with `NODE_ENV` target.
- **`frontend/Dockerfile.prod`** (production) — Multi-stage build: `node:20-slim` builder stage compiles Vite production build, then `nginx:alpine` serves the `dist/` output with SPA fallback routing.
- **`frontend/nginx.conf`** — Serves on port 80, `try_files` fallback to `/index.html` for React Router, caches `/assets/` for 1 year.

## CI/CD Pipelines

### Backend (`/.github/workflows/backend.yml`)
Triggers on push/PR to `main` when `backend/**` or the workflow file changes.

1. Checkout, setup Node.js 20 with npm cache.
2. `npm ci` in `backend/`.
3. `npx prisma generate`.
4. `npm test` with `DATABASE_URL` and `JWT_SECRET` from secrets.
5. On `main` branch only: install Railway CLI, link project via `RAILWAY_PROJECT_ID` secret, deploy via `railway up --service`.

### Frontend (`/.github/workflows/frontend.yml`)
Triggers on push/PR to `main` when `frontend/**` or the workflow file changes.

1. Checkout, setup Node.js 20 with npm cache.
2. `npm ci` in `frontend/`.
3. `npm test` (Vitest).
4. `npm run build` with `VITE_API_URL` from secrets.
5. On `main` branch only: deploy to Vercel using `amondnet/vercel-action@v25` with `--prod` flag.

### OpenWiki Update (`/.github/workflows/openwiki-update.yml`)
Scheduled daily at 08:00 UTC (`workflow_dispatch` also available). Installs OpenWiki globally, runs `openwiki code --update --print`, creates a pull request on branch `openwiki/update` with any documentation changes.

## Environment Configuration

### Backend (`backend/.env.example`)

| Variable | Example | Required? | Notes |
|----------|---------|-----------|-------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/finance_tracker` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | `your-jwt-secret` | Yes | Secret for signing JWTs |
| `PORT` | `3000` | No | Defaults to 3000 |
| `NODE_ENV` | `development` | No | |
| `API_PREFIX` | `/api/v1` | No | |
| `CORS_ORIGIN` | `http://localhost:5173,http://finance-tracker-frontend:5173` | No | Comma-separated list |
| `RATE_LIMIT_WINDOW` | (empty) | No | Defined but not wired |
| `RATE_LIMIT_MAX_REQUESTS` | (empty) | No | Defined but not wired |

### Frontend (`frontend/.env.example`)

| Variable | Example | Notes |
|----------|---------|-------|
| `VITE_API_URL` | `http://localhost:3000/api/v1` | Backend API base URL |

The frontend also has `.env.test` and `.env.test.docker` for test environments. In test mode, the API URL switches to `http://app:3000/api/v1` when `DOCKER=true` (Docker test) or `http://localhost:3000/api/v1` (local test).

## Deployment Targets

- **Backend:** Railway (via Railway CLI in CI). Requires `RAILWAY_TOKEN`, `RAILWAY_PROJECT_ID`, `RAILWAY_SERVICE_NAME` secrets.
- **Frontend:** Vercel (via `vercel-action`). Requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets. Also needs `VITE_API_URL` secret pointing to the deployed backend URL.

## CI/CD Secrets Required

| Secret | Used by | Purpose |
|--------|---------|---------|
| `TEST_DATABASE_URL` | backend.yml | Test-time database URL |
| `JWT_SECRET` | backend.yml | Test-time JWT secret |
| `RAILWAY_TOKEN` | backend.yml | Railway CLI auth |
| `RAILWAY_PROJECT_ID` | backend.yml | Railway project link |
| `RAILWAY_SERVICE_NAME` | backend.yml | Railway service target |
| `VITE_API_URL` | frontend.yml | Production API URL for build |
| `VERCEL_TOKEN` | frontend.yml | Vercel deployment auth |
| `VERCEL_ORG_ID` | frontend.yml | Vercel org ID |
| `VERCEL_PROJECT_ID` | frontend.yml | Vercel project ID |
| `OPENROUTER_API_KEY` | openwiki-update.yml | OpenWiki LLM API key |
| `LANGSMITH_API_KEY` | openwiki-update.yml | LangSmith tracing |

## Historical Context

The CI/CD setup was added in a burst of commits (`2b5aa14` → `4e1cf96`) that:
1. Added initial deployment workflows and Docker configurations.
2. Iteratively fixed cache paths, build configuration, and deployment paths.
3. Enhanced CORS configuration to support multiple origins.
4. Added `DATABASE_URL` handling in Railway deployment.
5. Added a comprehensive Railway deployment guide (`backend/README.md`).

## CI/CD Gaps & Notes

- **No lint step in CI** — both workflows skip `npm run lint` despite lint scripts existing.
- **No E2E tests** — the test suite stops at component/integration level (no Playwright/Cypress).
- **Frontend prod Dockerfile not used in CI** — Vercel handles deployment directly; the nginx-based `Dockerfile.prod` is an alternative deployment path not wired into the workflow.
- **Backend `Dockerfile.prod` runs migrations at build time** — `prisma migrate deploy` runs during Docker build, which requires `DATABASE_URL` to be accessible at build time. If the database isn't reachable during build, the build will fail.
- **No multi-stage build for backend** — production image includes dev dependencies (`ts-node`, `jest`, etc.).
- **`backend/README.md` inline schema is outdated** — missing `firstName`/`lastName` and `description` fields that exist in the actual `schema.prisma`.

## Operations Runbook

### Common Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f [frontend|app|db]

# Rebuild containers
docker compose build --no-cache

# Restart a specific service
docker compose restart [frontend|app]

# Run database migrations manually
docker compose exec app npx prisma migrate dev

# Seed the database
docker compose exec app npx prisma db seed

# Access database CLI
docker compose exec db psql -U postgres -d finance_tracker

# Run tests
docker compose exec app npm test          # backend
docker compose exec frontend npm test     # frontend
```

### Production Build

```bash
# Backend
cd backend && npm ci && npx prisma generate && npm run build
# Run: node dist/server.js (needs DATABASE_URL, JWT_SECRET)

# Frontend
cd frontend && npm ci && npm run build
# Serve dist/ via nginx or static host with SPA fallback
```
