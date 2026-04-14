'use client';

import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { X, MapPin, Phone, Mail, Calendar, Share2, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { Property, PropertyCategory } from '@/types';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryLabels: Record<PropertyCategory, string> = {
  'house for renting': '🏠 House for Rent',
  'landed properties for sales': '🌿 Land for Sale',
  'apartment for renting': '🏢 Apartment for Rent',
  'properties for sales': '🏷️ Property for Sale',
};

const categoryColors: Record<PropertyCategory, string> = {
  'house for renting': 'bg-blue-100 text-blue-800',
  'landed properties for sales': 'bg-green-100 text-green-800',
  'apartment for renting': 'bg-purple-100 text-purple-800',
  'properties for sales': 'bg-yellow-100 text-yellow-800',
};

export default function PropertyDetailModal({
  property,
  isOpen,
  onClose,
}: PropertyDetailModalProps): ReactElement | null {
  const [activeTab, setActiveTab] = useState<'details' | 'video'>('details');

  const handleClose = useCallback(() => {
    setActiveTab('details');
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  if (!property) {
    return null;
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out ${property.title} at Enny Estate!`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} - ${shareUrl}`)}`,
  };

  const hasVideo = Boolean(property.video_url && property.video_url.trim() !== '');

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="property-modal-title"
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 z-0 bg-black/70 backdrop-blur-sm cursor-default"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-4 sm:px-6 py-4 flex justify-between items-center gap-3 shrink-0">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[property.category]}`}
              >
                {categoryLabels[property.category]}
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 shrink-0"
                aria-label="Close"
              >
                <X size={24} className="text-gray-800" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 min-h-0">
              <div className="relative h-64 sm:h-80 md:h-96 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- dynamic property URL from API */}
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {hasVideo && (
                  <div className="absolute bottom-4 right-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('video')}
                      className="flex items-center gap-2 px-4 py-2 bg-black/70 text-white rounded-full hover:bg-black/85 transition-all duration-300 hover:scale-[1.02] text-sm font-medium"
                    >
                      <Video size={18} aria-hidden="true" />
                      Watch Video Tour
                    </button>
                  </div>
                )}
              </div>

              {hasVideo && (
                <div className="flex border-b border-gray-200 px-4 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`py-3 px-4 font-medium transition-all duration-300 ${
                      activeTab === 'details'
                        ? 'text-green-900 border-b-2 border-green-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Property Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('video')}
                    className={`py-3 px-4 font-medium transition-all duration-300 ${
                      activeTab === 'video'
                        ? 'text-green-900 border-b-2 border-green-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Video Tour
                  </button>
                </div>
              )}

              <div className="p-4 sm:p-6">
                {activeTab === 'details' ? (
                  <div className="space-y-6">
                    <div>
                      <h2
                        id="property-modal-title"
                        className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                      >
                        {property.title}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MapPin size={16} aria-hidden="true" />
                        <span>Lagos, Nigeria</span>
                      </div>
                      <p className="text-3xl md:text-4xl font-bold text-green-900 mt-4">
                        {property.price}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Description</h3>
                      <div className="bg-gray-50 rounded-xl p-5">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {property.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl mb-1" aria-hidden="true">
                          🏠
                        </div>
                        <div className="text-xs text-gray-500">Property Type</div>
                        <div className="font-semibold text-sm text-gray-900">
                          {categoryLabels[property.category]}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl mb-1" aria-hidden="true">
                          📍
                        </div>
                        <div className="text-xs text-gray-500">Location</div>
                        <div className="font-semibold text-sm text-gray-900">Lagos, Nigeria</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl mb-1" aria-hidden="true">
                          📅
                        </div>
                        <div className="text-xs text-gray-500">Listed</div>
                        <div className="font-semibold text-sm text-gray-900">
                          {new Date(property.created_at).toLocaleDateString('en-NG')}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl mb-1" aria-hidden="true">
                          🔑
                        </div>
                        <div className="text-xs text-gray-500">Status</div>
                        <div className="font-semibold text-sm text-green-700">Available</div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Interested in this property?
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href="/contact"
                          onClick={handleClose}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-900 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition-all duration-300 hover:scale-[1.02]"
                        >
                          <Calendar size={18} aria-hidden="true" />
                          Schedule a Tour
                        </Link>
                        <a
                          href="tel:+2349027677640"
                          className="flex-1 flex items-center justify-center gap-2 border-2 border-green-900 text-green-900 py-3 rounded-xl font-semibold hover:bg-green-900 hover:text-white transition-all duration-300"
                        >
                          <Phone size={18} aria-hidden="true" />
                          Call Now
                        </a>
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-green-900 shrink-0" aria-hidden="true" />
                            <span>+234 902 767 7640</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-green-900 shrink-0" aria-hidden="true" />
                            <span>hello@ennyestate.ng</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Share2 size={18} className="text-gray-500 shrink-0" aria-hidden="true" />
                            <span className="text-sm">Share this property</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={shareLinks.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#1877f2] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all duration-300"
                            >
                              Facebook
                            </a>
                            <a
                              href={shareLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all duration-300"
                            >
                              X
                            </a>
                            <a
                              href={shareLinks.whatsapp}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#25d366] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all duration-300"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden bg-black">
                      <video
                        src={property.video_url}
                        controls
                        playsInline
                        className="w-full rounded-xl max-h-[60vh]"
                        poster={property.image_url}
                      />
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      Take a virtual tour of this beautiful property
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
