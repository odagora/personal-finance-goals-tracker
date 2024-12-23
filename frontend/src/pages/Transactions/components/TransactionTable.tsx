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

export function TransactionTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[100px] text-xs font-medium text-muted-foreground">
            Date
          </TableHead>
          <TableHead className="w-[100px] text-xs font-medium text-muted-foreground">
            Type
          </TableHead>
          <TableHead className="w-[120px] text-xs font-medium text-muted-foreground">
            Category
          </TableHead>
          <TableHead className="w-[120px] text-right text-xs font-medium text-muted-foreground">
            Amount
          </TableHead>
          <TableHead className="min-w-[200px] text-xs font-medium text-muted-foreground">
            Description
          </TableHead>
          <TableHead className="w-[100px] text-right text-xs font-medium text-muted-foreground">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="hover:bg-accent/50">
          <TableCell className="text-sm">2024-01-15</TableCell>
          <TableCell>
            <Badge className="bg-green-50 text-green-700 hover:bg-green-50 px-2.5 py-0.5">
              Income
            </Badge>
          </TableCell>
          <TableCell className="text-sm">Salary</TableCell>
          <TableCell className="text-right text-sm font-medium text-green-600">
            +$3,500.00
          </TableCell>
          <TableCell className="text-sm">Monthly salary payment</TableCell>
          <TableCell className="text-right">
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
        <TableRow className="hover:bg-accent/50">
          <TableCell className="text-sm">2024-01-14</TableCell>
          <TableCell>
            <Badge className="bg-red-50 text-red-700 hover:bg-red-50 px-2.5 py-0.5">Outcome</Badge>
          </TableCell>
          <TableCell className="text-sm">Bills</TableCell>
          <TableCell className="text-right text-sm font-medium text-red-600">-$150.00</TableCell>
          <TableCell className="text-sm">Electricity bill</TableCell>
          <TableCell className="text-right">
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
      </TableBody>
    </Table>
  );
}
