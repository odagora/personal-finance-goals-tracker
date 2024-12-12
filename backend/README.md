# Personal Finance Goals Tracker - Backend

Node.js + Express + TypeScript backend for the Personal Finance Goals Tracker application.

> **Note**: For full-stack setup instructions, please refer to the [main README](../README.md) in the root directory.

## Technology Stack

- **Runtime**: Node.js 20
- **Framework**: Express
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI
- **Authentication**: JWT

## Development

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 16
- npm 10.x or higher

### Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create database
   createdb finance_tracker

   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev
   ```
3. **Seed the database**
   ```bash
   # Run all seeds
   npx prisma db seed

   # Run specific seeds (optional)
   npx ts-node prisma/seeds/create-user.ts
   npx ts-node prisma/seeds/create-transactions.ts
   ```

4. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env

   # Configure environment variables
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance_tracker"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Access the API at http://localhost:3000

### Available Scripts

- `npm run dev`: Start development server with hot-reload
- `npm run build`: Compile TypeScript for production
- `npm start`: Run production server
- `npm test`: Run test suite
- `npm run lint`: Check code style
- `npm run format`: Format code

## Project Structure

```
src/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middlewares/        # Express middlewares
├── routes/            # API routes
├── services/          # Business logic
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── app.ts            # Express app setup
└── server.ts         # Server entry point
```

## API Documentation

The API documentation is available through Swagger UI:
- Local: http://localhost:3000/api-docs
- Development: http://localhost:3000/api-docs

### Available Endpoints

- `GET /health`: Health check endpoint
- `POST /api/v1/auth/register`: Register new user
- `POST /api/v1/auth/login`: User login
- `POST /api/v1/transactions`: Create transaction
- `GET /api/v1/transactions`: List transactions

## Database Management

### Prisma Commands
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Database Schema
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Transaction {
  id        String   @id @default(uuid())
  type      String   @db.VarChar(10)
  category  String   @db.VarChar(50)
  amount    Decimal  @db.Decimal(10, 2)
  date      DateTime
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
```
src/
└── __tests__/         # Test files
    ├── controllers/   # Controller tests
    ├── services/     # Service tests
    └── middlewares/  # Middleware tests
```

## Docker Support

This project can be run in a Docker container. For Docker-based development:

1. **Build and Start Container**
   ```bash
   docker compose up app
   ```

2. **Run Commands in Container**
   ```bash
   # Run migrations
   docker compose exec app npx prisma migrate dev

   # Run tests
   docker compose exec app npm test
   # Seed the database
   docker compose exec app npx prisma db seed

   # Run specific seeds (optional)
   docker compose exec app npx ts-node prisma/seeds/create-user.ts
   docker compose exec app npx ts-node prisma/seeds/create-transactions.ts

   # Access database CLI
   docker compose exec db psql -U postgres -d finance_tracker
   ```

For full Docker setup including frontend services, refer to the [main README](../README.md).

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | Yes | - |
| `JWT_SECRET` | Secret for JWT signing | Yes | - |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |
| `CORS_ORIGIN` | Allowed CORS origin | No | http://localhost:5173 |

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify PostgreSQL service is running
   - Check DATABASE_URL in .env file
   - Ensure database exists
   ```bash
   # Check PostgreSQL status
   systemctl status postgresql
   # or
   brew services list
   ```

2. **Prisma Issues**
   - Run `npx prisma generate` after schema changes
   - Use `npx prisma migrate reset` for clean database
   - Check migration status with `npx prisma migrate status`

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate request headers

## Contributing

Please refer to the [main README](../README.md) for contribution guidelines.