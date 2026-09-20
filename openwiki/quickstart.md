# Personal Finance Goals Tracker

A full-stack application for tracking personal financial transactions. Users register, log in, and manage income/expense transactions with type-dependent categories, filtering, and pagination.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router v7 |
| Backend | Node.js 20, Express, TypeScript |
| Database | PostgreSQL 16, Prisma ORM |
| Auth | JWT (bcryptjs hashing, jsonwebtoken signing/verification) |
| API Docs | Swagger/OpenAPI via swagger-jsdoc + swagger-ui-express |
| Container | Docker, Docker Compose |
| CI/CD | GitHub Actions (backend → Railway, frontend → Vercel) |
| Testing | Backend: Jest + Supertest; Frontend: Vitest + React Testing Library |

## Quick Start

### Using Docker (recommended)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up -d
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs (Swagger): http://localhost:3000/api-docs

### Local development (without Docker)

**Backend:**
```bash
cd backend && npm install
createdb finance_tracker
npx prisma generate && npx prisma migrate dev
npm run dev   # http://localhost:3000
```

**Frontend:**
```bash
cd frontend && npm install
npm run dev   # http://localhost:5173
```

## Project Structure

```
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/         # Environment + Swagger config
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Auth, validation, error handling
│   │   ├── routes/         # Express route definitions + OpenAPI annotations
│   │   ├── services/       # Business logic (User, Transaction)
│   │   ├── types/          # Shared TypeScript types & enums
│   │   ├── utils/          # Error classes
│   │   ├── app.ts          # Express app setup (CORS, routes, middleware)
│   │   └── server.ts       # HTTP server entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema (User, Transaction)
│   │   ├── migrations/     # Prisma migration history
│   │   └── seeds/          # Seed scripts
│   └── Dockerfile[.prod]   # Dev + production containers
├── frontend/         # React SPA
│   ├── src/
│   │   ├── components/     # UI (shadcn/ui), auth, common, layouts
│   │   ├── contexts/      # AuthProvider + context
│   │   ├── hooks/         # useAuth, useToast
│   │   ├── pages/         # Home, Auth, Transactions
│   │   ├── services/      # Axios API client + transaction service
│   │   ├── types/         # Auth & transaction types
│   │   ├── constants/     # Transaction categories enum
│   │   └── routes.tsx     # React Router config
│   └── Dockerfile[.prod]  # Dev + Nginx production containers
├── docker-compose.yml # frontend + app + db
└── .github/workflows/ # CI/CD pipelines
```

## Documentation Sections

- [Architecture Overview](./architecture/overview.md) — Full-stack request flow, data model, domain concepts
- [Backend: API & Services](./backend/api-and-services.md) — Express app, routes, controllers, services, middleware, auth, config
- [Frontend: SPA Overview](./frontend/spa-overview.md) — Routing, auth context, services, pages, UI components
- [Operations & Deployment](./operations/deployment.md) — Docker, CI/CD, Railway/Vercel, environment configuration
- [Testing Guide](./testing/guide.md) — Jest + Vitest patterns, test structure, mocking conventions

## Key Domain Concepts

- **Transaction Types**: `INCOME` and `EXPENSE` — each with its own set of allowed categories.
- **Type-Dependent Categories**: Income categories (Salary, Freelance, Investments, Gifts, Other Income) differ from Expense categories (Food, Transportation, Housing, Utilities, Healthcare, Entertainment, Shopping, Education, Other Expenses). The backend enforces this constraint; the frontend has a known discrepancy — it's missing `Healthcare` and `Entertainment` from the EXPENSE list (see [Architecture Overview](./architecture/overview.md#domain-concepts)).
- **User-Scoped Data**: All transactions are scoped to the authenticated user via JWT.
- **Category Validation**: The backend validates that the category matches the selected type. The frontend dynamically updates available categories when the type changes.

## Available Scripts

### Backend (`cd backend`)
| Script | Description |
|--------|------------|
| `npm run dev` | Start dev server with hot-reload (ts-node-dev) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run production server |
| `npm test` | Run Jest test suite |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

### Frontend (`cd frontend`)
| Script | Description |
|--------|------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript build + Vite production build |
| `npm test` | Run Vitest test suite |
| `npm run test:coverage` | Vitest with coverage |
| `npm run test:watch` | Vitest watch mode |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## OpenWiki Maintenance

This repository uses OpenWiki for recurring code documentation. The scheduled GitHub Actions workflow (`.github/workflows/openwiki-update.yml`) runs daily at 08:00 UTC and creates a pull request with documentation updates. Do not hand-edit generated OpenWiki pages unless explicitly asked — prefer updating source code/docs and letting OpenWiki regenerate.
