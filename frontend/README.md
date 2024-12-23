# Personal Finance Goals Tracker - Frontend

React + TypeScript frontend for the Personal Finance Goals Tracker application.

> **Note**: For full-stack setup instructions, please refer to the [main README](../README.md) in the root directory.

## Technology Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Testing**: Jest + React Testing Library
- **Styling**: [To be defined]

## Development

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env

   # Configure environment variables
   VITE_API_URL=http://localhost:3000/api/v1
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   Access the application at http://localhost:5173

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally
- `npm test`: Run test suite
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication related components
│   └── transactions/   # Transaction related components
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
├── styles/             # Global styles and themes
├── utils/              # Utility functions
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
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
    ├── components/    # Component tests
    ├── pages/        # Page tests
    └── services/     # Service tests
```

## Building for Production

1. **Create Production Build**
   ```bash
   npm run build
   ```

2. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Docker Support

This project can be run in a Docker container. For Docker-based development:

1. **Build and Start Container**
   ```bash
   docker compose up frontend
   ```

2. **Run Commands in Container**
   ```bash
   # Run tests
   docker compose exec frontend npm test

   # Run linting
   docker compose exec frontend npm run lint
   ```

For full Docker setup including backend services, refer to the [main README](../README.md).

## Code Style Guide

- Use functional components with hooks
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Follow the project's component structure pattern

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api/v1` |

## Troubleshooting

### Common Issues

1. **Module Not Found Errors**
   - Verify all dependencies are installed
   - Clear node_modules and reinstall
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Build Errors**
   - Clear Vite cache
   ```bash
   npm run clean
   ```
   - Verify TypeScript configuration
   - Check for environment variables

3. **Test Failures**
   - Update test snapshots if needed
   ```bash
   npm test -- -u
   ```
   - Check Jest configuration
   - Verify mock setup

## Contributing

Please refer to the [main README](../README.md) for contribution guidelines.
