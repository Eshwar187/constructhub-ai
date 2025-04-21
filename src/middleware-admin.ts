import { NextRequest, NextResponse } from 'next/server';

/**
 * Custom middleware to handle admin authentication
 * This is used in addition to Clerk's auth middleware
 */
export function adminMiddleware(req: NextRequest) {
  // Only run this middleware for admin dashboard routes
  if (!req.nextUrl.pathname.startsWith('/admin/dashboard')) {
    return NextResponse.next();
  }

  // Check for the admin_authenticated cookie
  const adminAuthenticated = req.cookies.get('admin_authenticated')?.value === 'true';

  // If the admin is not authenticated, redirect to the admin sign-in page
  if (!adminAuthenticated) {
    console.log('Admin not authenticated, redirecting to admin sign-in');
    return NextResponse.redirect(new URL('/admin/sign-in', req.url));
  }

  // Admin is authenticated, proceed to the admin dashboard
  return NextResponse.next();
}
