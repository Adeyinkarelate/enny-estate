'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatsCardProps {
  icon: ReactNode;
  value: number;
  label: string;
  suffix?: string;
}

export default function StatsCard({ icon, value, label, suffix = '+' }: StatsCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => {
      clearInterval(timer);
    };
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="w-12 h-12 bg-[#1e3c2c]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1e3c2c]">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-bold text-[#1e3c2c] tabular-nums">
        {count}
        {suffix}
      </div>
      <div className="text-gray-600 text-sm mt-2">{label}</div>
    </motion.div>
  );
}
