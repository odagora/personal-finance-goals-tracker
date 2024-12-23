import heroImage from '@/assets/images/hero-piggy.png';

interface FeatureItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

function FeatureItem({ title, description, icon }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex-shrink-0 rounded-full bg-primary/10 p-2">{icon}</div>
      <div>
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Track Your Financial Journey
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Take control of your finances with our powerful tracking tools and achieve your financial
          goals faster.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Column - Image */}
        <div className="flex items-center justify-center lg:justify-start">
          <div className="relative w-full max-w-2xl">
            <img
              src={heroImage}
              alt="Financial Growth Illustration"
              className="w-full h-auto scale-110"
            />
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-12">Smart Financial Planning Made Simple</h2>

          <div className="space-y-10">
            <FeatureItem
              icon={<span className="text-4xl">📊</span>}
              title="Real-time Tracking"
              description="Monitor your expenses and income in real-time with intuitive dashboards"
              className="text-lg"
            />
            <FeatureItem
              icon={<span className="text-4xl">🎯</span>}
              title="Goal Setting"
              description="Set and track financial goals with personalized milestones"
              className="text-lg"
            />
            <FeatureItem
              icon={<span className="text-4xl">🔒</span>}
              title="Secure & Private"
              description="Your financial data is protected with bank-level security"
              className="text-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
