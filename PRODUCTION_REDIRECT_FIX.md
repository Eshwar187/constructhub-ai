# ConstructHub Production Redirect Fix

This document explains the changes made to fix the authentication redirection issues in ConstructHub when deployed to production environments like Vercel.

## Problem

After deploying the application to Vercel, users were experiencing unwanted redirects when signing in. Specifically:

1. Users were being redirected to localhost with a Clerk DB JWT parameter:
   ```
   http://localhost:3000/?__clerk_db_jwt=dvb_2vPtWzNJYc9z9lyxLHrMOjMWmXl
   ```

2. This prevented users from accessing their dashboards after authentication, even though the application was deployed to a production URL.

## Solution

We implemented a comprehensive solution to fix these redirection issues by using absolute URLs throughout the authentication flow:

### 1. Updated Clerk Configuration

The `AuthProvider` component was updated to:

- Use absolute URLs with the `NEXT_PUBLIC_APP_URL` environment variable
- Disable Clerk's default navigation behavior with `navigate={(to) => false}`
- Ensure consistent behavior across development and production environments

### 2. Enhanced Redirect Handling

All redirect pages and components were updated to:

- Use absolute URLs for API calls and redirects
- Remove JWT parameters from URLs without page reloads
- Use `router.replace()` instead of `router.push()` to prevent back-button issues

### 3. Custom Middleware

The middleware was enhanced to:

- Intercept requests with the `__clerk_db_jwt` parameter
- Always redirect to the auth-redirect page when a JWT parameter is detected
- Remove the JWT parameter from the URL

## Environment Variables

For this fix to work properly, you must set the following environment variable in your Vercel deployment:

```
NEXT_PUBLIC_APP_URL=https://your-vercel-deployment-url.vercel.app
```

Replace `https://your-vercel-deployment-url.vercel.app` with your actual Vercel deployment URL.

## How It Works

1. When a user signs in, Clerk may add a `__clerk_db_jwt` parameter to the URL
2. Our middleware detects this parameter and redirects to the `/auth-redirect` page
3. The `/auth-redirect` page removes the parameter and fetches the appropriate dashboard URL using an absolute URL
4. The user is redirected to their dashboard based on their role

## Testing

To test the fix:

1. Deploy the application to Vercel
2. Set the `NEXT_PUBLIC_APP_URL` environment variable in Vercel
3. Sign out completely
4. Sign in as a regular user
   - You should be redirected to the dashboard on your Vercel deployment
5. Sign out and sign in as an admin
   - You should be redirected to the admin dashboard on your Vercel deployment

## Troubleshooting

If redirection issues persist:

1. Verify that the `NEXT_PUBLIC_APP_URL` environment variable is correctly set in Vercel
2. Clear your browser cookies and cache
3. Check the browser console for any errors
4. Ensure that Clerk is properly configured in your Vercel deployment

## Technical Details

The key files modified to fix this issue:

1. `src/components/providers/AuthProvider.tsx` - Updated to use absolute URLs
2. `src/components/auth/CustomClerk.tsx` - Enhanced to handle absolute URLs
3. `src/app/auth-redirect/page.tsx` - Updated to use absolute URLs
4. `src/app/sign-in/factor-one/page.tsx` - Updated to use absolute URLs
5. `src/middleware-utils.ts` - Enhanced to handle JWT parameters more robustly
6. `src/middleware.ts` - Updated to use the enhanced redirect handling
