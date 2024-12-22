import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, List } from 'lucide-react';

export function SideNav() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r min-h-screen p-6">
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/transactions/new">
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Link>
        </Button>
        <Button
          variant={location.pathname === '/transactions' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          asChild
        >
          <Link to="/transactions">
            <List className="mr-2 h-4 w-4" />
            View Transactions
          </Link>
        </Button>
      </nav>
    </aside>
  );
}
