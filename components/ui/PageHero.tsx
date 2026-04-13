'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

const DEFAULT_HERO_IMAGE = '/images/page-hero-bg.jpg';

interface PageHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  /** Public path or absolute URL for the hero photo */
  backgroundImage?: string;
  /** Sets `id` on the H1 for `aria-labelledby` on the section */
  titleId?: string;
}

export default function PageHero({
  badge,
  title,
  subtitle,
  backgroundImage,
  titleId,
}: PageHeroProps) {
  const bgSrc = backgroundImage ?? DEFAULT_HERO_IMAGE;

  return (
    <section
      className="relative min-h-[42vh] overflow-hidden md:min-h-[48vh]"
      aria-labelledby={titleId}
    >
      <Image
        src={bgSrc}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[rgba(26,48,38,0.78)]" aria-hidden="true" />

      <div className="relative z-10 flex min-h-[42vh] flex-col md:min-h-[48vh]">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-white/15 hover:bg-white/25 text-white border border-white/35 backdrop-blur-sm hover:scale-[1.02]"
          >
            <Home className="h-5 w-5 shrink-0" aria-hidden="true" />
            Home
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <span className="text-yellow-600 text-sm font-semibold uppercase tracking-[0.2em]">
              {badge}
            </span>
            <h1
              id={titleId}
              className="text-3xl font-bold text-white mt-3 mb-4 md:text-4xl lg:text-5xl"
            >
              {title}
            </h1>
            <p className="text-lg text-white md:text-xl">{subtitle}</p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-8 h-1 w-24 origin-center rounded-full bg-yellow-600"
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
