import type { NextRequest } from 'next/server';

/**
 * Matches /api/inquiries GET: allow unauthenticated access in development only.
 */
export function isAdminRequestAuthenticated(request: NextRequest): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  return request.cookies.get('admin_auth')?.value === 'true';
}
