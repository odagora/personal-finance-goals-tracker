import { Router } from 'express';
import TransactionController from '../controllers/transaction.controller';
import {
  validateTransaction,
  validateTransactionFilters,
  validateCategorySuggestion,
} from '../middlewares/validation.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Apply authentication middleware to all transaction routes
router.use(authenticateToken);

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
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Transactions
 *     summary: Create a new transaction
 *     description: Create a new transaction with the specified type and category. Requires authentication.
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
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Transactions
 *     summary: List transactions with optional filters
 *     description: Retrieve a list of transactions with optional filtering. Requires authentication.
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

/**
 * @openapi
 * /api/v1/transactions/categories:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Transactions
 *     summary: Get unique categories from user transactions
 *     description: Retrieve a list of unique categories from user's transactions. Requires authentication.
 *     responses:
 *       200:
 *         description: List of unique categories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriesList'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/categories', TransactionController.getCategories);

/**
 * @openapi
 * /api/v1/transactions/suggest-category:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Transactions
 *     summary: Suggest a category from a free-text transaction description
 *     description: Uses TypeSafe AI to judge which of the type's valid categories best matches the description. Requires authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - description
 *             properties:
 *               type:
 *                 $ref: '#/components/schemas/TransactionType'
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Suggested category and confidence (category is null when no confident match was found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                   nullable: true
 *                 confidence:
 *                   type: number
 */
router.post('/suggest-category', validateCategorySuggestion, TransactionController.suggestCategory);

export default router;
