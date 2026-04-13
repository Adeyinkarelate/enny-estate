'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { fadeUp, staggerContainer } from '@/lib/animations';

const testimonials = [
  {
    id: 1,
    name: 'Adeola R.',
    location: 'Lekki, Lagos',
    text: 'Enny Estate helped me secure a prime land in Lekki seamlessly. Their team was professional and transparent throughout the process.',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Adeola+R&background=1e3c2c&color=fff',
  },
  {
    id: 2,
    name: 'Chuka M.',
    location: 'Victoria Island',
    text: 'Fast, reliable, and they know the Nigerian market inside out. Rented my dream apartment within a week of contacting them.',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Chuka+M&background=1e3c2c&color=fff',
  },
  {
    id: 3,
    name: 'Mrs. Ngozi O.',
    location: 'Ikoyi, Lagos',
    text: 'Best decision to invest through Enny Estate. Their property portfolio is impressive and their after-sales support is excellent.',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Ngozi+O&background=1e3c2c&color=fff',
  },
];

export default function Testimonials() {
  return (
    <div className="w-full">
      <SectionHeader
        badge="TESTIMONIALS"
        title="What Our Clients Say"
        subtitle="Real experiences from clients who found their perfect properties with us."
      />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
      >
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            variants={fadeUp}
            className="card p-6 hover:-translate-y-1 relative"
          >
            <Quote className="absolute top-4 right-4 text-gray-200 w-8 h-8" aria-hidden="true" />

            <div className="flex items-center space-x-4 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>

            <div className="flex mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={16} className="fill-[#d4af37] text-[#d4af37]" aria-hidden="true" />
              ))}
            </div>

            <p className="text-gray-600 italic leading-relaxed">{`"${testimonial.text}"`}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
