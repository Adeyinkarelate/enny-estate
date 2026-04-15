'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import toast from 'react-hot-toast';
import {
  Calendar,
  Edit,
  Eye,
  Image as ImageIcon,
  Loader2,
  Mail,
  Plus,
  Search,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import PageHeroBanner from '@/components/PageHeroBanner';
import FileUpload from '@/components/ui/FileUpload';
import { propertyFormSchema } from '@/lib/validation';
import type { Inquiry, Property, PropertyCategory, PropertyFormData } from '@/types';

const CATEGORIES: { value: PropertyCategory; label: string }[] = [
  { value: 'house for renting', label: 'House for renting' },
  { value: 'landed properties for sales', label: 'Landed properties for sales' },
  { value: 'apartment for renting', label: 'Apartment for renting' },
  { value: 'properties for sales', label: 'Properties for sales' },
  { value: 'lease and property management', label: 'Lease and property management' },
];

const PAGE_SIZE = 10;

const emptyForm = (): PropertyFormData => ({
  title: '',
  category: 'house for renting',
  price: '',
  description: '',
  image_url: '',
  video_url: '',
});

function parsePriceNumeric(price: string): number {
  const n = parseFloat(price.replace(/[₦,\s]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function formatCreatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

interface InquiryApiRow {
  id: number;
  name: string;
  email: string;
  propertyId: string | null;
  message: string;
  createdAt: string;
}

async function fetchProperties(): Promise<Property[]> {
  const response = await fetch('/api/properties', { cache: 'no-store' });
  const json: { success?: boolean; data?: Property[]; error?: string } = await response.json();
  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? 'Failed to fetch properties');
  }
  return json.data;
}

async function createProperty(data: PropertyFormData): Promise<Property> {
  const response = await fetch('/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      title: data.title,
      category: data.category,
      price: data.price,
      description: data.description,
      image_url: data.image_url,
      video_url: data.video_url,
    }),
  });
  const json: { success?: boolean; data?: Property; error?: string } = await response.json();
  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? 'Failed to create property');
  }
  return json.data;
}

async function updateProperty(id: string, data: PropertyFormData): Promise<Property> {
  const response = await fetch(`/api/properties/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      title: data.title,
      category: data.category,
      price: data.price,
      description: data.description,
      image_url: data.image_url,
      video_url: data.video_url,
    }),
  });
  const json: { success?: boolean; data?: Property; error?: string } = await response.json();
  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? 'Failed to update property');
  }
  return json.data;
}

async function deleteProperty(id: string): Promise<void> {
  const response = await fetch(`/api/properties/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const json: { success?: boolean; error?: string } = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error ?? 'Failed to delete property');
  }
}

async function fetchInquiries(): Promise<Inquiry[]> {
  const response = await fetch('/api/inquiries', {
    cache: 'no-store',
    credentials: 'include',
  });
  const json: { success?: boolean; data?: InquiryApiRow[]; error?: string } = await response.json();
  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? 'Failed to fetch inquiries');
  }
  return json.data.map((row) => ({
    id: String(row.id),
    name: row.name,
    email: row.email,
    property_id: row.propertyId ?? undefined,
    message: row.message,
    created_at: row.createdAt,
  }));
}

