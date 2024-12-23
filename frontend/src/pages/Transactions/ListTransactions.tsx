import { TopNav } from '@/components/common/TopNav';
import { SideNav } from '@/components/common/SideNav';
import { PageHeader } from '@/components/common/PageHeader';
import { TransactionFilters } from './components/TransactionFilters';
import { TransactionTable } from './components/TransactionTable';
import { TransactionPagination } from './components/TransactionPagination';

export function ListTransactions() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] max-w-screen-xl mx-auto">
      <TopNav />

      {/* Header section with constrained width */}
      <div className="py-8 px-4 lg:px-6">
        <div className="mx-auto max-w-xl">
          {' '}
          {/* Constrained width container */}
          <PageHeader
            title="Your Financial Dashboard"
            description="Monitor your investments, analyze performance, and make data-driven decisions with our comprehensive portfolio tracking tools."
            className="text-center"
          />
        </div>
      </div>

      {/* Content section with menu and table */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-8">
        <div className="lg:hidden">{/* Mobile menu trigger button will go here */}</div>
        <div className="hidden lg:block lg:flex-shrink-0">
          <SideNav />
        </div>
        <main className="flex-1 min-w-0">
          <div className="mx-auto w-full">
            <div className="rounded-lg border bg-white shadow">
              <div className="p-4 lg:p-6">
                <TransactionFilters />
                <div className="relative w-full overflow-x-auto">
                  <div className="min-w-full inline-block align-middle">
                    <TransactionTable />
                  </div>
                </div>
                <TransactionPagination />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
