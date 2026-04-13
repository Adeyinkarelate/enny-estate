'use client';

import { MapPin, Eye } from 'lucide-react';
import type { Property, PropertyCategory } from '@/types';

interface PropertyCardProps {
  property: Property;
  onReadMore?: (property: Property) => void;
}

const categoryColors: Record<PropertyCategory, string> = {
  'house for renting': 'bg-blue-100 text-blue-800',
  'landed properties for sales': 'bg-green-100 text-green-800',
  'apartment for renting': 'bg-purple-100 text-purple-800',
  'properties for sales': 'bg-yellow-100 text-yellow-800',
};

const categoryLabels: Record<PropertyCategory, string> = {
  'house for renting': '🏠 House Rent',
  'landed properties for sales': '🌿 Land Sale',
  'apartment for renting': '🏢 Apartment Rent',
  'properties for sales': '🏷️ Properties for Sale',
};

export default function PropertyCard({ property, onReadMore }: PropertyCardProps) {
  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore(property);
    } else {
      alert(
        `🏠 ${property.title}\n\n` +
          `📌 ${categoryLabels[property.category]}\n` +
          `💰 ${property.price}\n\n` +
          `📝 ${property.description}\n\n` +
          `📞 Contact: +234 902 767 7640 to schedule a viewing.`
      );
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={
            property.image_url ||
            'https://placehold.co/600x400/e2e8f0/1e3c2c?text=Property+Image'
          }
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[property.category]}`}
          >
            {categoryLabels[property.category]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mr-1 shrink-0" aria-hidden="true" />
          <span>Lagos, Nigeria</span>
        </div>

        <div className="text-2xl font-bold text-[#1e3c2c] mb-3">{property.price}</div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

        <button
          type="button"
          onClick={handleReadMore}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold bg-[#f3f4f6] text-[#1e3c2c] hover:bg-[#1e3c2c] hover:text-white transition-all duration-300"
        >
          <Eye size={18} aria-hidden="true" />
          Read More
        </button>
      </div>
    </div>
  );
}
