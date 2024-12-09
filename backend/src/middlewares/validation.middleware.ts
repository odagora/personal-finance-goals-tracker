import { body, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { TransactionType, TRANSACTION_CATEGORIES } from '../types';
import { ValidationError } from '../utils/error.util';

// Helper function to validate results
const validateResults = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Helper function to validate category
const isValidCategory = (category: string, type: TransactionType): boolean => {
  const validCategories = TRANSACTION_CATEGORIES[type] as readonly string[];
  return validCategories.includes(category);
};

// Transaction creation validation chain
export const validateTransaction = [
  body('type').isIn(Object.values(TransactionType)).withMessage('Invalid transaction type'),

  body('category').custom((value: string, { req }) => {
    const type = req.body.type as TransactionType;
    if (!isValidCategory(value, type)) {
      throw new Error(`Invalid category for ${type}`);
    }
    return true;
  }),

  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),

  body('date').isISO8601().withMessage('Invalid date format'),

  validateResults,
];

// Transaction listing validation chain
export const validateTransactionFilters = [
  query('type')
    .optional()
    .isIn(Object.values(TransactionType))
    .withMessage('Invalid transaction type'),

  query('category')
    .optional()
    .custom((value: string, { req }) => {
      const queryType = req.query?.type;
      const type = queryType as TransactionType;

      if (type && value) {
        if (!isValidCategory(value, type)) {
          throw new Error(`Invalid category for ${type}`);
        }
      }
      return true;
    }),

  query('startDate').optional().isISO8601().withMessage('Invalid start date format'),

  query('endDate').optional().isISO8601().withMessage('Invalid end date format'),

  validateResults,
];

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(
      errors
        .array()
        .map((err) => err.msg)
        .join(', ')
    );
  }
  next();
};
