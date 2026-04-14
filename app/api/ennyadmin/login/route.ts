import { timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function verifyAdminPassword(submitted: string, expected: string): boolean {
  if (!expected) {
    return false;
  }
  if (
    expected.startsWith('$2a$') ||
    expected.startsWith('$2b$') ||
    expected.startsWith('$2y$')
  ) {
    try {
      return bcrypt.compareSync(submitted, expected);
    } catch {
      return false;
    }
  }
  if (submitted.length !== expected.length) {
    return false;
  }
  try {
    return timingSafeEqual(
      Buffer.from(submitted, 'utf8'),
      Buffer.from(expected, 'utf8')
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || typeof adminPassword !== 'string') {
      console.error('POST /api/ennyadmin/login: ADMIN_PASSWORD not configured');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    let body: { password?: unknown };
    try {
      body = (await request.json()) as { password?: unknown };
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const password = typeof body.password === 'string' ? body.password : '';
    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    if (!verifyAdminPassword(password, adminPassword)) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error('POST /api/ennyadmin/login:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
