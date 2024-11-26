import TransactionService from '../transaction.service';
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

describe('TransactionService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a transaction', async () => {
    const mockTransaction = {
      id: '1',
      type: TransactionType.INCOME,
      category: 'Salary',
      amount: 1000,
      date: new Date(),
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.transaction.create as jest.Mock).mockResolvedValue({
      ...mockTransaction,
      amount: { toNumber: () => mockTransaction.amount },
    });

    const result = await TransactionService.createTransaction({
      type: TransactionType.INCOME,
      category: 'Salary',
      amount: 1000,
      date: new Date(),
    });

    expect(result).toEqual(mockTransaction);
    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: {
        type: TransactionType.INCOME,
        category: 'Salary',
        amount: 1000,
        date: expect.any(Date),
        userId: 'some-user-id',
      },
    });
  });

  it('should list transactions', async () => {
    const mockTransactions = [
      {
        id: '1',
        type: TransactionType.INCOME,
        category: 'Salary',
        amount: { toNumber: () => 1000 },
        date: new Date(),
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

    const result = await TransactionService.listTransactions({});

    expect(result).toEqual([
      {
        ...mockTransactions[0],
        amount: 1000,
      },
    ]);
    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: {
        type: undefined,
        category: undefined,
        date: {
          gte: undefined,
          lte: undefined,
        },
      },
    });
  });
});
