'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Home,
  Landmark,
  Building2,
  ClipboardList,
  FileSignature,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { fadeUp, staggerContainer } from '@/lib/animations';

export interface ServicesSectionProps {
  title?: string;
  subtitle?: string;
  /** When false, only service cards are rendered (use with `SectionHeader` above). */
  showHeading?: boolean;
}

const services = [
  {
    icon: Home,
    title: 'House Rentals',
    description: 'Short and long-term rentals in secured estates across Lagos and Abuja.',
    color: 'bg-[#1e3c2c]/10 text-[#1e3c2c]',
  },
  {
    icon: Landmark,
    title: 'Landed Properties',
    description: 'Residential and commercial land sales with verified C of O documents.',
    color: 'bg-[#d4af37]/15 text-[#1e3c2c]',
  },
  {
    icon: Building2,
    title: 'Apartment Rentals',
    description: 'Modern flats, serviced apartments, and luxury penthouses.',
    color: 'bg-[#1e3c2c]/10 text-[#1e3c2c]',
  },
  {
    icon: ClipboardList,
    title: 'Property Management',
    description:
      'End-to-end oversight of rentals—tenant relations, maintenance, and compliance so owners can invest with confidence.',
    color: 'bg-[#d4af37]/15 text-[#1e3c2c]',
  },
  {
    icon: FileSignature,
    title: 'Lease',
    description:
      'Residential and commercial lease agreements tailored to your term, budget, and location across Lagos and Abuja.',
    color: 'bg-[#1e3c2c]/10 text-[#1e3c2c]',
  },
  {
    icon: MessageCircle,
    title: 'Consultation',
    description:
      'One-on-one sessions on buying, selling, investing, or renting—market insight and a clear plan before you commit.',
    color: 'bg-[#d4af37]/15 text-[#1e3c2c]',
  },
];

export default function ServicesSection({
  title = 'Our Premium Services',
  subtitle = 'Comprehensive real estate solutions tailored to your needs',
  showHeading = true,
}: ServicesSectionProps) {
  return (
    <div className="w-full">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={staggerContainer}
      >
        {showHeading ? (
          <motion.div className="text-center mb-4 sm:col-span-2 lg:col-span-3 lg:mb-6" variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-heading">{title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          </motion.div>
        ) : null}

        {services.map((service) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              variants={fadeUp}
              className="group card p-6 text-center hover:-translate-y-2 hover:shadow-2xl"
            >
              <div
                className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon size={32} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
              <Link
                href="/properties"
                className="inline-flex items-center gap-1 text-[#1e3c2c] font-semibold text-sm hover:gap-2 transition-all"
              >
                Learn More <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
