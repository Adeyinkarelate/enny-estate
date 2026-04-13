'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-[#0a1a14] via-[#1a2e24] to-[#0d1f17] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#d4af37] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4af37] rounded-full blur-[120px]" />
      </div>
      <div
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="text-center md:text-left">
            <motion.p
              variants={fadeUp}
              className="text-[#d4af37] text-sm font-semibold uppercase tracking-wider mb-3"
            >
              Premium real estate · Nigeria
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 font-heading"
            >
              Find Your Dream
              <span className="text-[#d4af37]"> Property</span>
              <br />
              In Nigeria
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg text-gray-300 mb-8 max-w-lg mx-auto md:mx-0 font-light tracking-wide"
            >
              Discover luxury homes, prime lands & premium apartments in Lagos, Abuja, and across
              Nigeria.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Link href="/properties" className="btn-primary">
                Explore Properties <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="btn-tertiary">
                <Search size={18} aria-hidden="true" />
                Schedule a Tour
              </Link>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="hidden md:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#d4af37]/25 rounded-3xl blur-2xl" aria-hidden="true" />
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"
                alt="Luxury Property Nigeria"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
