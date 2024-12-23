// frontend/src/pages/Transactions/components/TransactionForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  TRANSACTION_CATEGORIES,
  TransactionType,
  TransactionCategory,
} from '@/constants/transactions';
import { transactionService } from '@/services/transaction.service';

// Schema definition following the CreateTransactionDTO interface
const transactionFormSchema = z.object({
  type: z.enum([TransactionType.INCOME, TransactionType.EXPENSE], {
    required_error: 'Please select a transaction type.',
  }),
  category: z.enum(
    [
      ...TRANSACTION_CATEGORIES[TransactionType.INCOME],
      ...TRANSACTION_CATEGORIES[TransactionType.EXPENSE],
    ] as [string, ...string[]],
    {
      required_error: 'Please select a category.',
    }
  ),
  amount: z
    .number({
      required_error: 'Please enter an amount.',
    })
    .min(0.01, 'Amount must be greater than 0'),
  date: z.date({
    required_error: 'Please select a date.',
  }),
  description: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export function TransactionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize form with undefined values for selects
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: undefined,
      category: undefined,
      amount: undefined,
      date: new Date(),
      description: '',
    },
  });

  // Watch type to update categories
  const selectedType = form.watch('type');
  const categories = selectedType ? TRANSACTION_CATEGORIES[selectedType] : [];

  // Handle type change to reset category
  const handleTypeChange = (value: TransactionType) => {
    form.setValue('type', value);
    if (value) {
      form.setValue('category', TRANSACTION_CATEGORIES[value][0], {
        shouldValidate: true,
      });
    }
  };

  // Form submission handler
  async function onSubmit(values: TransactionFormValues) {
    try {
      await transactionService.create({
        type: values.type,
        category: values.category,
        amount: values.amount,
        date: values.date,
        description: values.description,
      });

      toast({
        title: 'Success',
        description: 'Transaction created successfully.',
      });

      navigate('/transactions');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create transaction. Please try again.';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Type Field */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={(value: TransactionType) => handleTypeChange(value)}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
                    <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category: TransactionCategory) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Amount Field */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter transaction details..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Upload Field (Disabled for MVP) */}
        <div className="rounded-lg border border-dashed p-8">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="text-sm text-muted-foreground">File upload will be available soon</div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/transactions')}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Transaction'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
