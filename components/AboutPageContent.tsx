'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Shield,
  Handshake,
  FileCheck,
  Headphones,
  Target,
  Eye,
  Award,
  Home,
  Users,
} from 'lucide-react';
import ServicesSection from '@/components/ServicesSection';
import PageHeroBanner from '@/components/PageHeroBanner';
import SectionHeader from '@/components/ui/SectionHeader';
import StatsCard from '@/components/ui/StatsCard';
import { fadeUp, slideInLeft, slideInRight, staggerContainer } from '@/lib/animations';
import type { AboutTeamMember } from '@/types';

const ABOUT_STATS: { label: string; value: number; suffix?: string; icon: LucideIcon }[] = [
  { label: 'Years of Experience', value: 11, suffix: '+', icon: Award },
  { label: 'Properties Sold', value: 36, suffix: '+', icon: Home },
  { label: 'Happy Clients', value: 73, suffix: '+', icon: Users },
  { label: 'Partner Agents', value: 45, suffix: '+', icon: Handshake },
];

const WHY_FEATURES: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Shield,
    title: 'Expert Negotiators',
    description: 'Skilled professionals getting you the best deals',
  },
  {
    icon: Handshake,
    title: 'Transparent Process',
    description: 'Clear communication at every step',
  },
  {
    icon: FileCheck,
    title: 'Verified Properties',
    description: 'All properties fully vetted and legal',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock client assistance',
  },
];

const TEAM: AboutTeamMember[] = [
  {
    name: 'Eniola Adeyemi',
    role: 'Founder & Lead Broker',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    imageAlt: 'Eniola Adeyemi, Founder and Lead Broker',
  },
  {
    name: 'Chioma Okafor',
    role: 'Head of Sales',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    imageAlt: 'Chioma Okafor, Head of Sales',
  },
  {
    name: 'Tunde Bakare',
    role: 'Property Consultant',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    imageAlt: 'Tunde Bakare, Property Consultant',
  },
];

export default function AboutPageContent() {
  return (
    <main className="flex-1">
      <PageHeroBanner
        eyebrow="Established in Lagos"
        title="About Enny Estate"
        subheading="Nigeria's Most Trusted Real Estate Partner"
        titleId="about-hero-heading"
      />

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="section-badge">OUR STORY</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4 font-heading">
                Excellence in Real Estate Since 2015
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Enny Estate Agent has been at the forefront of luxury property sales and rentals
                across Nigeria. Our journey began with a simple mission: to provide unparalleled real
                estate services with integrity, transparency, and a deep understanding of the
                Nigerian market.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Today, we are proud to be recognized as one of Nigeria&apos;s most trusted real estate
                partners, having helped hundreds of families and investors find their perfect
                properties across Lagos, Abuja, and other prime locations nationwide.
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-[#1e3c2c] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Enny O. Adeyemi</p>
                  <p className="text-sm text-gray-500">Founder &amp; CEO</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-[#d4af37]/20 to-transparent rounded-2xl blur-2xl" aria-hidden="true" />
              <div className="relative bg-[#1e3c2c] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=500&fit=crop"
                  alt="Enny Estate leadership"
                  width={600}
                  height={500}
                  className="w-full h-[500px] object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white italic text-lg">&ldquo;Your dream home is our mission&rdquo;</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#f9fafb]">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="card p-8 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-[#1e3c2c]/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-[#1e3c2c]" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide exceptional real estate services that exceed client expectations,
                connecting people with their dream properties through trust, expertise, and
                innovation.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="card p-8 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-[#d4af37]/10 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-[#d4af37]" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become Nigeria&apos;s most preferred real estate brand, setting the standard for
                excellence, transparency, and client satisfaction across the nation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            badge="WHAT WE OFFER"
            title="Our Premium Services"
            subtitle="Comprehensive real estate solutions tailored to your needs"
          />
          <ServicesSection showHeading={false} />
        </div>
      </section>

      <section className="section-padding bg-[#f9fafb]">
        <div className="container-custom">
          <SectionHeader
            badge="WHY CHOOSE US"
            title="The Enny Estate Advantage"
            subtitle="What makes us different from the rest"
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {WHY_FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="card p-6 text-center group hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-[#1e3c2c]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#1e3c2c] transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-[#1e3c2c] group-hover:text-white transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white border-y border-gray-200">
        <div className="container-custom">
          <SectionHeader
            badge="BY THE NUMBERS"
            title="Our Impact"
            subtitle="A snapshot of trust and results across Nigeria."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ABOUT_STATS.map((stat) => (
              <StatsCard
                key={stat.label}
                icon={<stat.icon className="w-6 h-6" aria-hidden="true" />}
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#f9fafb]">
        <div className="container-custom">
          <SectionHeader
            badge="OUR TEAM"
            title="Meet the Team"
            subtitle="Dedicated professionals committed to your success at every step."
          />
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {TEAM.map((member) => (
              <motion.article
                key={member.name}
                variants={fadeUp}
                className="card text-center group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={member.imageUrl}
                    alt={member.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-[#1e3c2c]">{member.role}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-[#1e3c2c] to-[#2d5a3f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37] rounded-full blur-[100px]" />
        </div>
        <div className="container-custom relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Let our expert team guide you through Nigeria&apos;s finest real estate opportunities.
            </p>
            <Link href="/contact" className="btn-primary shadow-lg hover:shadow-xl">
              Contact Us Today
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
