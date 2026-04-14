import { z } from 'zod';
import { isEmptyOrCloudinaryHttpsUrl, isNonEmptyCloudinaryHttpsUrl } from '@/lib/cloudinary-url';
import type { PropertyCategory } from '@/types';

const PROPERTY_CATEGORIES: [PropertyCategory, ...PropertyCategory[]] = [
  'house for renting',
  'landed properties for sales',
  'apartment for renting',
  'properties for sales',
];

export const propertyFormSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  category: z.enum(PROPERTY_CATEGORIES),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine((val) => {
      const cleaned = val.replace(/[₦,\s]/g, '').trim();
      const n = parseFloat(cleaned);
      return !Number.isNaN(n) && n >= 0;
    }, 'Enter a valid price'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(5000),
  image_url: z
    .string()
    .trim()
    .min(1, 'Image is required')
    .refine((val) => isNonEmptyCloudinaryHttpsUrl(val), {
      message: 'Image must be a valid HTTPS Cloudinary URL (res.cloudinary.com/.../upload/...)',
    }),
  video_url: z
    .string()
    .trim()
    .refine((val) => isEmptyOrCloudinaryHttpsUrl(val), {
      message: 'Video must be empty or a valid HTTPS Cloudinary URL',
    }),
});

export type PropertyFormValidated = z.infer<typeof propertyFormSchema>;
