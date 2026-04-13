'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}
    >
      <span className="text-[#d4af37] text-sm font-semibold uppercase tracking-wider">{badge}</span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3 font-heading">
        {title}
      </h2>
      <div
        className={`w-20 h-1 bg-[#d4af37] mb-4 ${centered ? 'mx-auto' : ''}`}
        aria-hidden="true"
      />
      {subtitle ? (
        <p className={`text-gray-600 ${centered ? 'max-w-2xl mx-auto' : ''}`}>{subtitle}</p>
      ) : null}
    </motion.div>
  );
}
