import { Link, useLocation } from 'react-router-dom';
import { ListIcon, PlusCircleIcon } from '@/assets/icons';

export function SideNav() {
  const location = useLocation();
  const isNewTransaction = location.pathname === '/transactions/new';
  const isViewTransactions = location.pathname === '/transactions';

  return (
    <aside className="h-full w-64 rounded-lg border bg-white shadow">
      <div className="flex h-full flex-col px-4 py-6">
        <h2 className="mb-6 px-2 text-lg font-semibold">Menu</h2>
        <nav className="space-y-1">
          <Link
            to="/transactions/new"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
              isNewTransaction
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <PlusCircleIcon />
            New Transaction
          </Link>
          <Link
            to="/transactions"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
              isViewTransactions
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <ListIcon />
            View Transactions
          </Link>
        </nav>
      </div>
    </aside>
  );
}
