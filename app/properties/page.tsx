'use client';

import Link from 'next/link';
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { ChevronRight, Map, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeroBanner from '@/components/PageHeroBanner';
import PropertyGrid from '@/components/PropertyGrid';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton';
import type { ApiResponse, Property } from '@/types';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

function parseNumericPrice(price: string): number {
  const digits = price.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

function applySearch(list: Property[], query: string): Property[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return list;
  }
  return list.filter((p) => p.title.toLowerCase().includes(trimmed));
}

function applySort(list: Property[], sort: SortOption): Property[] {
  const next = [...list];
  if (sort === 'newest') {
    return next.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  if (sort === 'price-asc') {
    return next.sort((a, b) => parseNumericPrice(a.price) - parseNumericPrice(b.price));
  }
  return next.sort((a, b) => parseNumericPrice(b.price) - parseNumericPrice(a.price));
}

async function fetchPropertiesFromApi(): Promise<Property[]> {
  const response = await fetch('/api/properties', { cache: 'no-store' });
  const json = (await response.json()) as ApiResponse<Property[]>;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? 'Failed to load properties');
  }

  return json.data;
}

interface PropertiesErrorBoundaryProps {
  children: ReactNode;
}

interface PropertiesErrorBoundaryState {
  hasError: boolean;
}

class PropertiesErrorBoundary extends Component<
  PropertiesErrorBoundaryProps,
  PropertiesErrorBoundaryState
> {
  constructor(props: PropertiesErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): PropertiesErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Properties page error:', error, errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-16">
          <p className="text-lg font-medium text-gray-900 mb-2">Something went wrong</p>
          <p className="text-gray-600 text-center max-w-md mb-6">
            We couldn&apos;t render this page. Please try again.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-3 rounded-full font-semibold transition-all bg-[#1e3c2c] text-white hover:bg-[#2d5a3f]"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PropertiesPageContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewOnMap, setViewOnMap] = useState(false);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPropertiesFromApi();
      setProperties(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load properties';
      setError(message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  const searchAndSorted = useMemo(() => {
    const searched = applySearch(properties, searchQuery);
    return applySort(searched, sortOption);
  }, [properties, searchQuery, sortOption]);

  const listKey = `${searchQuery}-${sortOption}`;

  return (
    <>
      <Navbar />

      <PageHeroBanner
        eyebrow="Our exclusive listings"
        title="Properties"
        subheading="Discover premium homes and investment opportunities."
        titleId="properties-hero-heading"
      />

      <section className="bg-gray-50 py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-[#1e3c2c] transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                <span className="text-gray-900 font-medium">Properties</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <p className="text-gray-700">
              {!loading && !error && (
                <>
                  <span className="font-semibold text-gray-900">{searchAndSorted.length}</span>
                  {searchAndSorted.length === 1 ? ' property' : ' properties'} found
                  {searchQuery.trim() ? (
                    <span className="text-gray-500"> matching &ldquo;{searchQuery.trim()}&rdquo;</span>
                  ) : null}
                </>
              )}
              {loading && <span className="text-gray-500">Loading listings…</span>}
            </p>
            <button
              type="button"
              onClick={() => setViewOnMap((v) => !v)}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all border-2 ${
                viewOnMap
                  ? 'bg-[#1e3c2c] text-white border-[#1e3c2c] hover:bg-[#2d5a3f]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#1e3c2c]/40'
              }`}
              title="Map view is coming soon"
            >
              <Map className="h-5 w-5 shrink-0" aria-hidden />
              {viewOnMap ? 'Hide map' : 'View on Map'}
            </button>
          </div>

          <AnimatePresence>
            {viewOnMap ? (
              <motion.div
                key="map-placeholder"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white p-10 text-center text-gray-600 shadow-md"
              >
                <p className="font-medium text-gray-900">Map view coming soon</p>
                <p className="mt-2 text-sm text-gray-500">
                  We&apos;re preparing an interactive map for all listings.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50/90 px-6 py-10 text-center mb-10">
              <p className="text-lg font-medium text-red-800 mb-2">{error}</p>
              <p className="text-sm text-red-700/90 mb-6">Check your connection and try again.</p>
              <button
                type="button"
                onClick={() => void loadProperties()}
                className="px-6 py-3 rounded-full font-semibold transition-all bg-[#1e3c2c] text-white hover:bg-[#2d5a3f]"
              >
                Retry
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : !error && properties.length === 0 ? (
              <motion.div
                key="empty-api"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="rounded-2xl bg-white shadow-md border border-gray-100 px-8 py-16 text-center"
              >
                <p className="text-xl font-semibold text-gray-900 mb-2">No properties yet</p>
                <p className="text-gray-600 max-w-md mx-auto">
                  Listings will appear here once they are added. Please check back soon.
                </p>
              </motion.div>
            ) : !error && searchAndSorted.length === 0 ? (
              <motion.div
                key="empty-search"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="rounded-2xl bg-white shadow-md border border-gray-100 px-8 py-16 text-center"
              >
                <p className="text-xl font-semibold text-gray-900 mb-2">No matching properties</p>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Try a different search term or clear the search to see all listings.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 rounded-full font-semibold transition-all bg-[#1e3c2c] text-white hover:bg-[#2d5a3f]"
                >
                  Clear search
                </button>
              </motion.div>
            ) : !error ? (
              <motion.div
                className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.aside
                  variants={fadeUp}
                  className="lg:col-span-4 mb-10 lg:mb-0"
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden p-6 space-y-6 sticky top-24">
                    <div>
                      <label htmlFor="property-search" className="block text-sm font-semibold text-gray-900 mb-2">
                        Search by title
                      </label>
                      <div className="relative">
                        <Search
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                          aria-hidden
                        />
                        <input
                          id="property-search"
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="e.g. Lekki, duplex…"
                          className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-[#1e3c2c] focus:outline-none focus:ring-2 focus:ring-[#1e3c2c]/20 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="property-sort" className="block text-sm font-semibold text-gray-900 mb-2">
                        Sort by price
                      </label>
                      <select
                        id="property-sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as SortOption)}
                        className="w-full rounded-xl border border-gray-200 py-3 px-4 text-gray-900 bg-white focus:border-[#1e3c2c] focus:outline-none focus:ring-2 focus:ring-[#1e3c2c]/20 transition-all"
                      >
                        <option value="newest">Newest first</option>
                        <option value="price-asc">Price: low to high</option>
                        <option value="price-desc">Price: high to low</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Use the category buttons below the title to filter by listing type.
                    </p>
                  </div>
                </motion.aside>

                <motion.div key={listKey} variants={fadeUp} className="lg:col-span-8">
                  <PropertyGrid properties={searchAndSorted} showFilters />
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <PropertiesErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PropertiesPageContent />
      </div>
    </PropertiesErrorBoundary>
  );
}
