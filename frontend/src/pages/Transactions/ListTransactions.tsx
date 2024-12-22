import { TopNav } from '@/components/common/TopNav';
import { SideNav } from '@/components/common/SideNav';
import { PageHeader } from '@/components/common/PageHeader';
import { TransactionFilters } from './components/TransactionFilters';
import { TransactionTable } from './components/TransactionTable';
import { TransactionPagination } from './components/TransactionPagination';

export function ListTransactions() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <SideNav />
        <main className="flex-1">
          <PageHeader
            title="Your Financial Dashboard"
            description="Monitor your investments, analyze performance, and make data-driven decisions with our comprehensive portfolio tracking tools."
          />
          <div className="container py-6">
            <TransactionFilters />
            <TransactionTable />
            <TransactionPagination />
          </div>
        </main>
      </div>
    </div>
  );
}
