import { PrismaClient } from '@prisma/client';
import { CreateTransactionDTO, TransactionFilters, Transaction, TransactionType } from '../types';
import { ValidationError } from '../utils/error.util';

const prisma = new PrismaClient();

class TransactionService {
  // Method to create a new transaction
  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    // Validate business logic if needed
    if (data.amount <= 0) {
      throw new ValidationError('Amount must be greater than zero');
    }

    // Create transaction using Prisma
    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        userId: 'some-user-id', // Replace with actual user ID from context
      },
    });

    // Map the result to match the Transaction interface
    return {
      ...transaction,
      type: transaction.type as TransactionType,
      amount: transaction.amount.toNumber(),
    };
  }

  // Method to list transactions with optional filters
  async listTransactions(filters: TransactionFilters): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
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
      amount: transaction.amount.toNumber(),
    }));
  }
}

export default new TransactionService();
