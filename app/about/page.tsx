import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutPageContent from '@/components/AboutPageContent';

export const metadata: Metadata = {
  title: 'About Us | Enny Estate - Nigeria Premier Real Estate',
  description:
    'Learn about Enny Estate, your trusted real estate partner in Nigeria. Luxury properties, land sales, and apartment rentals.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutPageContent />
      <Footer />
    </>
  );
}
