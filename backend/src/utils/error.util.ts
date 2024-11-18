import { AppError } from '../middlewares/error.middleware';

export class ValidationError extends Error implements AppError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// Helper function to create validation error messages
export const createValidationError = (errors: string[]): ValidationError => {
  return new ValidationError(errors.join(', '));
};
