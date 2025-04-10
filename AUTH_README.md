# ConstructHub Authentication and Redirection

This document provides information about the authentication and redirection flow in ConstructHub.

## Overview

ConstructHub implements a role-based authentication system that:

1. Uses Clerk for regular user authentication
2. Uses a custom authentication system for admin users
3. Redirects users to the appropriate dashboard based on their role
4. Ensures sessions expire after inactivity or server restart

## Authentication Flow

### Regular User Authentication (Clerk)

1. User signs in at `/sign-in` using Clerk authentication
2. After successful authentication, user is redirected to `/api/auth/redirect`
3. The redirect API checks the user's role in the database
4. User is redirected to `/dashboard` (regular user dashboard)

### Admin Authentication (Custom)

1. Admin signs in at `/admin/sign-in` using the custom admin authentication
2. After successful authentication, admin is redirected to `/admin/dashboard`
3. Admin sessions are stored in MongoDB with a 24-hour expiration
4. Admin sessions are cleared on server restart

## Redirection Logic

The redirection logic is implemented in:

1. `src/lib/auth-redirects.ts` - Determines the appropriate redirect URL based on user role
2. `src/app/api/auth/redirect/route.ts` - API endpoint that returns the redirect URL
3. `src/app/api/auth/redirect/page.tsx` - Page that handles the redirection process

The redirection flow works as follows:

1. User signs in successfully
2. Clerk redirects to `/api/auth/redirect`
3. The redirect page fetches the appropriate redirect URL from the API
4. The API checks the user's role in the database
5. The user is redirected to the appropriate dashboard based on their role

## Role-Based Access

- Regular users are redirected to `/dashboard`
- Admin users are redirected to `/admin/dashboard`
- If a user's role cannot be determined, they are redirected to `/dashboard` by default

## Mock Authentication (Development Only)

When using the mock authentication system (enabled by setting `NEXT_PUBLIC_USE_MOCK_AUTH=true`):

1. The mock sign-in component simulates the authentication process
2. After "signing in", it calls the redirect API to determine the appropriate dashboard
3. The user is redirected to the appropriate dashboard based on their role

## Troubleshooting

If users are not being redirected to the correct dashboard:

1. Check that the user's role is correctly set in the database
2. Verify that the redirect API is being called after authentication
3. Check the server logs for any errors during the redirection process
4. Ensure the MongoDB connection is working correctly

## Security Considerations

This redirection approach provides several security benefits:

1. Role-based access control ensures users only access appropriate areas
2. Server-side role verification prevents client-side tampering
3. Separate admin authentication provides defense in depth
4. Redirection logic is centralized for easier maintenance and security updates
