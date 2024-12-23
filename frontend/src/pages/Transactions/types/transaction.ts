export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

// Add predefined categories using the same structure as backend
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

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: Date;
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
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export interface TransactionResponse {
  data: Transaction[];
  meta: PaginationMeta;
}
