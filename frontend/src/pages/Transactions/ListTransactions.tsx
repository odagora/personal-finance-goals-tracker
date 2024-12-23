import { useEffect, useState } from 'react';
import { TopNav } from '@/components/common/TopNav';
import { SideNav } from '@/components/common/SideNav';
import { PageHeader } from '@/components/common/PageHeader';
import { TransactionFilters } from './components/TransactionFilters';
import { TransactionTable } from './components/TransactionTable';
import { TransactionPagination } from './components/TransactionPagination';
import { transactionService } from '@/services/transaction.service';
import {
  Transaction,
  TransactionFilters as Filters,
  TransactionResponse,
} from '@/types/transaction';

export function ListTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<TransactionResponse['meta']>({
    total: 0,
    page: 1,
    limit: 10,
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const initialFilters: Filters = {
    type: undefined,
    category: undefined,
    startDate: undefined,
    endDate: undefined,
    page: 1,
    limit: 10,
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await transactionService.getAll(filters);
        setTransactions(response.data);
        setMeta(response.meta);
      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to fetch transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [filters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await transactionService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset page when filters change
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] max-w-screen-xl mx-auto">
      <TopNav />
      <div className="py-8 px-4 lg:px-6">
        <div className="mx-auto max-w-xl">
          <PageHeader
            title="Your Financial Dashboard"
            description="Monitor your investments, analyze performance, and make data-driven decisions with our comprehensive portfolio tracking tools."
            className="text-center"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-8">
        <div className="lg:hidden">{/* Mobile menu trigger button will go here */}</div>
        <div className="hidden lg:block lg:flex-shrink-0">
          <SideNav />
        </div>
        <main className="flex-1 min-w-0">
          <div className="mx-auto w-full">
            <div className="rounded-lg border bg-white shadow">
              <div className="p-4 lg:p-6">
                <h2 className="text-xl font-semibold mb-4">View Transactions</h2>
                <TransactionFilters
                  filters={filters}
                  categories={categories}
                  isLoadingCategories={isLoadingCategories}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
                <div className="relative w-full overflow-x-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">Loading...</div>
                  ) : error ? (
                    <div className="flex items-center justify-center py-8 text-red-500">
                      {error}
                    </div>
                  ) : (
                    <div className="min-w-full inline-block align-middle">
                      <TransactionTable transactions={transactions} />
                    </div>
                  )}
                </div>
                {!isLoading && !error && (
                  <TransactionPagination
                    currentPage={meta.page}
                    totalPages={Math.ceil(meta.total / meta.limit)}
                    totalItems={meta.total}
                    itemsPerPage={meta.limit}
                    onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
