import { Request, Response, NextFunction } from 'express';
import TransactionService from '../services/transaction.service';
import { CreateTransactionDTO, TransactionFilters } from '../types';

class TransactionController {
  // Handler for creating a transaction
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionData: CreateTransactionDTO = req.body;
      const transaction = await TransactionService.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  // Handler for listing transactions
  async listTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: TransactionFilters = req.query;
      const transactions = await TransactionService.listTransactions(filters);
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();
