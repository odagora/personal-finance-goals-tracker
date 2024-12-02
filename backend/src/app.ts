import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.config';
import config from './config';
import errorMiddleware from './middlewares/error.middleware';
import transactionRoutes from './routes/transaction.routes';

const app: Express = express();

// Middlewares
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
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
app.use(`${config.api.prefix}/transactions`, transactionRoutes);

// Error handling
app.use(errorMiddleware);

export default app;
