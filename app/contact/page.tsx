import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import ContactPageSection from '@/components/ContactPageSection';
import PageHeroBanner from '@/components/PageHeroBanner';

export const metadata: Metadata = {
  title: 'Contact | Enny Estate',
  description: 'Schedule a property tour or send us a message.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <PageHeroBanner
        eyebrow="Get in touch"
        title="Contact Us"
        subheading="We are here to help you find your perfect property."
        titleId="contact-hero-heading"
      />
      <ContactPageSection>
        <ContactForm />
      </ContactPageSection>
      <Footer />
    </>
  );
}
