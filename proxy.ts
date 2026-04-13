import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicAdminRoutes = ['/admin/login', '/api/admin/login'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isApiAdminRoute = pathname.startsWith('/api/admin');

  if (publicAdminRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (isAdminRoute || isApiAdminRoute) {
    const adminAuthCookie = request.cookies.get('admin_auth');
    const isAuthenticated = adminAuthCookie?.value === 'true';

    if (!isAuthenticated) {
      if (isAdminRoute) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      return new NextResponse(JSON.stringify({ error: 'Unauthorized access' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
