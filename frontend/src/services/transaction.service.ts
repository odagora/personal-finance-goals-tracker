import { api } from './api';
import { TransactionFilters, TransactionResponse } from '@/types/transaction';

type CleanedFilters = {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

export interface CreateTransactionDTO {
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: Date;
  description?: string;
}

// Type guard to check if key is valid
function isValidFilterKey(key: string): key is keyof CleanedFilters {
  return ['type', 'category', 'startDate', 'endDate', 'page', 'limit'].includes(key);
}

export const transactionService = {
  getAll: async (filters?: TransactionFilters): Promise<TransactionResponse> => {
    const cleanFilters = Object.entries(filters || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '' && isValidFilterKey(key)) {
        acc[key] = value;
      }
      return acc;
    }, {} as CleanedFilters);

    const { data } = await api.get('/transactions', { params: cleanFilters });
    return {
      data: data || [],
      meta: {
        total: data?.length || 0,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
      },
    };
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get('/transactions/categories');
    return data;
  },

  create: async (transaction: CreateTransactionDTO): Promise<void> => {
    await api.post('/transactions', transaction);
  },
};
