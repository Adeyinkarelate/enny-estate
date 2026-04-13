'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

export default function AboutTeaserSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="space-y-6">
            <span className="inline-block rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-[#1e3c2c]">
              About Us
            </span>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-[2.5rem] lg:leading-tight">
              Nigeria&apos;s Premier Real Estate Agency
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              Enny Estate connects discerning buyers and investors with exceptional homes, prime
              land, and premium apartments across Lagos and beyond. Experience transparent service,
              curated listings, and a team dedicated to your success.
            </p>
            <Link href="/about" className="btn-secondary">
              Learn More About Us
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#d4af37]/20 to-[#1e3c2c]/10 blur-2xl" />
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-[#d4af37]/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                alt="Luxury modern home exterior"
                width={800}
                height={560}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
