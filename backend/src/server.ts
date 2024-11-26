import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
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

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Transaction routes
app.use(`${config.api.prefix}/transactions`, transactionRoutes);

// Error handling
app.use(errorMiddleware);

// Server initialization
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
}

export default app;
