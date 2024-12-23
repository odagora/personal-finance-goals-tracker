import { api } from './api';
import { TransactionFilters, TransactionResponse } from '@/types/transaction';

export const transactionService = {
  getAll: async (filters?: TransactionFilters): Promise<TransactionResponse> => {
    const { data } = await api.get('/transactions', { params: filters });
    // Return the data and meta from the same level
    return {
      data: data || [], // data is already the transactions array
      meta: {
        total: data?.length || 0,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
      },
    };
  },
};
