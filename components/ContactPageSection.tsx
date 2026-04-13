'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';
import { fadeUp, staggerContainer } from '@/lib/animations';

interface ContactPageSectionProps {
  children: ReactNode;
}

export default function ContactPageSection({ children }: ContactPageSectionProps) {
  return (
    <section className="flex-1 bg-[#f9fafb] section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <SectionHeader
              badge="GET IN TOUCH"
              title="Send a message"
              subtitle="Schedule a tour or ask a question. We aim to respond within 24 hours."
            />
            <motion.div variants={fadeUp} className="card p-6 sm:p-8">
              {children}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
