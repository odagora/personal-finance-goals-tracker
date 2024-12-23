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
// import { TransactionType } from '../types/transaction';

export function TransactionTable() {
  return (
    <Table className="min-w-full divide-y divide-gray-200">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead className="w-[100px]">Type</TableHead>
          <TableHead className="w-[120px]">Category</TableHead>
          <TableHead className="w-[120px] text-right">Amount</TableHead>
          <TableHead className="min-w-[200px]">Description</TableHead>
          <TableHead className="w-[100px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Mock data - will be replaced with real data */}
        <TableRow>
          <TableCell>2024-01-15</TableCell>
          <TableCell>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Income
            </Badge>
          </TableCell>
          <TableCell>Salary</TableCell>
          <TableCell className="text-right text-green-600">+$3,500.00</TableCell>
          <TableCell>Monthly salary payment</TableCell>
          <TableCell className="text-right">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit transaction</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete transaction</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}