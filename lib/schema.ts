import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const propertyTypeEnum = pgEnum('property_type', [
  'house',
  'apartment',
  'duplex',
  'land',
  'commercial',
]);

export const propertyStatusEnum = pgEnum('property_status', [
  'for_sale',
  'for_rent',
  'sold',
  'rented',
]);

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 15, scale: 2 }).notNull(),
  location: text('location').notNull(),
  address: text('address').notNull(),
  bedrooms: integer('bedrooms').notNull().default(0),
  bathrooms: integer('bathrooms').notNull().default(0),
  area: decimal('area', { precision: 10, scale: 2 }).notNull(),
  type: propertyTypeEnum('type').notNull(),
  status: propertyStatusEnum('status').notNull().default('for_sale'),
  featured: boolean('featured').notNull().default(false),
  /** Primary listing image URL(s); app requires at least one Cloudinary image on create/update. */
  images: text('images').array().notNull().default([]),
  videos: text('videos').array().notNull().default([]),
  amenities: text('amenities').array().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  propertyId: text('property_id'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type InquiryRow = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
