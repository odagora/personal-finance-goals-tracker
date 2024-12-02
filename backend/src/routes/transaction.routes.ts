import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';
import {
  validateTransaction,
  validateTransactionFilters,
} from '../middlewares/validation.middleware';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     TransactionInput:
 *       type: object
 *       required:
 *         - type
 *         - category
 *         - amount
 *         - date
 *       properties:
 *         type:
 *           $ref: '#/components/schemas/TransactionType'
 *         category:
 *           type: string
 *           description: Must match the type-specific categories defined in TransactionCategories schema
 *         amount:
 *           type: number
 *           minimum: 0
 *         date:
 *           type: string
 *           format: date-time
 *
 * /api/v1/transactions:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create a new transaction
 *     description: Create a new transaction with the specified type and category. See TransactionCategories schema for available categories.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validateTransaction, TransactionController.createTransaction);

/**
 * @openapi
 * /api/v1/transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: List transactions with optional filters
 *     description: Retrieve a list of transactions with optional filtering. See TransactionCategories schema for valid categories.
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           $ref: '#/components/schemas/TransactionType'
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category. Must be valid for the specified transaction type.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get('/', validateTransactionFilters, TransactionController.listTransactions);

export default router;
