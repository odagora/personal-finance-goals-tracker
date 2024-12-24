import { BankIcon } from '@/assets/icons';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-lg border bg-white shadow-sm">
      <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Features That Make a Difference
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Everything you need to manage your finances effectively
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <FeatureCard
          icon={<BankIcon />}
          title="Expense Tracking"
          description="Easily log and categorize all your expenses"
        />
        <FeatureCard
          icon={<BankIcon />}
          title="Visual Analytics"
          description="Understand your spending with intuitive charts"
        />
        <FeatureCard
          icon={<BankIcon />}
          title="Smart Alerts"
          description="Get notified about important financial events"
        />
      </div>
    </section>
  );
}
