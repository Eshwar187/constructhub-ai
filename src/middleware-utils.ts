import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles Clerk redirects with JWT parameters
 * @param req The Next.js request object
 * @returns A response or undefined if no redirect is needed
 */
export function handleClerkRedirects(req: NextRequest): NextResponse | undefined {
  const url = req.nextUrl.clone();

  // Check if the URL has a Clerk DB JWT parameter
  if (url.searchParams.has('__clerk_db_jwt')) {
    // Create a clean URL without the JWT parameter
    const cleanUrl = new URL('/dashboard', url.origin);

    // Return a redirect response directly to the dashboard
    return NextResponse.redirect(cleanUrl);
  }

  // Check if we're being redirected to localhost from Clerk
  const referer = req.headers.get('referer') || '';
  if (referer.includes('accounts.dev') && url.pathname === '/') {
    // Redirect to dashboard
    const dashboardUrl = new URL('/dashboard', url.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  return undefined;
}
