'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Building2, MapPin, Search, ShieldCheck } from 'lucide-react';
import { heroFadeUp, heroScaleIn, heroStagger } from '@/lib/animations';

const trustItems = [
  { icon: ShieldCheck, label: 'Verified listings' },
  { icon: MapPin, label: 'Lagos · Abuja · nationwide' },
  { icon: Building2, label: 'Homes, land & apartments' },
] as const;

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-center bg-gradient-to-b from-green-950 via-[#0c1f16] to-green-950 text-white overflow-hidden"
      aria-labelledby="home-hero-heading"
    >
      {/* Base texture + grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-yellow-600/10 via-transparent to-emerald-900/20"
        aria-hidden="true"
      />

      {/* Animated ambient orbs */}
      {!reduceMotion && (
        <>
          <motion.div
            className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-yellow-600/20 blur-[100px]"
            animate={{ x: [0, 32, 0], y: [0, 18, 0], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <motion.div
            className="pointer-events-none absolute top-1/3 -right-16 h-[380px] w-[380px] rounded-full bg-emerald-500/15 blur-[90px]"
            animate={{ x: [0, -24, 0], y: [0, 28, 0], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            aria-hidden="true"
          />
          <motion.div
            className="pointer-events-none absolute bottom-0 left-1/4 h-[280px] w-[280px] rounded-full bg-yellow-600/10 blur-[80px]"
            animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Top accent rail */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-600/60 to-transparent"
        initial={{ opacity: 0, scaleX: 0.6 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-20 lg:py-24">
        <motion.div
          className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          initial="hidden"
          animate="visible"
          variants={heroStagger}
        >
          <div className="lg:col-span-6 text-center lg:text-left">
            <motion.div variants={heroFadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-600 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" aria-hidden="true" />
                Premium real estate · Nigeria
              </span>
            </motion.div>

            <motion.h1
              id="home-hero-heading"
              variants={heroFadeUp}
              className="mt-6 text-4xl sm:text-5xl lg:text-[3.35rem] xl:text-6xl font-bold leading-[1.08] tracking-tight text-balance font-heading"
            >
              Find your next{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-white via-yellow-100 to-yellow-600/90 bg-clip-text text-transparent">
                  property
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-yellow-600/0 via-yellow-600/80 to-yellow-600/0"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                />
              </span>{' '}
              with confidence
            </motion.h1>

            <motion.p
              variants={heroFadeUp}
              className="mt-5 text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Luxury homes, prime land, and premium apartments across Lagos, Abuja, and Nigeria —
              curated for clarity, speed, and trust.
            </motion.p>

            <motion.ul
              variants={heroFadeUp}
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-gray-400"
            >
              {trustItems.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-yellow-600" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={heroFadeUp}
              className="mt-9 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/properties"
                className="group btn-primary shadow-lg shadow-yellow-900/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                Explore properties
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/contact"
                className="btn-tertiary backdrop-blur-sm bg-white/5 border-white/20 hover:scale-[1.02] transition-all duration-300"
              >
                <Search size={18} aria-hidden="true" />
                Schedule a tour
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={heroScaleIn}
            className="lg:col-span-6 relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="relative aspect-[4/3] w-full">
              {/* Frame glow */}
              <div
                className="absolute -inset-1 rounded-[1.35rem] bg-gradient-to-br from-yellow-600/40 via-white/10 to-emerald-800/40 p-px"
                aria-hidden="true"
              >
                <div className="h-full w-full rounded-[1.3rem] bg-green-950/80" />
              </div>

              <motion.div
                className="absolute inset-[1px] overflow-hidden rounded-[1.25rem]"
                whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
                  alt="Contemporary luxury residence with pool at dusk"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  priority
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/20 to-transparent"
                  aria-hidden="true"
                />
              </motion.div>

              {/* Floating stat card */}
              <motion.div
                className="absolute -bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-6 sm:w-auto rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md shadow-xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-yellow-600">
                  Curated for you
                </p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  Browse rentals, sales & land in one place
                </p>
              </motion.div>
            </div>

            {/* Decorative rings */}
            <div
              className="pointer-events-none absolute -z-10 top-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -z-10 top-1/2 left-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
              aria-hidden="true"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom scroll hint */}
      {!reduceMotion && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.span
            className="block h-8 w-px bg-gradient-to-b from-yellow-600/60 to-transparent"
            animate={{ scaleY: [1, 0.6, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </section>
  );
}
