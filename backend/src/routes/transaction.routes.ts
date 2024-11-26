import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';
import {
  createTransactionValidation,
  listTransactionsValidation,
  validate,
} from '../middlewares/validation.middleware';

const router = Router();

// Route to create a transaction
router.post(
  '/',
  createTransactionValidation,
  validate,
  TransactionController.createTransaction.bind(TransactionController)
);

// Route to list transactions
router.get(
  '/',
  listTransactionsValidation,
  validate,
  TransactionController.listTransactions.bind(TransactionController)
);

export default router;
