# Frontend: SPA Overview

React 18 single-page application built with Vite, TypeScript, Tailwind CSS, and shadcn/ui components. Source lives under `frontend/src/`.

## Entrypoint & Routing

### `frontend/src/main.tsx`
Root render: wraps `<RouterProvider>` in `<AuthProvider>` inside `<StrictMode>`. Imports `index.css` for Tailwind base styles.

### `frontend/src/routes.tsx`
Uses `createBrowserRouter` with a `RootLayout` parent that renders `<Outlet />` + `<Toaster />`:

| Path | Component | Protected? |
|------|-----------|-----------|
| `/` | `Home` | No |
| `/auth/login` | `Login` | No |
| `/auth/register` | `Register` | No |
| `/transactions` | `ListTransactions` | Yes (`ProtectedRoute`) |
| `/transactions/new` | `NewTransaction` | Yes (`ProtectedRoute`) |

### `RootLayout` (`frontend/src/components/layouts/RootLayout.tsx`)
Minimal wrapper: renders `<Outlet />` for nested routes and `<Toaster />` for toast notifications. Added in commit `10b458e` to support toast display across all pages.

## Authentication

### AuthProvider (`frontend/src/contexts/AuthProvider.tsx`)
- Manages `AuthState`: `{ user, token, isAuthenticated, isLoading }`.
- On mount, reads JWT from `localStorage`, decodes it via `jwt-decode`, checks expiry, sets `Authorization` header on Axios instance.
- Exposes `login(credentials)`, `register(credentials)`, `logout()` via React context.
- `login` calls `POST /auth/login`, stores token in `localStorage`, transforms backend user shape (`firstName` + `lastName` → `name`).
- `register` calls `POST /auth/register`, same flow.
- `logout` removes token from `localStorage`, clears Axios header, resets state.

### AuthContext (`frontend/src/contexts/auth.context.ts`)
Creates the React context with `undefined` initial value. Consumed via `useAuth` hook.

### `useAuth` (`frontend/src/hooks/useAuthContext.ts`)
Throws if used outside `AuthProvider`. Returns the full `AuthContextType` (state + login/register/logout).

### `ProtectedRoute` (`frontend/src/components/auth/ProtectedRoute.tsx`)
Checks `isAuthenticated` and `isLoading` from `useAuth`. Shows "Loading..." while loading, redirects to `/auth/login` if unauthenticated, otherwise renders children.

## API Client

### `frontend/src/services/api.ts`
- Creates an Axios instance with `baseURL` from `VITE_API_URL` (default `http://localhost:3000/api/v1`).
- Request interceptor attaches `Authorization: Bearer <token>` from `localStorage` on every request.
- Logs the API URL on module load (useful for debugging env issues).

### `frontend/src/services/transaction.service.ts`
- **`getAll(filters)`** — `GET /transactions` with cleaned query params (removes empty/undefined values, filters to valid keys). Returns `{ data, meta }` with pagination metadata.
- **`getCategories()`** — `GET /transactions/categories`, returns `string[]`.
- **`create(transaction)`** — `POST /transactions` with `CreateTransactionDTO`.

## Pages

### Home (`frontend/src/pages/Home/`)
Landing page with hero section, features, call-to-action, and footer. Includes social icons (Facebook, Instagram, LinkedIn, Twitter). Public route — no auth required.

### Auth (`frontend/src/pages/Auth/`)
- **`Login.tsx`** — Form with email/password, Zod validation, calls `login()` from auth context, navigates to `/transactions` on success, shows error toast on failure.
- **`Register.tsx`** — Form with firstName/lastName/email/password, Zod validation, calls `register()`, navigates to `/transactions` on success.
- **`AuthLayout`** — Shared layout component for auth pages.
- **`AuthHeader`** — Header with FinTracker logo.

### Transactions (`frontend/src/pages/Transactions/`)
- **`ListTransactions.tsx`** — Main dashboard page. Fetches transactions and categories on mount, manages filter state, renders `TransactionFilters`, `TransactionTable`, `TransactionPagination`. Resets page to 1 when filters change.
- **`NewTransaction.tsx`** — Page with `TransactionForm` component for creating new transactions.
- **`TransactionForm`** — Zod-validated form (react-hook-form + zod). Type select controls available categories. Date picker, amount input, optional description. On submit calls `transactionService.create()`, shows success toast, navigates back to `/transactions`.
- **`TransactionFilters`** — Type-dependent category dropdown (category options update when type changes). Date range filters. Reset button.
- **`TransactionTable`** — Table rendering transaction rows.
- **`TransactionPagination`** — Pagination controls.

