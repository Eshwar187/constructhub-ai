# Clerk Redirect Fix for ConstructHub

This document explains the solution implemented to fix the Clerk authentication redirection issues in ConstructHub, particularly the problem with `__clerk_db_jwt` parameters in URLs.

## Problem

After deploying the application, users were experiencing unwanted redirects when signing in. Specifically:

1. Users were being redirected to localhost with a Clerk DB JWT parameter:
   ```
   http://localhost:3000/?__clerk_db_jwt=dvb_2vd0NW0pbaYB2tjDVocS6AyjGTn
   ```

2. This prevented users from accessing their dashboards after authentication, even though the application was deployed to a production URL.

## Solution

We implemented a comprehensive solution to fix these redirection issues:

### 1. Custom Redirect Handler Page

Created a static HTML page (`public/redirect.html`) that:
- Intercepts any URL with JWT parameters
- Cleans the URL by removing the parameters
- Redirects the user to the appropriate dashboard

### 2. Enhanced Middleware

Updated the middleware to:
- Detect URLs with JWT parameters
- Redirect to our custom redirect handler page
- Handle redirects from Clerk's authentication domain

### 3. Updated AuthProvider

Modified the Clerk AuthProvider to:
- Set `afterSignInUrl` to our custom redirect handler
- Implement a direct navigation handler that forces the correct redirect
- Prevent Clerk from adding JWT parameters to URLs

### 4. Dashboard Page Updates

Updated both the user and admin dashboard pages to:
- Detect and remove JWT parameters from URLs
- Force a clean reload if JWT parameters persist
- Ensure users always land on a clean dashboard URL

## Required Environment Variables

For this fix to work properly in production, you must set the following environment variables in your Vercel deployment:

```
NEXT_PUBLIC_APP_URL=https://your-vercel-deployment-url.vercel.app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Clerk Configuration

In your Clerk dashboard, make sure to:

1. Set the correct redirect URLs:
   - Homepage URL: `https://your-vercel-deployment-url.vercel.app`
   - Sign-in URL: `https://your-vercel-deployment-url.vercel.app/sign-in`
   - Sign-up URL: `https://your-vercel-deployment-url.vercel.app/sign-up`
   - After sign-in URL: `https://your-vercel-deployment-url.vercel.app/redirect.html`
   - After sign-up URL: `https://your-vercel-deployment-url.vercel.app/verification`

2. Add your production domain to the allowed domains list

## Testing

To test the fix:

1. Deploy the application to Vercel
2. Set the required environment variables
3. Sign out completely
4. Sign in as a regular user
   - You should be redirected to the dashboard without any JWT parameters
5. Sign out and sign in as an admin
   - You should be redirected to the admin dashboard without any JWT parameters

## Troubleshooting

If redirection issues persist:

1. Check your browser console for any errors
2. Verify that all environment variables are correctly set in Vercel
3. Make sure your Clerk configuration is correct
4. Clear your browser cookies and cache
5. Try using a different browser or incognito mode