type SortField = 'date' | 'price' | 'title';
type SortDir = 'asc' | 'desc';
type DashboardTab = 'properties' | 'inquiries';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PropertyFormData, string>>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);
  /** True while Cloudinary upload is in progress — preview can show before formData has the URL */
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProperties = useCallback(async () => {
    try {
      setLoadingTable(true);
      const data = await fetchProperties();
      setProperties(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setLoadingTable(false);
    }
  }, []);

  const loadInquiries = useCallback(async () => {
    try {
      setLoadingInquiries(true);
      const data = await fetchInquiries();
      setInquiries(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load inquiries');
    } finally {
      setLoadingInquiries(false);
    }
  }, []);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  useEffect(() => {
    void loadInquiries();
  }, [loadInquiries]);

  const filteredSorted = useMemo(() => {
    let list = properties.filter((p) =>
      p.title.toLowerCase().includes(search.trim().toLowerCase())
    );

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'title') {
        cmp = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      } else if (sortField === 'price') {
        cmp = parsePriceNumeric(a.price) - parsePriceNumeric(b.price);
      } else {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [properties, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [search, sortField, sortDir]);

  const totalProperties = properties.length;
  const activeListings = properties.length;
  const totalInquiries = inquiries.length;

  function validateForm(data: PropertyFormData): Partial<Record<keyof PropertyFormData, string>> {
    const result = propertyFormSchema.safeParse({
      title: data.title,
      category: data.category,
      price: data.price,
      description: data.description,
      image_url: data.image_url,
      video_url: data.video_url,
    });

    if (result.success) {
      return {};
    }

    const fieldErrors = result.error.flatten().fieldErrors;
    const errors: Partial<Record<keyof PropertyFormData, string>> = {};
    const keys = [
      'title',
      'category',
      'price',
      'description',
      'image_url',
      'video_url',
    ] as const;
    for (const key of keys) {
      const msgs = fieldErrors[key];
      if (msgs?.[0]) {
        errors[key] = msgs[0];
      }
    }
    return errors;
  }

  function openCreate() {
    setEditingId(null);
    setFormData(emptyForm());
    setFormErrors({});
    setImageUploading(false);
    setVideoUploading(false);
    setFormOpen(true);
  }

  function openEdit(property: Property) {
    setEditingId(property.id);
    setFormData({
      title: property.title,
      category: property.category,
      price: property.price,
      description: property.description,
      image_url: property.image_url,
      video_url: property.video_url,
    });
    setFormErrors({});
    setImageUploading(false);
    setVideoUploading(false);
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);
      const payload: PropertyFormData = {
        ...formData,
        image_url: formData.image_url.trim(),
        video_url: formData.video_url.trim(),
      };
      if (editingId) {
        await updateProperty(editingId, payload);
        toast.success('Property updated successfully');
      } else {
        await createProperty(payload);
        toast.success('Property created successfully');
      }
      setFormOpen(false);
      await loadProperties();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save property');
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }
    try {
      setDeleting(true);
      await deleteProperty(deleteTarget.id);
      toast.success('Property deleted successfully');
      setDeleteTarget(null);
      await loadProperties();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete property');
    } finally {
      setDeleting(false);
    }
  }

  function propertyTitleForInquiry(propertyId: string | undefined): string {
    if (!propertyId) {
      return '—';
    }
    const found = properties.find((p) => p.id === propertyId);
    return found?.title ?? `ID ${propertyId}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeroBanner
        eyebrow="Management dashboard"
        title="Admin Portal"
        subheading="Manage listings, inquiries, and site configuration."
        titleId="admin-hero-heading"
      />
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-4"
        >
          <button
            type="button"
            onClick={() => setActiveTab('properties')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'properties'
                ? 'bg-[#1e3c2c] text-white shadow-md'
                : 'bg-white text-gray-700 shadow-md hover:shadow-xl'
            }`}
          >
            Properties
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'inquiries'
                ? 'bg-[#1e3c2c] text-white shadow-md'
                : 'bg-white text-gray-700 shadow-md hover:shadow-xl'
            }`}
          >
            Inquiries
          </button>
        </motion.div>

        {activeTab === 'properties' && (
          <motion.div variants={fadeUp}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Total Properties', value: totalProperties },
                { label: 'Active Listings', value: activeListings },
                { label: 'Total Inquiries', value: totalInquiries },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden p-6 border border-gray-100"
                >
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-[#1e3c2c]">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-[#1e3c2c] focus:border-transparent outline-none transition-all"
                  aria-label="Search properties by title"
                />
              </div>
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all bg-[#1e3c2c] text-white hover:bg-[#2d5a3f] shadow-md hover:scale-[1.02]"
              >
                <Plus className="w-5 h-5" />
                Add New Property
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <label className="text-sm text-gray-600 font-medium">Sort by</label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="rounded-xl border border-gray-200 px-4 py-2 bg-white shadow-sm text-gray-900"
              >
                <option value="date">Date</option>
                <option value="price">Price</option>
                <option value="title">Title</option>
              </select>
              <select
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value as SortDir)}
                className="rounded-xl border border-gray-200 px-4 py-2 bg-white shadow-sm text-gray-900"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="px-4 py-3 whitespace-nowrap">Image</th>
                      <th className="px-4 py-3 whitespace-nowrap">Title</th>
                      <th className="px-4 py-3 whitespace-nowrap">Category</th>
                      <th className="px-4 py-3 whitespace-nowrap">Price</th>
                      <th className="px-4 py-3 whitespace-nowrap">Created</th>
                      <th className="px-4 py-3 whitespace-nowrap text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loadingTable ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={`sk-${i}`} className="animate-pulse">
                          <td className="px-4 py-4">
                            <div className="h-12 w-16 rounded-lg bg-gray-200" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-4 w-40 bg-gray-200 rounded" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-4 w-28 bg-gray-200 rounded" />
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex gap-2 justify-end">
                              <div className="h-9 w-9 rounded-full bg-gray-200" />
                              <div className="h-9 w-9 rounded-full bg-gray-200" />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : paginated.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                          No properties match your search.
                        </td>
                      </tr>
                    ) : (
                      paginated.map((property) => (
                        <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 align-middle">
                            <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                              {property.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element -- dynamic admin URLs
                                <img
                                  src={property.image_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                            {property.title}
                          </td>
                          <td className="px-4 py-3 text-gray-600 max-w-[180px]">
                            {property.category}
                          </td>
                          <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
                            {property.price}
                          </td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                            {formatCreatedAt(property.created_at)}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => openEdit(property)}
                              className="inline-flex items-center justify-center p-2 rounded-full text-[#1e3c2c] hover:bg-[#1e3c2c]/10 transition-all duration-300"
                              aria-label={`Edit ${property.title}`}
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(property)}
                              className="inline-flex items-center justify-center p-2 rounded-full text-red-600 hover:bg-red-50 transition-all duration-300 ml-1"
                              aria-label={`Delete ${property.title}`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!loadingTable && filteredSorted.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(currentPage * PAGE_SIZE, filteredSorted.length)} of{' '}
                    {filteredSorted.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-white border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-white border border-gray-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'inquiries' && (
          <motion.div variants={fadeUp}>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3 whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingInquiries ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={`inq-sk-${i}`} className="animate-pulse">
                        <td className="px-4 py-4">
                          <div className="h-4 w-28 bg-gray-200 rounded" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-40 bg-gray-200 rounded" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-32 bg-gray-200 rounded" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-full max-w-xs bg-gray-200 rounded" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                        No inquiries yet.
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900 align-top">
                          <span className="inline-flex items-center gap-1">
                            <Eye className="w-4 h-4 text-gray-400 shrink-0" />
                            {inq.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 align-top">
                          <a
                            href={`mailto:${inq.email}`}
                            className="inline-flex items-center gap-1 text-[#1e3c2c] hover:underline"
                          >
                            <Mail className="w-4 h-4 shrink-0" />
                            {inq.email}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-600 align-top max-w-[200px]">
                          {propertyTitleForInquiry(inq.property_id)}
                        </td>
                        <td className="px-4 py-3 text-gray-700 align-top max-w-md whitespace-pre-wrap">
                          {inq.message}
                        </td>
                        <td className="px-4 py-3 text-gray-600 align-top whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatCreatedAt(inq.created_at)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {formOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              !submitting && !imageUploading && !videoUploading && setFormOpen(false)
            }
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="property-form-title"
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <h2 id="property-form-title" className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit property' : 'Add property'}
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    !submitting && !imageUploading && !videoUploading && setFormOpen(false)
                  }
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#1e3c2c] outline-none"
                    disabled={submitting}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        category: e.target.value as PropertyCategory,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#1e3c2c] outline-none bg-white"
                    disabled={submitting}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData((f) => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. 5000000 or ₦5,000,000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#1e3c2c] outline-none"
                    disabled={submitting}
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#1e3c2c] outline-none resize-y"
                    disabled={submitting}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-2">
                    Images upload to Cloudinary when you choose a file (only the URL is stored). JPEG,
                    PNG, WebP, or GIF, max 5 MB.
                  </p>
                  <FileUpload
                    type="image"
                    label="Property image (required)"
                    required
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    maxSize={5}
                    disabled={submitting}
                    currentUrl={formData.image_url.trim() || undefined}
                    onUploadingChange={setImageUploading}
                    onUpload={(url) => {
                      setFormData((f) => ({ ...f, image_url: url }));
                      if (url.trim()) {
                        setFormErrors((prev) => {
                          const next = { ...prev };
                          delete next.image_url;
                          return next;
                        });
                      }
                    }}
                    onRemove={() => setFormData((f) => ({ ...f, image_url: '' }))}
                  />
                  {formErrors.image_url && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.image_url}</p>
                  )}
                </div>

                <div>
                  <p
                    className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-2"
                    role="status"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-gray-500 shrink-0" />
                      <span>
                        Videos upload to Cloudinary when you choose a file. Max{' '}
                        <span className="font-medium">50 MB</span>. Formats: MP4, WebM, MOV.
                      </span>
                    </span>
                  </p>
                  <FileUpload
                    type="video"
                    label="Property video (optional)"
                    accept="video/mp4,video/webm,video/quicktime"
                    maxSize={50}
                    disabled={submitting}
                    currentUrl={formData.video_url.trim() || undefined}
                    onUploadingChange={setVideoUploading}
                    onUpload={(url) => setFormData((f) => ({ ...f, video_url: url }))}
                  />
                  {formErrors.video_url && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.video_url}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting || imageUploading || videoUploading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all bg-[#1e3c2c] text-white hover:bg-[#2d5a3f] disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  {(imageUploading || videoUploading) && (
                    <p className="text-sm text-amber-800 self-center" role="status">
                      Finish uploading media before saving.
                    </p>
                  )}
                  <button
                    type="button"
                    disabled={submitting || imageUploading || videoUploading}
                    onClick={() => setFormOpen(false)}
                    className="px-6 py-3 rounded-full font-semibold border border-gray-200 bg-white hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              role="alertdialog"
              aria-labelledby="delete-title"
              aria-describedby="delete-desc"
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="delete-title" className="text-xl font-bold text-gray-900 mb-2">
                Delete property?
              </h2>
              <p id="delete-desc" className="text-gray-600 mb-6">
                This will permanently remove{' '}
                <span className="font-semibold text-gray-900">{deleteTarget.title}</span>. This
                action cannot be undone.
              </p>
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeleteTarget(null)}
                  className="px-6 py-3 rounded-full font-semibold border border-gray-200 bg-white hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => void confirmDelete()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-all"
                >
                  {deleting && <Loader2 className="w-5 h-5 animate-spin" />}
                  Confirm delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
