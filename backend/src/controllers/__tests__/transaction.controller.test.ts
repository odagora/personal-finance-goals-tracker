import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { TransactionType } from '../../types';
import jwt from 'jsonwebtoken';
import config from '../../config';

// Import app, not server
import app from '../../app';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

// Test constants
const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
};

const getAuthToken = () => {
  return jwt.sign({ userId: TEST_USER.id, email: TEST_USER.email }, config.jwt.secret, {
    expiresIn: '1h',
  });
};

describe('TransactionController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a transaction', async () => {
    const mockTransaction = {
      id: '1',
      type: TransactionType.INCOME,
      category: 'Salary',
      amount: 1000,
      date: new Date().toISOString(),
      userId: TEST_USER.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (prisma.transaction.create as jest.Mock).mockResolvedValue({
      ...mockTransaction,
      amount: { toNumber: () => mockTransaction.amount },
    });

    const response = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${getAuthToken()}`)
      .send({
        type: TransactionType.INCOME,
        category: 'Salary',
        amount: 1000,
        date: new Date().toISOString(),
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockTransaction);
  });

  it('should return 401 when creating transaction without auth token', async () => {
    const response = await request(app).post('/api/v1/transactions').send({
      type: TransactionType.INCOME,
      category: 'Salary',
      amount: 1000,
      date: new Date().toISOString(),
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'No token provided');
  });

  it('should list transactions', async () => {
    const mockTransactions = [
      {
        id: '1',
        type: TransactionType.INCOME,
        category: 'Salary',
        amount: { toNumber: () => 1000 },
        date: new Date().toISOString(),
        userId: TEST_USER.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

    const response = await request(app)
      .get('/api/v1/transactions')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        ...mockTransactions[0],
        amount: 1000,
      },
    ]);
  });

  it('should return 401 when listing transactions without auth token', async () => {
    const response = await request(app).get('/api/v1/transactions');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'No token provided');
  });
});
