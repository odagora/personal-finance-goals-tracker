import request from 'supertest';
import app from '../../server';
import { PrismaClient } from '@prisma/client';
import { TransactionType } from '../../types';

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
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (prisma.transaction.create as jest.Mock).mockResolvedValue({
      ...mockTransaction,
      amount: { toNumber: () => mockTransaction.amount },
    });

    const response = await request(app).post('/api/v1/transactions').send({
      type: TransactionType.INCOME,
      category: 'Salary',
      amount: 1000,
      date: new Date().toISOString(),
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockTransaction);
  });

  it('should list transactions', async () => {
    const mockTransactions = [
      {
        id: '1',
        type: TransactionType.INCOME,
        category: 'Salary',
        amount: { toNumber: () => 1000 },
        date: new Date().toISOString(),
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

    const response = await request(app).get('/api/v1/transactions');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        ...mockTransactions[0],
        amount: 1000,
      },
    ]);
  });
});
