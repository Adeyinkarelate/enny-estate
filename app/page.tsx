import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AboutTeaserSection from '@/components/AboutTeaserSection';
import LatestPropertiesSection from '@/components/LatestPropertiesSection';
import PropertiesSkeleton from '@/components/PropertiesSkeleton';
import ScheduleTourCTA from '@/components/ScheduleTourCTA';
import Testimonials from '@/components/Testimonials';
import StatsSection from '@/components/StatsSection';
import HomeLatestListingsSection from '@/components/HomeLatestListingsSection';

export const metadata: Metadata = {
  title: 'Enny Estate | Premium Real Estate Nigeria',
  description:
    'Discover luxury homes, prime lands & premium apartments in Lagos, Nigeria. Your trusted real estate partner.',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutTeaserSection />
      <HomeLatestListingsSection>
        <Suspense fallback={<PropertiesSkeleton />}>
          <LatestPropertiesSection />
        </Suspense>
      </HomeLatestListingsSection>
      <ScheduleTourCTA />
      <section className="bg-[#f9fafb] section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Testimonials />
        </div>
      </section>
      <StatsSection />
      <Footer />
    </>
  );
}
