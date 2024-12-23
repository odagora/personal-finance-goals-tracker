import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Transaction } from '@/types/transaction';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { formatUpperCase } from '@/utils/text';

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  if (!transactions.length) {
    return (
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px] text-center text-xs font-medium text-muted-foreground">
              Date
            </TableHead>
            <TableHead className="w-[100px] text-center text-xs font-medium text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="w-[120px] text-center text-xs font-medium text-muted-foreground">
              Category
            </TableHead>
            <TableHead className="w-[120px] text-center text-xs font-medium text-muted-foreground">
              Amount
            </TableHead>
            <TableHead className="min-w-[200px] text-center text-xs font-medium text-muted-foreground">
              Description
            </TableHead>
            <TableHead className="w-[100px] text-center text-xs font-medium text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No transactions found
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[120px] text-center text-xs font-medium text-muted-foreground">
            Date
          </TableHead>
          <TableHead className="w-[100px] text-center text-xs font-medium text-muted-foreground">
            Type
          </TableHead>
          <TableHead className="w-[120px] text-center text-xs font-medium text-muted-foreground">
            Category
          </TableHead>
          <TableHead className="w-[120px] text-center text-xs font-medium text-muted-foreground">
            Amount
          </TableHead>
          <TableHead className="min-w-[200px] text-center text-xs font-medium text-muted-foreground">
            Description
          </TableHead>
          <TableHead className="w-[100px] text-center text-xs font-medium text-muted-foreground">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id} className="hover:bg-accent/50">
            <TableCell className="text-center text-sm">
              {format(new Date(transaction.date), 'yyyy-MM-dd')}
            </TableCell>
            <TableCell className="text-center">
              <Badge
                className={cn(
                  'px-2.5 py-0.5',
                  transaction.type === formatUpperCase('income')
                    ? 'bg-green-50 text-green-700 hover:bg-green-50'
                    : 'bg-red-50 text-red-700 hover:bg-red-50'
                )}
              >
                {transaction.type === formatUpperCase('income') ? 'Income' : 'Outcome'}
              </Badge>
            </TableCell>
            <TableCell className="text-center text-sm">{transaction.category}</TableCell>
            <TableCell
              className={cn('text-center text-sm font-medium', {
                'text-green-700': transaction.type === formatUpperCase('income'),
                'text-red-700': transaction.type === formatUpperCase('expense'),
              })}
            >
              {transaction.type === formatUpperCase('income') ? '+' : '-'}$
              {Number(transaction.amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell className="text-center text-sm">{transaction.description}</TableCell>
            <TableCell className="text-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit transaction</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete transaction</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
