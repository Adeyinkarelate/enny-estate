import type { LucideIcon } from 'lucide-react';

export interface NavLinkItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface Property {
  id: string;
  title: string;
  category: 'house for renting' | 'landed properties for sales' | 'apartment for renting' | 'properties for sales';
  price: string;
  description: string;
  image_url: string;
  video_url: string;
  created_at: string;
  updated_at: string;
}

export type PropertyCategory = Property['category'];

export interface PropertyFormData {
  id?: string;
  title: string;
  category: PropertyCategory;
  price: string;
  description: string;
  image_url: string;
  video_url: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  property_id?: string;
  message: string;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Admin media upload success payload */
export interface AdminMediaUrlPayload {
  url: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

export interface SendTourRequestParams {
  clientName: string;
  clientEmail: string;
  propertyTitle?: string;
  message: string;
}

export interface SendClientConfirmationEmailParams {
  clientName: string;
  clientEmail: string;
  propertyTitle?: string;
}

export interface EmailjsSendSuccess {
  success: true;
  response: { text: string; status: number };
}

export interface EmailjsSendFailure {
  success: false;
  error: unknown;
}

export type EmailjsSendResult = EmailjsSendSuccess | EmailjsSendFailure;

export interface AboutTeamMember {
  name: string;
  role: string;
  imageUrl: string;
  imageAlt: string;
}

export interface AdminLoginApiResponse {
  success: boolean;
  error?: string;
}

/** Response shape from Cloudinary unsigned upload API (browser → Cloudinary). */
export interface CloudinaryUploadApiResponse {
  secure_url?: string;
  error?: { message?: string };
}

export interface PageHeroBannerProps {
  eyebrow: string;
  title: string;
  subheading: string;
  /** Sets `id` on the H1 for `aria-labelledby` on the section */
  titleId: string;
}
