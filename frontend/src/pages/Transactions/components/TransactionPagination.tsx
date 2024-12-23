import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TransactionPaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function TransactionPagination({
  currentPage = 1,
  totalPages = 3,
  totalItems = 50,
  itemsPerPage = 3,
}: TransactionPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t py-4">
      <p className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} entries
      </p>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-4 text-sm disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            className={cn('h-8 w-8 text-sm', {
              'bg-primary text-primary-foreground hover:bg-primary/90': page === currentPage,
            })}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-4 text-sm disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
