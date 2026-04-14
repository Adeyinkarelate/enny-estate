import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicAdminRoutes = ['/ennyadmin/login', '/api/ennyadmin/login'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/ennyadmin');
  const isApiAdminRoute = pathname.startsWith('/api/ennyadmin');

  if (publicAdminRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (isAdminRoute || isApiAdminRoute) {
    const adminAuthCookie = request.cookies.get('admin_auth');
    const isAuthenticated = adminAuthCookie?.value === 'true';

    if (!isAuthenticated) {
      if (isAdminRoute) {
        const loginUrl = new URL('/ennyadmin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      return new NextResponse(JSON.stringify({ error: 'Unauthorized access' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ennyadmin/:path*', '/api/ennyadmin/:path*'],
};
