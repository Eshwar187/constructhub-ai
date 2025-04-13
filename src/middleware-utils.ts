import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles Clerk redirects with JWT parameters
 * @param req The Next.js request object
 * @returns A response or undefined if no redirect is needed
 */
export function handleClerkRedirects(req: NextRequest): NextResponse | undefined {
  const url = req.nextUrl.clone();

  // Check if we're on localhost and not already on the fix page
  if (url.hostname === 'localhost' && !url.pathname.includes('localhost-fix.html')) {
    // Redirect to our localhost fix page
    const redirectUrl = new URL('/localhost-fix.html', url.origin);

    // Copy query parameters
    url.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });

    return NextResponse.redirect(redirectUrl);
  }

  // Check if the URL has a Clerk DB JWT parameter
  if (url.searchParams.has('__clerk_db_jwt')) {
    // Redirect to our special redirect handler page
    const redirectUrl = new URL('/redirect.html', url.origin);

    // Return a redirect response to our custom redirect handler
    return NextResponse.redirect(redirectUrl);
  }

  // Check if we're being redirected from Clerk's domain
  const referer = req.headers.get('referer') || '';
  if (referer.includes('accounts.dev') || referer.includes('clerk.')) {
    // Redirect to our special redirect handler page
    const redirectUrl = new URL('/redirect.html', url.origin);
    return NextResponse.redirect(redirectUrl);
  }

  // Check if we're on the root path and have a JWT in the URL
  if (url.pathname === '/' && url.search.includes('jwt')) {
    // Redirect to our special redirect handler page
    const redirectUrl = new URL('/redirect.html', url.origin);
    return NextResponse.redirect(redirectUrl);
  }

  return undefined;
}
