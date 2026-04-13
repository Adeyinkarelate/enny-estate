'use client';

import { useState } from 'react';
import PropertyCard from './PropertyCard';
import type { Property, PropertyCategory } from '@/types';

interface PropertyGridProps {
  properties: Property[];
  showFilters?: boolean;
  title?: string;
}

const filterOptions: { label: string; value: PropertyCategory | 'all' }[] = [
  { label: 'All Properties', value: 'all' },
  { label: '🏠 Houses for Rent', value: 'house for renting' },
  { label: '🌿 Land for Sale', value: 'landed properties for sales' },
  { label: '🏢 Apartments for Rent', value: 'apartment for renting' },
  { label: '🏷️ Properties for Sale', value: 'properties for sales' },
];

export default function PropertyGrid({
  properties,
  showFilters = true,
  title,
}: PropertyGridProps) {
  const [activeFilter, setActiveFilter] = useState<PropertyCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const filteredProperties =
    activeFilter === 'all'
      ? properties
      : properties.filter((p) => p.category === activeFilter);

  const handleFilterChange = (filter: PropertyCategory | 'all') => {
    setIsLoading(true);
    setActiveFilter(filter);
    setTimeout(() => setIsLoading(false), 100);
  };

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{title}</h2>
      )}

      {showFilters && (
        <div className="flex flex-wrap gap-3 mb-8">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleFilterChange(option.value)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                activeFilter === option.value
                  ? 'bg-[#1e3c2c] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found in this category.</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for new listings!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
