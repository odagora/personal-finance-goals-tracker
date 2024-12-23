// frontend/src/constants/transactions.ts
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const TRANSACTION_CATEGORIES = {
  [TransactionType.INCOME]: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other Income'],
  [TransactionType.EXPENSE]: [
    'Food',
    'Transportation',
    'Housing',
    'Utilities',
    'Shopping',
    'Education',
    'Other Expenses',
  ],
} as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[TransactionType][number];
