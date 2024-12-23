# Personal Finance Goals Tracker

A full-stack application for tracking personal financial goals and transactions.

## Project Overview
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL with Prisma ORM
- Containerization: Docker & Docker Compose

## Prerequisites

### Required Software
- Node.js 20.x or higher
- PostgreSQL 16 (for local development without Docker)
- Docker and Docker Compose V2 (for containerized development)
- PGAdmin (optional, for database management)

## Development Setup

### Using Docker (Recommended)

1. **Clone and Setup Environment**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd personal-finance-goals-tracker

   # Copy environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Start Services**
   ```bash
   docker compose up -d
   ```

3. **Access Applications**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs

### Local Development (Without Docker)

1. **Backend Setup**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Setup database
   createdb finance_tracker  # If using PostgreSQL CLI
   npx prisma generate
   npx prisma migrate dev

   # Start backend server
   npm run dev  # Starts on http://localhost:3000
   ```

2. **Frontend Setup**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Start frontend development server
   npm run dev  # Starts on http://localhost:5173
   ```

## Available Scripts

### Backend
- `npm run dev`: Start development server with hot-reload
- `npm run build`: Compile TypeScript for production
- `npm start`: Run production server
- `npm test`: Run test suite
- `npm run lint`: Check code style
- `npm run format`: Format code

### Frontend
- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm test`: Run test suite
- `npm run lint`: Check code style
- `npm run format`: Format code

## Docker Commands

### Basic Operations
```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f [service_name]

# Rebuild containers
docker compose build --no-cache
```

### Service-specific Commands
```bash
# Restart specific service
docker compose restart [frontend|app|db]

# Execute commands in containers
docker compose exec frontend npm test
docker compose exec app npm test
docker compose exec db psql -U postgres -d finance_tracker
```

## Testing

### Frontend Tests
```bash
# Local development
cd frontend && npm test

# Using Docker
docker compose exec frontend npm test

# Run with coverage
docker compose exec frontend npm test -- --coverage

# Run in watch mode
docker compose exec frontend npm test -- --watch
```

### Backend Tests
```bash
# Local development
cd backend && npm test

# Using Docker
docker compose exec app npm test

# Run specific tests
docker compose exec app npm test -- path/to/test.ts

# Run with coverage
docker compose exec app npm test -- --coverage
```

### Test Structure
```
frontend/
└── src/
    └── __tests__/         # Test files
        ├── components/    # Component tests
        ├── pages/        # Page tests
        └── services/     # Service tests

backend/
└── src/
    └── __tests__/         # Test files
        ├── controllers/   # Controller tests
        ├── services/     # Service tests
        └── middlewares/  # Middleware tests
```

## Project Structure
```
.
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── Dockerfile         # Frontend container configuration
│
├── backend/                # Node.js backend application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   └── types/         # TypeScript types
│   └── Dockerfile         # Backend container configuration
│
└── docker-compose.yml      # Docker composition
```

## Environment Configuration

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1
NODE_ENV=development
FRONTEND_PORT=5173
```

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/finance_tracker"
JWT_SECRET="your-secret-key"
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

## Database Management

The PostgreSQL database can be managed using PGAdmin:
- Host: localhost
- Port: 5432
- Database: finance_tracker
- User: postgres
- Password: postgres

## API Documentation

The API documentation is available through Swagger UI when running the backend:
- Development: http://localhost:3000/api-docs
- Production: http://localhost:3000/api-docs

## Troubleshooting

### Docker Issues
1. **Port Conflicts**
   - Ensure ports 3000, 5173, and 5432 are available
   - Check for running services using: `lsof -i :<port>`

2. **Database Connection**
   - Verify PostgreSQL container is running: `docker compose ps`
   - Check logs: `docker compose logs db`
   - Verify connection settings in PGAdmin

### Local Development Issues
1. **Frontend Development**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Verify environment variables in .env file
   - Check Vite configuration

2. **Backend Development**
   - Verify PostgreSQL service is running
   - Check DATABASE_URL in .env
   - Run `npx prisma generate` after schema changes

## Contributing

[Add contribution guidelines here]

## License

[Add license information here]