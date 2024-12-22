import { Button } from '@/components/ui/button';

export function TransactionPagination() {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-sm text-muted-foreground">Showing 1 to 3 of 50 entries</div>
      <div className="flex gap-2">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <Button variant="secondary">1</Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
}
