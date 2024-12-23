import { Response, NextFunction } from 'express';
import TransactionService from '../services/transaction.service';
import { CreateTransactionDTO, TransactionFilters } from '../types';
import { AuthenticatedRequest } from '../types/auth.types';

class TransactionController {
  // Handler for creating a transaction
  async createTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const transactionData: CreateTransactionDTO = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const transaction = await TransactionService.createTransaction(transactionData, userId);
      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  // Handler for listing transactions
  async listTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const filters: TransactionFilters = req.query;
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const transactions = await TransactionService.listTransactions(filters, userId);
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const categories = await TransactionService.getCategories(userId);
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();
