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
import { TRANSACTION_CATEGORIES, TransactionType } from '@/constants/transactions';

interface TransactionFiltersProps {
  filters: Filters;
  categories: string[];
  isLoadingCategories: boolean;
  onFilterChange: (filters: Filters) => void;
  onReset: () => void;
}

export function TransactionFilters({
  filters,
  isLoadingCategories,
  onFilterChange,
  onReset,
}: TransactionFiltersProps) {
  // Track the visual state of selects with null for unselected state
  const [typeValue, setTypeValue] = useState<string | null>(filters.type || null);
  const [categoryValue, setCategoryValue] = useState<string | null>(filters.category || null);

  // Get filtered categories based on selected type
  const filteredCategories = typeValue ? TRANSACTION_CATEGORIES[typeValue as TransactionType] : [];

  // Update local state when filters change externally
  useEffect(() => {
    setTypeValue(filters.type || null);
    setCategoryValue(filters.category || null);
  }, [filters.type, filters.category]);

  const handleFilterChange = (key: keyof Filters, value: string | null) => {
    if (key === 'type') {
      setTypeValue(value);
      setCategoryValue(null); // Reset category when type changes

      onFilterChange({
        ...filters,
        type: value || undefined,
        category: undefined, // Clear category filter
      });
    } else if (key === 'category') {
      setCategoryValue(value);

      onFilterChange({
        ...filters,
        category: value || undefined,
      });
    } else {
      onFilterChange({
        ...filters,
        [key]: value || undefined,
      });
    }
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
          disabled={!typeValue || isLoadingCategories}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
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
