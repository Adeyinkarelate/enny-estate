import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { properties as propertiesTable } from '@/lib/schema';
import type { Property as DbProperty } from '@/lib/schema';
import type { Property, PropertyCategory } from '@/types';

function mapDbPropertyToProperty(row: DbProperty): Property {
  let category: PropertyCategory;
  if (row.type === 'land') {
    category = 'landed properties for sales';
  } else if (row.type === 'apartment') {
    category = 'apartment for renting';
  } else if (row.type === 'commercial' && row.status === 'for_sale') {
    category = 'properties for sales';
  } else {
    category = 'house for renting';
  }

  const price = `₦${Number(row.price).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

  const image_url = row.images?.[0] ?? '';
  const video_url = row.videos?.[0] ?? '';

  return {
    id: String(row.id),
    title: row.title,
    category,
    price,
    description: row.description,
    image_url,
    video_url,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

export async function getAllPropertiesOrdered(): Promise<Property[]> {
  try {
    const rows = await db
      .select()
      .from(propertiesTable)
      .orderBy(desc(propertiesTable.createdAt));
    return rows.map(mapDbPropertyToProperty);
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    throw error;
  }
}

export async function getLatestProperties(limitCount: number): Promise<Property[]> {
  try {
    const rows = await db
      .select()
      .from(propertiesTable)
      .orderBy(desc(propertiesTable.createdAt))
      .limit(limitCount);
    return rows.map(mapDbPropertyToProperty);
  } catch (error) {
    console.error('Failed to fetch latest properties:', error);
    throw error;
  }
}

function categoryToDbFields(category: PropertyCategory): {
  type: DbProperty['type'];
  status: DbProperty['status'];
} {
  if (category === 'landed properties for sales') {
    return { type: 'land', status: 'for_sale' };
  }
  if (category === 'apartment for renting') {
    return { type: 'apartment', status: 'for_rent' };
  }
  if (category === 'properties for sales') {
    return { type: 'commercial', status: 'for_sale' };
  }
  return { type: 'house', status: 'for_rent' };
}

export function parsePriceToDecimal(priceInput: string): string {
  const cleaned = priceInput.replace(/[₦,\s]/g, '').trim();
  const n = parseFloat(cleaned);
  if (Number.isNaN(n) || n < 0) {
    throw new Error('Invalid price');
  }
  return n.toFixed(2);
}

export async function createPropertyFromForm(input: {
  title: string;
  category: PropertyCategory;
  price: string;
  description: string;
  image_url: string;
  video_url: string;
}): Promise<Property> {
  try {
    if (!input.image_url.trim()) {
      throw new Error('Image is required');
    }

    const { type, status } = categoryToDbFields(input.category);
    const priceDecimal = parsePriceToDecimal(input.price);
    const images = [input.image_url.trim()];
    const videos = input.video_url.trim() ? [input.video_url.trim()] : [];

    const [row] = await db
      .insert(propertiesTable)
      .values({
        title: input.title.trim(),
        description: input.description.trim(),
        price: priceDecimal,
        location: 'Nigeria',
        address: 'Contact for details',
        bedrooms: 0,
        bathrooms: 0,
        area: '0',
        type,
        status,
        featured: false,
        images,
        videos,
        amenities: [],
      })
      .returning();

    if (!row) {
      throw new Error('Failed to create property');
    }
    return mapDbPropertyToProperty(row);
  } catch (error) {
    console.error('Failed to create property:', error);
    throw error;
  }
}

export async function updatePropertyFromForm(
  id: string,
  input: {
    title: string;
    category: PropertyCategory;
    price: string;
    description: string;
    image_url: string;
    video_url: string;
  }
): Promise<Property | null> {
  try {
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      return null;
    }

    if (!input.image_url.trim()) {
      throw new Error('Image is required');
    }

    const { type, status } = categoryToDbFields(input.category);
    const priceDecimal = parsePriceToDecimal(input.price);
    const images = [input.image_url.trim()];
    const videos = input.video_url.trim() ? [input.video_url.trim()] : [];

    const [row] = await db
      .update(propertiesTable)
      .set({
        title: input.title.trim(),
        description: input.description.trim(),
        price: priceDecimal,
        type,
        status,
        images,
        videos,
        updatedAt: new Date(),
      })
      .where(eq(propertiesTable.id, numericId))
      .returning();

    if (!row) {
      return null;
    }
    return mapDbPropertyToProperty(row);
  } catch (error) {
    console.error('Failed to update property:', error);
    throw error;
  }
}

export async function deletePropertyById(id: string): Promise<boolean> {
  try {
    const numericId = parseInt(id, 10);
    if (Number.isNaN(numericId)) {
      return false;
    }
    const deleted = await db
      .delete(propertiesTable)
      .where(eq(propertiesTable.id, numericId))
      .returning({ id: propertiesTable.id });
    return deleted.length > 0;
  } catch (error) {
    console.error('Failed to delete property:', error);
    throw error;
  }
}
