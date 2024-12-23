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
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Download, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { TransactionFilters as Filters } from '@/types/transaction';
import { useState, useEffect } from 'react';

interface TransactionFiltersProps {
  filters: Filters;
  categories: string[];
  isLoadingCategories: boolean;
  onFilterChange: (filters: Filters) => void;
  onReset: () => void;
}

export function TransactionFilters({
  filters,
  categories,
  isLoadingCategories,
  onFilterChange,
  onReset,
}: TransactionFiltersProps) {
  // Track the visual state of selects with null for unselected state
  const [typeValue, setTypeValue] = useState<string | null>(filters.type || null);
  const [categoryValue, setCategoryValue] = useState<string | null>(filters.category || null);

  // Update local state when filters change externally
  useEffect(() => {
    setTypeValue(filters.type || null);
    setCategoryValue(filters.category || null);
  }, [filters.type, filters.category]);

  const handleFilterChange = (key: keyof Filters, value: string | null) => {
    if (key === 'type') setTypeValue(value);
    if (key === 'category') setCategoryValue(value);

    onFilterChange({
      ...filters,
      [key]: value || undefined, // Keep undefined for API calls
    });
  };

  const handleReset = () => {
    setTypeValue(null); // Use null to show placeholder
    setCategoryValue(null);
    onReset();
  };

  return (
    <div className="mb-6 space-y-4 lg:space-y-0">
      <div className="grid grid-cols-1 lg:grid-cols-[repeat(2,200px)_1fr] gap-4 mb-4">
        <Select
          value={typeValue || ''}
          onValueChange={(value) => handleFilterChange('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoryValue || ''}
          onValueChange={(value) => handleFilterChange('category', value)}
          disabled={isLoadingCategories}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(new Date(filters.startDate), 'PP') : 'Start Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate ? new Date(filters.startDate) : undefined}
                onSelect={(date) => handleFilterChange('startDate', date?.toISOString() || null)}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(new Date(filters.endDate), 'PP') : 'End Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate ? new Date(filters.endDate) : undefined}
                onSelect={(date) => handleFilterChange('endDate', date?.toISOString() || null)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={handleReset} className="gap-2 px-4">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button className="gap-2 bg-primary px-4 hover:bg-primary/90">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button variant="secondary" className="gap-2 px-4">
          <SlidersHorizontal className="h-4 w-4" />
          More Filters
        </Button>
      </div>
    </div>
  );
}
