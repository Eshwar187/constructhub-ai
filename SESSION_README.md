# ConstructHub Session Management

This document provides information about session management in ConstructHub.

## Overview

ConstructHub implements a secure session management system that ensures:

1. User sessions expire after 30 minutes of inactivity
2. All sessions are invalidated when the server restarts
3. Admin and user sessions are managed separately
4. Session tokens are stored securely in HTTP-only cookies

## Session Expiration

### Regular User Sessions (Clerk)

Regular user sessions managed by Clerk are configured to:

- Expire after 30 minutes of inactivity
- Not persist across browser sessions
- Be invalidated on server restart

This is implemented through:
- Clerk's `sessionOptions` with `sessionDuration: 1800` (30 minutes)
- Setting `persistForever: false` to prevent long-term persistence
- Using `cookieOptions` with `maxAge: 1800` to limit cookie lifetime

### Admin Sessions (Custom)

Admin sessions are managed through a custom implementation that:

- Stores session tokens in MongoDB
- Sets an expiration time of 24 hours
- Clears all session tokens on server restart

## Server Restart Behavior

When the server restarts:

1. The `DatabaseInitializer` component automatically calls the `/api/db/startup` endpoint
2. This endpoint clears all session tokens from the database
3. All users (both regular and admin) are required to log in again

## Implementation Details

### Session Clearing on Server Restart

The session clearing process is implemented in:

1. `src/components/providers/DatabaseInitializer.tsx` - Client component that calls the startup API
2. `src/app/api/db/startup/route.ts` - API endpoint that clears all sessions
3. `src/app/layout.tsx` - Includes the DatabaseInitializer component

### Admin Session Management

Admin sessions are managed in:

1. `src/app/api/admin/login/route.ts` - Creates admin sessions
2. `src/app/api/admin/logout/route.ts` - Clears admin sessions
3. `src/app/api/admin/auth/route.ts` - Verifies admin sessions

## Troubleshooting

If users are not being logged out on server restart:

1. Check that the DatabaseInitializer component is properly included in the layout
2. Verify that the `/api/db/startup` endpoint is being called on server startup
3. Check the server logs for any errors during the session clearing process
4. Ensure the MongoDB connection is working correctly

## Security Considerations

This session management approach provides several security benefits:

1. Limited session lifetimes reduce the risk of session hijacking
2. Server restart invalidation prevents persistent unauthorized access
3. Separate admin session management provides defense in depth
4. HTTP-only cookies protect against client-side script access
