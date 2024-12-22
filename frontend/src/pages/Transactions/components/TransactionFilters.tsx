import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, SlidersHorizontal } from 'lucide-react';
// import { format } from 'date-fns';
import { TransactionType } from '../types/transaction';

export function TransactionFilters() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-4">
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
            <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {/* Add categories based on selected type */}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Start Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              End Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>
    </div>
  );
}
