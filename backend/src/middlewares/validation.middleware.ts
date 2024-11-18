import { Request, Response, NextFunction } from 'express';
import { body, query, ValidationChain, validationResult } from 'express-validator';
import { TransactionType } from '../types';
import { createValidationError } from '../utils/error.util';

// Validation chains for transaction creation
export const createTransactionValidation: ValidationChain[] = [
  // Validate transaction type
  body('type')
    .isIn(Object.values(TransactionType))
    .withMessage('Transaction type must be either income or expense'),

  // Validate amount (positive number with up to 2 decimal places)
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number')
    .custom((value) => {
      const decimals = value.toString().split('.')[1]?.length || 0;
      if (decimals > 2) {
        throw new Error('Amount cannot have more than 2 decimal places');
      }
      return true;
    }),

  // Validate category (non-empty string, max length 50)
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),

  // Validate date (ISO string)
  body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date string'),
];

// Validation chains for transaction listing
export const listTransactionsValidation: ValidationChain[] = [
  // Optional type filter
  query('type')
    .optional()
    .isIn(Object.values(TransactionType))
    .withMessage('Invalid transaction type filter'),

  // Optional category filter
  query('category')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category filter cannot exceed 50 characters'),

  // Optional date range filters
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date string'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date string'),
];

// Middleware to handle validation results
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    next(createValidationError(errorMessages));
    return;
  }

  next();
};
