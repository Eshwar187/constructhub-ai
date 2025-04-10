import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // Disable session persistence to require login after server reset
  sessionOptions: {
    sessionDuration: 1800, // 30 minutes
    sessionToken: {
      persistForever: false,
    },
  },
  // Set a very short cookie lifetime to force re-authentication on server restart
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1800, // 30 minutes in seconds
  },
  // Disable session caching to ensure sessions are validated on every request
  clerkJSVariant: 'headless',
  clerkJSVersion: '@latest',
  // Routes that can be accessed while signed out
  publicRoutes: [
    '/',
    '/sign-in',
    '/sign-up',
    '/sign-up/verify-email-address',
    '/verification',
    '/sign-in/factor-one',
    '/auth-redirect',
    '/admin/sign-in',
    '/admin/register',
    '/admin/pending-approval',
    '/admin/approved',
    '/api/db/ping',
    '/api/db/init',
    '/api/db/startup',
    '/api/admin/verify',     // Allow access to admin verification endpoint
    '/api/admin/request',    // Allow access to admin request endpoint
    '/api/admin/login',      // Allow access to admin login endpoint
    '/api/admin/auth',       // Allow access to admin auth check endpoint
    '/api/admin/logout',     // Allow access to admin logout endpoint
    '/api/admin/users',      // Allow access to admin users endpoint
    '/api/admin/users/:id',  // Allow access to admin user operations by ID
    '/api/admin/activities', // Allow access to admin activities endpoint
    '/api/auth/redirect',  // Allow access to auth redirect API
    '/projects/:id',  // Allow access to individual project pages
    '/projects/:path*',  // Allow access to all project routes
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    '/api/webhook',
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
