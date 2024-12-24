import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="rounded-lg border bg-white shadow-sm px-8 py-16 text-center sm:px-16">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Take Control?</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Join thousands of users who are already achieving their financial goals
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/auth/register">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
