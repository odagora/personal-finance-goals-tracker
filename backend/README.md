# Personal Finance Goals Tracker

## Project Overview
A full-stack application for tracking personal financial goals and transactions.

## Prerequisites

### Required Software
- Node.js 20.x or higher
- PostgreSQL 16
- Docker and Docker Compose V2 (for containerized development)

### PostgreSQL Setup (Local Development)
1. **Install PostgreSQL**
   - **Ubuntu/Debian**:
     ```bash
     # Update package list and install PostgreSQL with additional features
     sudo apt update
     sudo apt install postgresql postgresql-contrib
     ```
   - **macOS** (using Homebrew):
     ```bash
     # Install and start PostgreSQL service
     brew install postgresql@16
     brew services start postgresql@16
     ```
   - **Windows**: Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

2. **Verify Installation**
   ```bash
   # Check PostgreSQL version
   psql --version

   # For Linux: Check service status
   systemctl status postgresql

   # For macOS: Check service status
   brew services list
   ```

3. **Configure PostgreSQL**
   ```bash
   # Access PostgreSQL command prompt as postgres user
   sudo -u postgres psql

   # Create new user with password
   CREATE USER your_user WITH PASSWORD 'your_password';

   # Create database
   CREATE DATABASE finance_tracker;

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE finance_tracker TO your_user;

   # Exit PostgreSQL prompt
   \q
   ```

### Node.js Setup
1. **Install Node.js 20.x**
   - Using nvm (recommended):
     ```bash
     # Install and use Node.js 20
     nvm install 20
     nvm use 20
     ```
   - Or download from [Node.js Official Website](https://nodejs.org/)

2. **Verify Installation**
   ```bash
   # Check Node.js and npm versions
   node --version
   npm --version
   ```

### Docker Setup
1. **Install Docker**
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS)
   - [Docker Engine](https://docs.docker.com/engine/install/) (Linux)

2. **Docker Compose V2**
   - Docker Compose V2 is included with Docker Desktop
   - For Linux systems:
     ```bash
     # Install Docker Compose V2
     sudo apt-get update
     sudo apt-get install docker-compose-plugin
     ```

3. **Verify Installation**
   ```bash
   # Check Docker and Docker Compose versions
   docker --version
   docker compose version  # Note: Using 'docker compose' instead of 'docker-compose'
   ```

## Development Setup

### Local Development
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Database setup**
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

4. **Start development server**
   ```bash
   npm run dev  # Starts server on http://localhost:3000
   ```

### Docker Development
1. **Start services**
   ```bash
   # Build and start containers in detached mode
   docker compose up -d

   # View logs
   docker compose logs -f
   ```

2. **Database operations**
   ```bash
   # Run migrations
   docker compose exec app npx prisma migrate dev

   # Seed the database
   docker compose exec app npx prisma db seed

   # Run specific seeds (optional)
   docker compose exec app npx ts-node prisma/seeds/create-user.ts
   docker compose exec app npx ts-node prisma/seeds/create-transactions.ts

   # Access database CLI
   docker compose exec db psql -U postgres -d finance_tracker
   ```

3. **Useful Docker commands**
   ```bash
   # Stop services
   docker compose down

   # Rebuild containers
   docker compose build --no-cache

   # Access container shell
   docker compose exec app bash

   # Restart specific service
   docker compose restart app
   ```

## Available Scripts
- `npm run dev`: Start development server with hot-reload
- `npm run build`: Compile TypeScript for production
- `npm start`: Run production server
- `npm test`: Run test suite with Jest
  - Local: `npm test`
  - Docker: `docker compose exec app npm test`
  - Watch mode:
    - Local: `npm test -- --watch`
    - Docker: `docker compose exec -it app npm test -- --watchAll`
  - Coverage: `npm test -- --coverage`
  - Specific file: `docker compose exec app npm test path/to/test.ts`
  - Pattern match: `docker compose exec app npm test -- -t "pattern"`
  - Directory: `docker compose exec app npm test path/to/directory/`
- `npm run lint`: Check code style
- `npm run format`: Format code

## API Documentation
Current endpoints:
- `GET /health`: Health check endpoint
- `POST /api/v1/transactions`: Create a new transaction
- `GET /api/v1/transactions`: List transactions with optional filters

### OpenAPI/Swagger Documentation
The API is documented using OpenAPI/Swagger specification. You can access the interactive documentation at:
- Local development: http://localhost:3000/api-docs

The Swagger UI provides:
- Detailed endpoint descriptions
- Request/response schemas
- Available transaction types and categories
- Interactive API testing interface

### Available Transaction Types
- INCOME
- EXPENSE

Each type has its predefined categories which can be found in the Swagger documentation under the `TransactionCategories` schema.

## Troubleshooting Guide
1. **Database Connection Issues**
   - Verify PostgreSQL service is running
   - Check DATABASE_URL in .env file
   - Ensure database user has correct permissions

2. **Docker Issues**
   - Ensure no services are using ports 3000 and 5432
   - Check container logs for errors
   - Verify Docker Compose configuration

3. **Prisma Issues**
   - Run `npx prisma generate` after schema changes
   - Use `npx prisma migrate reset` for clean database
   - Check migration status with `npx prisma migrate status`

## Notes on Docker Compose V2
- Using `docker compose` instead of `docker-compose`
- Improved performance and resource usage
- Better error handling and debugging
- Compose Spec compliance
- Enhanced CLI features

For more details on Docker Compose V2, visit the [official migration guide](https://docs.docker.com/compose/migrate/).