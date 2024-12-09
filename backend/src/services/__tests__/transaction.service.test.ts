import TransactionService from '../transaction.service';
import { PrismaClient } from '@prisma/client';
import { TransactionType, TransactionCategory, TRANSACTION_CATEGORIES } from '../../types';
import { ValidationError } from '../../utils/error.util';

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
const TEST_USER_ID = 'test-user-id';

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
      userId: TEST_USER_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.transaction.create as jest.Mock).mockResolvedValue({
      ...mockTransaction,
      amount: { toNumber: () => mockTransaction.amount },
    });

    const result = await TransactionService.createTransaction(
      {
        type: TransactionType.INCOME,
        category: 'Salary',
        amount: 1000,
        date: new Date(),
      },
      TEST_USER_ID
    );

    expect(result).toEqual(mockTransaction);
    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: {
        type: TransactionType.INCOME,
        category: 'Salary',
        amount: 1000,
        date: expect.any(Date),
        userId: TEST_USER_ID,
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
        userId: TEST_USER_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

    const result = await TransactionService.listTransactions({}, TEST_USER_ID);

    expect(result).toEqual([
      {
        ...mockTransactions[0],
        amount: 1000,
      },
    ]);
    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: {
        userId: TEST_USER_ID,
        type: undefined,
        category: undefined,
        date: {
          gte: undefined,
          lte: undefined,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  });

  it('should list transactions in descending order by date', async () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-02');

    const mockTransactions = [
      {
        id: '2',
        type: TransactionType.INCOME,
        category: 'Salary',
        amount: { toNumber: () => 2000 },
        date: date2, // More recent date
        userId: TEST_USER_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '1',
        type: TransactionType.INCOME,
        category: 'Salary',
        amount: { toNumber: () => 1000 },
        date: date1, // Older date
        userId: TEST_USER_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

    const result = await TransactionService.listTransactions({}, TEST_USER_ID);

    expect(result[0].date).toEqual(date2); // More recent date should be first
    expect(result[1].date).toEqual(date1); // Older date should be second
    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: {
        userId: TEST_USER_ID,
        type: undefined,
        category: undefined,
        date: {
          gte: undefined,
          lte: undefined,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  });

  describe('category validation', () => {
    it('should create a transaction with valid category', async () => {
      const validCategory = TRANSACTION_CATEGORIES[TransactionType.INCOME][0];
      const mockTransaction = {
        id: '1',
        type: TransactionType.INCOME,
        category: validCategory,
        amount: 1000,
        date: new Date(),
        userId: TEST_USER_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.transaction.create as jest.Mock).mockResolvedValue({
        ...mockTransaction,
        amount: { toNumber: () => mockTransaction.amount },
      });

      const result = await TransactionService.createTransaction(
        {
          type: TransactionType.INCOME,
          category: validCategory,
          amount: 1000,
          date: new Date(),
        },
        TEST_USER_ID
      );

      expect(result).toEqual(mockTransaction);
    });

    it('should throw error for invalid category', async () => {
      const invalidCategory = 'Invalid Category' as TransactionCategory;

      await expect(
        TransactionService.createTransaction(
          {
            type: TransactionType.INCOME,
            category: invalidCategory,
            amount: 1000,
            date: new Date(),
          },
          TEST_USER_ID
        )
      ).rejects.toThrow(ValidationError);
    });

    it('should throw error when using expense category for income', async () => {
      const expenseCategory = TRANSACTION_CATEGORIES[TransactionType.EXPENSE][0];

      await expect(
        TransactionService.createTransaction(
          {
            type: TransactionType.INCOME,
            category: expenseCategory,
            amount: 1000,
            date: new Date(),
          },
          TEST_USER_ID
        )
      ).rejects.toThrow(ValidationError);
    });
  });
});
