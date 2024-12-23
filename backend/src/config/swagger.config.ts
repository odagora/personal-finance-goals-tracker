import swaggerJsdoc from 'swagger-jsdoc';
import { TransactionType, TRANSACTION_CATEGORIES } from '../types';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Finance API',
      version: '1.0.0',
      description: 'API documentation for Personal Finance application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        TransactionType: {
          type: 'string',
          enum: Object.values(TransactionType),
          description: 'Type of transaction (INCOME or EXPENSE)',
        },
        TransactionCategories: {
          type: 'object',
          properties: {
            INCOME: {
              type: 'array',
              items: {
                type: 'string',
                enum: TRANSACTION_CATEGORIES[TransactionType.INCOME],
              },
              description: 'Categories available for income transactions',
            },
            EXPENSE: {
              type: 'array',
              items: {
                type: 'string',
                enum: TRANSACTION_CATEGORIES[TransactionType.EXPENSE],
              },
              description: 'Categories available for expense transactions',
            },
          },
        },
        CategoriesList: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of unique categories from user transactions',
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: {
              $ref: '#/components/schemas/TransactionType',
            },
            category: {
              type: 'string',
              description:
                'Predefined category for the transaction. Must match the type-specific categories.',
              example: 'Salary',
            },
            amount: { type: 'number', minimum: 0 },
            date: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['type', 'category', 'amount', 'date'],
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const specs = swaggerJsdoc(options);
