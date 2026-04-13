import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { inquiries } from '@/lib/schema';

function optionalTrimmedString(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  const s = String(value).trim();
  return s.length > 0 ? s : null;
}

export async function POST(request: NextRequest) {
  try {
    let body: {
      name?: unknown;
      email?: unknown;
      property_id?: unknown;
      message?: unknown;
    };

    try {
      body = (await request.json()) as typeof body;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const name = typeof body.name === 'string' ? body.name.trim() : String(body.name ?? '').trim();
    const email = typeof body.email === 'string' ? body.email.trim() : String(body.email ?? '').trim();
    const message =
      typeof body.message === 'string' ? body.message.trim() : String(body.message ?? '').trim();
    const property_id = optionalTrimmedString(body.property_id);

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(inquiries)
      .values({
        name: name.trim(),
        email: email.trim(),
        propertyId: property_id,
        message: message.trim(),
      })
      .returning({ id: inquiries.id, createdAt: inquiries.createdAt });

    if (!inserted) {
      return NextResponse.json(
        { success: false, error: 'Failed to submit inquiry. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: inserted.id },
      message: 'Inquiry submitted successfully',
    });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminAuthCookie = request.cookies.get('admin_auth');
    const isAuthenticated = adminAuthCookie?.value === 'true';

    if (!isAuthenticated && process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rows = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt))
      .limit(100);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}
