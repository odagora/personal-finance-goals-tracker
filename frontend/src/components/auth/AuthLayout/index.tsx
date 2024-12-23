import { cn } from '@/lib/utils';
import dashboardPreview from '@/assets/images/dashboard-preview.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
  hero?: {
    title: string;
    quote: string;
    author: string;
  };
}

export function AuthLayout({ children, className, hero }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Left column - Hero section */}
      <div className="hidden lg:flex relative bg-zinc-900">
        <div className="flex flex-col flex-1 justify-center gap-8 py-32">
          {/* Dashboard preview */}
          <div className="w-full px-8">
            <img
              src={dashboardPreview}
              alt="Dashboard Preview"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>

          {/* Hero content */}
          <div className="flex flex-col space-y-6 px-8">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-xl">
              {hero?.title}
            </h1>
            <blockquote className="text-lg text-zinc-300">"{hero?.quote}"</blockquote>
            <p className="text-base text-zinc-400">{hero?.author}</p>
          </div>
        </div>
      </div>

      {/* Right column - Form section */}
      <div className={cn('flex flex-col px-8 lg:px-12 py-8', className)}>{children}</div>
    </div>
  );
}
