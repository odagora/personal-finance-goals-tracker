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
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Download, SlidersHorizontal } from 'lucide-react';

export function TransactionFilters() {
  return (
    <div className="mb-6">
      {/* Types and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-[repeat(2,200px)_1fr] gap-4 mb-4">
        <Select>
          <SelectTrigger className="h-10 bg-white hover:bg-accent focus:ring-0">
            <SelectValue placeholder="All Types" className="text-sm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="outcome">Outcome</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="h-10 bg-white hover:bg-accent focus:ring-0">
            <SelectValue placeholder="All Categories" className="text-sm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="salary">Salary</SelectItem>
            <SelectItem value="bills">Bills</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Pickers */}
        <div className="grid grid-cols-2 gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-10 w-full justify-start bg-white px-3 text-left text-sm font-normal hover:bg-accent',
                  !Date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                Start Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" className="rounded-md border" />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-10 w-full justify-start bg-white px-3 text-left text-sm font-normal hover:bg-accent',
                  !Date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                End Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" className="rounded-md border" />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button className="h-10 gap-2 bg-primary px-4 hover:bg-primary/90">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button variant="secondary" className="h-10 gap-2 px-4">
          <SlidersHorizontal className="h-4 w-4" />
          More Filters
        </Button>
      </div>
    </div>
  );
}
