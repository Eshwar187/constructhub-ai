# ConstructHub Clerk Authentication and Redirection

This document provides information about the Clerk authentication and redirection flow in ConstructHub.

## Overview

ConstructHub implements a role-based authentication system that:

1. Uses Clerk for regular user authentication
2. Uses a custom authentication system for admin users
3. Redirects users to the appropriate dashboard based on their role
4. Handles multi-factor authentication redirects properly

## Authentication Flow

### Regular User Authentication (Clerk)

1. User signs in at `/sign-in` using Clerk authentication
2. After successful authentication, user is redirected to `/api/auth/redirect`
3. The redirect API checks the user's role in the database
4. User is redirected to `/dashboard` (regular user dashboard)

### Multi-Factor Authentication Handling

To handle Clerk's multi-factor authentication redirects:

1. A custom `/sign-in/factor-one` page is implemented to catch Clerk's factor-one redirects
2. The `ClerkRedirectHandler` component monitors for factor-one pages and redirects to the appropriate dashboard
3. The Clerk configuration uses `signInMode="redirect"` to ensure proper redirection

## Components and Files

The redirection logic is implemented in:

1. `src/components/auth/CustomClerk.tsx` - Handles redirection after authentication
2. `src/app/sign-in/factor-one/page.tsx` - Custom page to handle factor-one redirects
3. `src/lib/auth-redirects.ts` - Determines the appropriate redirect URL based on user role
4. `src/app/api/auth/redirect/route.ts` - API endpoint that returns the redirect URL

## Configuration

The Clerk configuration in `src/components/providers/AuthProvider.tsx` includes:

```tsx
<ClerkProvider
  // Other configuration...
  signInUrl="/sign-in"
  signUpUrl="/sign-up"
  afterSignInUrl="/api/auth/redirect"
  afterSignUpUrl="/verification"
  signInMode="redirect"
>
  {/* ... */}
</ClerkProvider>
```

## Troubleshooting

If users are still being redirected to factor-one pages:

1. Make sure the `ClerkRedirectHandler` component is included in the app layout
2. Verify that the `/sign-in/factor-one` page is properly implemented
3. Check that the middleware allows access to the factor-one page
4. Ensure the Clerk configuration includes `signInMode="redirect"`
5. Clear browser cookies and try signing in again

## Security Considerations

This redirection approach provides several security benefits:

1. Role-based access control ensures users only access appropriate areas
2. Server-side role verification prevents client-side tampering
3. Proper handling of multi-factor authentication maintains security
4. Centralized redirection logic for easier maintenance and security updates
