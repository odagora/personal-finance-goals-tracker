import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { formatUpperCase } from '@/utils/text';
import { GoogleIcon } from '@/assets/icons/GoogleIcon';
import { BankIcon } from '@/assets/icons/BankIcon';

// Define form validation schema
const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Form submission handler with proper error handling
  async function onSubmit(values: LoginFormValues) {
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      navigate('/transactions');
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  }

  return (
    <>
      <AuthHeader
        text="New to financial planning?"
        linkText="Start your journey"
        linkHref="/auth/register"
      />

      <AuthLayout
        hero={{
          title: 'Smart financial tracking for your personal goals.',
          quote:
            'Using this platform helped me save 30% more each month and finally achieve my dream of buying a house',
          author: 'Sarah Johnson',
        }}
      >
        <div className="flex flex-col flex-1 justify-center">
          <div className="flex flex-col space-y-6 w-full max-w-md mx-auto">
            {form.formState.errors.root && (
              <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md" role="alert">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {formatUpperCase('Sign in to Fintracker')}
              </h1>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatUpperCase('Email address')}</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatUpperCase('Password')}</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <div className="flex justify-end">
                        <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                          Forgot your password?
                        </Link>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {formatUpperCase('Sign in')}
                </Button>
              </form>
            </Form>

            <div className="space-y-6">
              <p className="text-center text-sm text-muted-foreground">
                By signing in, you agree to our{' '}
                <Link to="#" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </Link>
                ,{' '}
                <Link to="#" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </Link>
                , and{' '}
                <Link to="#" className="underline underline-offset-4 hover:text-primary">
                  Financial Services Agreement
                </Link>
              </p>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {formatUpperCase('or sign in with')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button">
                  <GoogleIcon />
                  Google
                </Button>
                <Button variant="outline" type="button">
                  <BankIcon />
                  Bank Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
