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
    // If we're on the root path, redirect to the auth-redirect page
    if (url.pathname === '/') {
      // Create a new URL for the auth-redirect page
      const redirectUrl = new URL('/auth-redirect', url.origin);
      
      // Copy all search parameters
      url.searchParams.forEach((value, key) => {
        redirectUrl.searchParams.set(key, value);
      });
      
      // Return a redirect response
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return undefined;
}
