import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import { deletePropertyById, updatePropertyFromForm } from '@/lib/properties-queries';
import { propertyFormSchema } from '@/lib/validation';

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

    const parsed = propertyFormSchema.safeParse({
      title: typeof body.title === 'string' ? body.title : '',
      category: body.category,
      price: typeof body.price === 'string' ? body.price : '',
      description: typeof body.description === 'string' ? body.description : '',
      image_url: typeof body.image_url === 'string' ? body.image_url : '',
      video_url: typeof body.video_url === 'string' ? body.video_url : '',
    });

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, error: first?.message ?? 'Invalid property data' },
        { status: 400 }
      );
    }

    const { title, category, price, description, image_url, video_url } = parsed.data;

    const property = await updatePropertyFromForm(id, {
      title,
      category,
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
    if (error instanceof Error && error.message === 'Image is required') {
      return NextResponse.json({ success: false, error: 'Image is required' }, { status: 400 });
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
