import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.config';
import config from './config';
import errorMiddleware from './middlewares/error.middleware';
import transactionRoutes from './routes/transaction.routes';
import authRoutes from './routes/auth.routes';

const app: Express = express();

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = config.cors.origin;
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`Origin ${origin} not allowed by CORS`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use(`${config.api.prefix}/auth`, authRoutes);
app.use(`${config.api.prefix}/transactions`, transactionRoutes);

// Error handling
app.use(errorMiddleware);

export default app;
