export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  category: string;
  amount: number;
  date: Date;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}