## UI Components

### shadcn/ui (`frontend/src/components/ui/`)
Pre-built Radix UI primitives styled with Tailwind CSS. Components include: button, input, label, form, select, dialog, popover, table, badge, avatar, calendar, dropdown-menu, textarea, toast, toaster, tooltip. Configured via `frontend/components.json` with `@/` alias, slate base color, CSS variables enabled.

### Common Components (`frontend/src/components/common/`)
- **`TopNav/`** — Top navigation bar with `UserNav` (user profile dropdown) and `NotificationBell`.
- **`SideNav/`** — Sidebar navigation for dashboard pages.
- **`PageHeader/`** — Reusable page header with title and description.

### Auth Components (`frontend/src/components/auth/`)
- `ProtectedRoute` — Route guard.
- `AuthLayout/` — Shared layout for auth pages.
- `AuthHeader/` — Brand header.

## Domain Types & Constants

### `frontend/src/types/auth.ts`
- `User`, `AuthState`, `LoginCredentials`, `RegisterCredentials`, `AuthContextType`.

### `frontend/src/types/transaction.ts`
- `Transaction`, `TransactionFilters`, `TransactionResponse` (with `meta` for pagination).

### `frontend/src/constants/transactions.ts`
- `TransactionType` enum (INCOME, EXPENSE) and `TRANSACTION_CATEGORIES` constant.
- **Known discrepancy:** Frontend has 7 expense categories (missing `Healthcare` and `Entertainment`), backend has 9. Backend is the validation source of truth.

## Build Configuration

### Vite (`frontend/vite.config.ts`)
- React plugin + `vite-tsconfig-paths` for `@/` alias resolution.
- Dev server: polling enabled (for Docker compatibility), host `true`, port `5173`.

### Vitest (`frontend/vitest.config.ts`)
- Merges with Vite config. Uses `jsdom` environment, setup file `src/test/setup.ts`, `@/` alias for test resolution.

### Tailwind (`frontend/tailwind.config.js`, `frontend/postcss.config.js`)
Standard Tailwind + PostCSS setup with `tailwindcss-animate` plugin for shadcn/ui animations.

## Where to Start When Changing the Frontend

- **Adding a new page:** Create component in `pages/`, add route in `routes.tsx` (wrap in `ProtectedRoute` if auth required).
- **Adding an API service method:** Add to `services/api.ts` or create a new service file in `services/`. Import and use the shared `api` Axios instance.
- **Changing auth behavior:** Update `AuthProvider.tsx` and `auth.context.ts`. Ensure `ProtectedRoute` logic stays consistent.
- **Adding shadcn/ui components:** Use `npx shadcn@latest add <component>` — config is in `components.json`.
- **Updating transaction categories:** Edit `constants/transactions.ts` and keep in sync with `backend/src/types/index.ts`.
- **Form validation:** Uses Zod schemas with `react-hook-form` + `@hookform/resolvers/zod`. See `TransactionForm.tsx` for the pattern.

## Known Issues & UI Stubs

- **Non-functional buttons:** Export button in `TransactionFilters`, "More Filters" button, edit/delete buttons in `TransactionTable`, Profile/Settings in `UserNav`, social login buttons (Google, Bank Account) — all present in UI but have no `onClick` handlers.
- **Client-side pagination:** `transactionService.getAll` computes `meta.total` from `data.length` locally — the backend returns all matching records and pagination is computed on the frontend. `meta.page` and `meta.limit` default to `1` and `10` but are not driven by server-side pagination metadata.
- **Hardcoded notification count:** `TopNav` passes `count={3}` to `NotificationBell`.
- **No shared app shell:** Each page independently renders `TopNav` and `SideNav` — `RootLayout` is minimal (just `<Outlet>` + `<Toaster>`). This leads to layout duplication across authenticated pages.
- **No 404 route:** `routes.tsx` has no catch-all route for unknown paths.
- **Documentation drift:** `frontend/README.md` references Jest (actually Vitest), lists styling as "To be defined" (Tailwind is configured), and the project structure doesn't match the actual file layout.
