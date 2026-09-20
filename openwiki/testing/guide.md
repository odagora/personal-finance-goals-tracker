# Testing Guide

## Backend Testing

### Framework: Jest + Supertest

**Config:** `backend/jest.config.js`
- Preset: `ts-jest`
- Environment: `node`
- Test match: `**/__tests__/**/*.ts`, `**/?(*.)+(spec|test).ts`
- Root: `src/`
- Module alias: `^@/(.*)$` → `<rootDir>/src/$1`
- Coverage: collected automatically, excludes `*.d.ts` and `server.ts`

### Test Files

| Test | Location | What it covers |
|------|----------|---------------|
| `auth.middleware.test.ts` | `src/middlewares/__tests__/` | Token extraction, verification, missing/invalid token errors |
| `transaction.controller.test.ts` | `src/controllers/__tests__/` | Create + list transactions, 401 without auth |
| `transaction.service.test.ts` | `src/services/__tests__/` | Service logic: create, list, category validation |
| `user.service.test.ts` | `src/services/__tests__/` | Registration, login, password hashing/verification |

### Patterns

**Mocking Prisma Client:**
```typescript
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    transaction: { create: jest.fn(), findMany: jest.fn() },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});
```
Prisma is mocked in both controller and service tests. Mock return values include `amount: { toNumber: () => 1000 }` to simulate Prisma's `Decimal` type.

**Generating auth tokens for tests:**
```typescript
const getAuthToken = () => jwt.sign(
  { userId: TEST_USER.id, email: TEST_USER.email },
  config.jwt.secret,
  { expiresIn: '1h' }
);
```

**Testing via Supertest:**
Tests import `app` directly (not `server.ts`) to avoid binding a port. `server.ts` skips `app.listen` when `NODE_ENV === 'test'`.
```typescript
const response = await request(app)
  .post('/api/v1/transactions')
  .set('Authorization', `Bearer ${getAuthToken()}`)
  .send({ ... });
```

**Jest config:** `silent: true` suppresses console output during test runs.

### Running Backend Tests

```bash
cd backend
npm test                    # run all tests
npm test -- --watch         # watch mode
npm test -- --coverage      # with coverage
npm test -- path/to/test.ts # specific test file
```

## Frontend Testing

### Framework: Vitest + React Testing Library

**Config:** `frontend/vitest.config.ts`
- Merges with Vite config
- Environment: `jsdom`
- Setup: `src/test/setup.ts` (imports `@testing-library/jest-dom/vitest`, mocks `window.matchMedia`)
- Globals: enabled (`describe`, `it`, `expect` available without imports)
- Coverage: v8 provider, excludes `node_modules/`, `src/test/`, `*.d.ts`, config files, `main.tsx`

### Test Files

| Test | Location | What it covers |
|------|----------|---------------|
| `Login.test.tsx` | `src/pages/Auth/__tests__/` | Form rendering, validation errors, successful login, login error handling |
| `Register.test.tsx` | `src/pages/Auth/__tests__/` | Registration form rendering and submission |
| `AuthHeader.test.tsx` | `src/components/auth/__tests__/` | Auth header component |
| `PageHeader.test.tsx` | `src/components/common/PageHeader/__tests__/` | Page header component |
| `api.test.ts` | `src/services/__tests__/` | Axios instance configuration, base URL, default headers |
| `text.test.ts` | `src/utils/__tests__/` | Text utility functions |

### Patterns

**Mocking AuthContext:**
Tests wrap components in a custom provider with mocked context:
```typescript
const mockAuthContext = {
  login: vi.fn(),
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  register: vi.fn(),
  logout: vi.fn(),
};

const renderWithProviders = (ui) => render(
  <BrowserRouter>
    <AuthContext.Provider value={mockAuthContext}>{ui}</AuthContext.Provider>
  </BrowserRouter>
);
```

**Mocking react-router-dom:**
```typescript
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: vi.fn() };
});
```

**Mocking axios:**
```typescript
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      defaults: { baseURL: 'http://localhost:3000/api/v1', headers: { common: { 'Content-Type': 'application/json' } } },
      interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
      get: vi.fn().mockResolvedValue({ status: 200, data: { status: 'ok' } }),
    })),
  },
}));
```

**Test structure convention:** Tests use Arrange/Act/Assert comments and `userEvent.setup()` for interaction testing. Form validation tests check for Zod error messages in the DOM.

### Running Frontend Tests

```bash
cd frontend
npm test                      # vitest run (NODE_ENV=test)
npm run test:watch            # watch mode
npm run test:coverage         # with coverage
npm run test:ui               # vitest UI
npm run test:docker           # via Docker compose
```

## Test Environment Considerations

- **Frontend in Docker:** Uses `.env.test.docker` with `VITE_API_URL=http://app:3000/api/v1` when `DOCKER=true`.
- **Frontend local test:** Uses `.env.test` with `VITE_API_URL=http://localhost:3000/api/v1`.
- **Backend test:** `server.ts` skips `app.listen` when `NODE_ENV === 'test'` so Supertest can import the app without port conflicts.

## What to Test When Changing Code

- **Adding a new API route:** Write controller tests using the Supertest pattern (mock Prisma, generate JWT, test happy + error paths).
- **Changing validation rules:** Add test cases for valid and invalid inputs in the relevant controller/service test.
- **Adding a frontend page:** Create `__tests__/` directory next to the page, mock AuthContext and react-router-dom, test rendering and user interactions.
- **Changing transaction categories:** Update test mock data if categories are referenced in assertions.
- **Changing auth flow:** Update `Login.test.tsx` and `Register.test.tsx` if the API contract changes.
