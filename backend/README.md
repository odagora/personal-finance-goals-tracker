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

# Deployment Guide

## Railway Deployment Configuration

### Environment Variables
Required variables in Railway dashboard:
```bash
# Custom Dockerfile Path
RAILWAY_DOCKERFILE_PATH=/backend/Dockerfile.prod

# Database URL (using Public Networking)
DATABASE_URL=postgres://<user>:<pass>@<host>.railway.app:5432/<db>

# Application Config
PORT=8080
NODE_ENV=production
JWT_SECRET=your-secret
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Build Configuration
The application builds using a production Dockerfile (`Dockerfile.prod`) which:
1. Installs dependencies
2. Runs database migrations during build
3. Builds the TypeScript application

Key points:
- Custom start command: `npm run start`
- Uses `Dockerfile.prod` instead of default `Dockerfile`
- Runs Prisma migrations at build time
- Requires DATABASE_URL as build argument

### Important Files

1. **Dockerfile.prod**:
```dockerfile
# Set DATABASE_URL arg and env for build-time migrations
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma Client and run migrations
RUN npx prisma generate
RUN npx prisma migrate deploy
```

2. **GitHub Workflow**:
```yaml
- name: Deploy to Railway
  run: railway up --build-arg DATABASE_URL=${{ secrets.DATABASE_URL }}
  env:
    RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Troubleshooting

1. **Database Connectivity**
   - Use Public Networking URL format from Railway
   - Ensure DATABASE_URL is properly set in both build args and environment

2. **Build Issues**
   - Check if RAILWAY_DOCKERFILE_PATH is correct
   - Verify Dockerfile.prod path is relative to project root
   - Ensure all required build arguments are passed

3. **Runtime Issues**
   - Verify start command matches package.json scripts
   - Check logs for migration errors
   - Ensure environment variables are properly set

## References

- [Railway Dockerfile Guide](https://docs.railway.com/guides/dockerfiles)
- [Custom Dockerfile Path](https://docs.railway.com/guides/dockerfiles#custom-dockerfile-path)
- [Build-time Variables](https://docs.railway.com/guides/dockerfiles#using-variables-at-build-time)