export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

// Add predefined categories
export const TRANSACTION_CATEGORIES = {
  [TransactionType.INCOME]: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other Income'],
  [TransactionType.EXPENSE]: [
    'Food',
    'Transportation',
    'Housing',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Education',
    'Other Expenses',
  ],
} as const;

// Type for categories
export type TransactionCategory =
  | (typeof TRANSACTION_CATEGORIES)[TransactionType.INCOME][number]
  | (typeof TRANSACTION_CATEGORIES)[TransactionType.EXPENSE][number];

export interface Transaction extends CreateTransactionDTO {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: Date;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory;
  startDate?: Date;
  endDate?: Date;
}
