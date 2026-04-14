import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';
import {
  createPropertyFromForm,
  getAllPropertiesOrdered,
} from '@/lib/properties-queries';
import { propertyFormSchema } from '@/lib/validation';

export async function GET() {
  try {
    const properties = await getAllPropertiesOrdered();
    return NextResponse.json({ success: true, data: properties }, { status: 200 });
  } catch (error) {
    console.error('GET /api/properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequestAuthenticated(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
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

    const property = await createPropertyFromForm({
      title,
      category,
      price,
      description,
      image_url,
      video_url,
    });

    return NextResponse.json({ success: true, data: property }, { status: 200 });
  } catch (error) {
    console.error('POST /api/properties:', error);
    if (error instanceof Error && error.message === 'Invalid price') {
      return NextResponse.json({ success: false, error: 'Invalid price' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'Image is required') {
      return NextResponse.json({ success: false, error: 'Image is required' }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
