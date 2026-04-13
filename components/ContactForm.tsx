'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendClientConfirmationEmail, sendTourRequestEmail } from '@/lib/emailjs';
import type { ContactFormState } from '@/types';

interface ContactFormProps {
  propertyId?: string;
  propertyTitle?: string;
}

const emptyForm: ContactFormState = {
  name: '',
  email: '',
  message: '',
};

export default function ContactForm({ propertyId, propertyTitle }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const name = formData.name.trim();
      const email = formData.email.trim();
      const message = formData.message.trim();

      const adminResult = await sendTourRequestEmail({
        clientName: name,
        clientEmail: email,
        propertyTitle,
        message,
      });

      if (!adminResult.success) {
        const err =
          adminResult.error instanceof Error
            ? adminResult.error.message
            : 'Could not send your message. Please try again.';
        toast.error(err.length > 200 ? `${err.slice(0, 197)}…` : err);
        return;
      }

      if (process.env.NEXT_PUBLIC_EMAILJS_CLIENT_TEMPLATE_ID?.trim()) {
        const clientResult = await sendClientConfirmationEmail({
          clientName: name,
          clientEmail: email,
          propertyTitle,
        });

        if (!clientResult.success) {
          toast.error(
            'Your request was received, but we could not send a confirmation email. We will still contact you soon.'
          );
        }
      }

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          property_id: propertyId,
          property_title: propertyTitle,
          message,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ ...emptyForm });
        toast.success('Tour request sent! Check your email for confirmation.');
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        let errMessage =
          'Notification was sent, but saving your request failed. Please contact us directly if the issue persists.';
        try {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) {
            errMessage = payload.error;
          }
        } catch {
          // keep default message
        }
        toast.error(errMessage);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Could not send your message. Please check your connection and try again.';
      toast.error(message.length > 200 ? `${message.slice(0, 197)}…` : message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3c2c]/30 focus:border-[#1e3c2c] transition"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3c2c]/30 focus:border-[#1e3c2c] transition"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3c2c]/30 focus:border-[#1e3c2c] transition resize-none"
          placeholder={
            propertyTitle
              ? `I'm interested in ${propertyTitle}...`
              : "I'd like to schedule a tour for a property..."
          }
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isSuccess}
        className={`w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
          isSuccess
            ? 'bg-[#2d5a3f] text-white'
            : 'bg-[#d4af37] text-[#1e3c2c] hover:bg-[#e6c85c]'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-[#1e3c2c] border-t-transparent rounded-full animate-spin" />
            Sending...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle size={18} aria-hidden="true" />
            Sent Successfully!
          </>
        ) : (
          <>
            <Send size={18} aria-hidden="true" />
            Schedule a Tour
          </>
        )}
      </button>
    </form>
  );
}
