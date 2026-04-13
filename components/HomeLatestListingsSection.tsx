'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';
import { fadeUp, staggerContainer } from '@/lib/animations';

interface HomeLatestListingsSectionProps {
  children: ReactNode;
}

export default function HomeLatestListingsSection({ children }: HomeLatestListingsSectionProps) {
  return (
    <section className="bg-white section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <SectionHeader
            badge="LATEST LISTINGS"
            title="Latest Properties"
            subtitle="Handpicked listings—updated regularly so you never miss a premium opportunity."
          />
          <motion.div variants={fadeUp}>{children}</motion.div>
        </motion.div>
      </div>
    </section>
  );
}
