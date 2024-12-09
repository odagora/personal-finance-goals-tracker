import { PrismaClient } from '@prisma/client';
import {
  CreateTransactionDTO,
  TransactionFilters,
  Transaction,
  TransactionType,
  TRANSACTION_CATEGORIES,
  TransactionCategory,
} from '../types';
import { ValidationError } from '../utils/error.util';

const prisma = new PrismaClient();

class TransactionService {
  private validateCategory(type: TransactionType, category: TransactionCategory): void {
    const validCategories = TRANSACTION_CATEGORIES[type];
    const validCategorySet = new Set(validCategories);
    if (!validCategorySet.has(category)) {
      throw new ValidationError(
        `Invalid category for ${type}. Valid categories are: ${validCategories.join(', ')}`
      );
    }
  }

  // Method to create a new transaction
  async createTransaction(data: CreateTransactionDTO, userId: string): Promise<Transaction> {
    // Validate amount
    if (data.amount <= 0) {
      throw new ValidationError('Amount must be greater than zero');
    }

    // Validate category
    this.validateCategory(data.type, data.category);

    // Create transaction using Prisma
    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        userId,
      },
    });

    // Map the result to match the Transaction interface
    return {
      ...transaction,
      type: transaction.type as TransactionType,
      category: transaction.category as TransactionCategory,
      amount: transaction.amount.toNumber(),
    };
  }

  // Method to list transactions with optional filters
  async listTransactions(filters: TransactionFilters, userId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: filters.type,
        category: filters.category,
        date: {
          gte: filters.startDate,
          lte: filters.endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Map each transaction to match the Transaction interface
    return transactions.map((transaction) => ({
      ...transaction,
      type: transaction.type as TransactionType,
      category: transaction.category as TransactionCategory,
      amount: transaction.amount.toNumber(),
    }));
  }
}

export default new TransactionService();
