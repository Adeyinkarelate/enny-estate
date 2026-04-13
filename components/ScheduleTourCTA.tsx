'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

export default function ScheduleTourCTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[rgba(15,31,23,0.82)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#d4af37]/15 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUp} className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to See It in Person?
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-10 text-lg text-gray-200/90">
            Book a private tour with our specialists. We&apos;ll walk you through every detail and
            answer your questions—no obligation.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="inline-block"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#d4af37] px-8 py-3 font-semibold text-[#1e3c2c] shadow-lg transition-all duration-300 hover:bg-[#e4c04d] hover:scale-[1.02]"
            >
              Schedule a Tour
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
