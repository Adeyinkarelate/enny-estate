'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';
import { fadeUp, staggerContainer } from '@/lib/animations';

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

const STATS: StatItem[] = [
  { label: 'Years of Experience', value: 11, suffix: '+' },
  { label: 'Properties Sold', value: 36, suffix: '+' },
  { label: 'Happy Clients', value: 73, suffix: '+' },
  { label: 'Active Listings', value: 27, suffix: '+' },
];

export function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }
    const controls = animate(0, end, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        setDisplay(Math.round(v));
      },
    });
    return () => {
      controls.stop();
    };
  }, [isInView, end]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="border-y border-gray-200 bg-white section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="TRUSTED RESULTS"
          title="By the Numbers"
          subtitle="A quick look at the experience and activity behind every recommendation."
        />
        <motion.div
          className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="text-center transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="mb-2 text-3xl font-bold text-[#1e3c2c] md:text-4xl">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm font-medium text-gray-600 md:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
