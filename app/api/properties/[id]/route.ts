import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isEmptyOrCloudinaryHttpsUrl } from '@/lib/cloudinary-url';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { deletePropertyById, updatePropertyFromForm } from '@/lib/properties-queries';
import type { PropertyCategory } from '@/types';

const CATEGORIES: PropertyCategory[] = [
  'house for renting',
  'landed properties for sales',
  'apartment for renting',
  'properties for sales',
];

function isPropertyCategory(value: unknown): value is PropertyCategory {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id?.trim()) {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
    }

    let body: {
      title?: unknown;
      category?: unknown;
      price?: unknown;
      description?: unknown;
      image_url?: unknown;
      video_url?: unknown;
    };

    try {
      body = (await request.json()) as typeof body;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const price = typeof body.price === 'string' ? body.price.trim() : '';
    const image_url = typeof body.image_url === 'string' ? body.image_url : '';
    const video_url = typeof body.video_url === 'string' ? body.video_url : '';

    if (!isEmptyOrCloudinaryHttpsUrl(image_url) || !isEmptyOrCloudinaryHttpsUrl(video_url)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Image and video fields must be empty or valid HTTPS Cloudinary URLs (res.cloudinary.com/.../upload/...)',
        },
        { status: 400 }
      );
    }

    if (!title || !description || !price) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and price are required' },
        { status: 400 }
      );
    }

    if (!isPropertyCategory(body.category)) {
      return NextResponse.json(
        { success: false, error: 'Valid category is required' },
        { status: 400 }
      );
    }

    const property = await updatePropertyFromForm(id, {
      title,
      category: body.category,
      price,
      description,
      image_url,
      video_url,
    });

    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: property }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/properties/[id]:', error);
    if (error instanceof Error && error.message === 'Invalid price') {
      return NextResponse.json({ success: false, error: 'Invalid price' }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id?.trim()) {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
    }

    const removed = await deletePropertyById(id);
    if (!removed) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/properties/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
