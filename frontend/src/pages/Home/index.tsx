import { TopNav } from '@/components/common/TopNav';
import { HeroSection } from './components/Hero';
import { FeaturesSection } from './components/Features';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';

export function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNav />
      <div className="max-w-screen-xl mx-auto">
        <main>
          <HeroSection />
          <FeaturesSection />
          <CallToAction />
        </main>
      </div>
      <Footer />
    </div>
  );
}
