# ConstructHub Admin System

This document provides information about the admin system in ConstructHub.

## Admin Credentials

There is only one admin account with the following credentials:

- **Email**: eshwar09052005@gmail.com
- **Username**: eshwar2005
- **Password**: Eshwar@005

## Admin Authentication

The admin authentication system is completely separate from the regular user authentication:

1. Admin sessions expire after 24 hours, requiring re-login
2. Admin sessions are not persisted across server restarts
3. Admin authentication is handled through a custom login system, not Clerk

## Admin Dashboard

The admin dashboard provides:

1. Overview of users and projects
2. User management (view and delete users)
3. Project management
4. Admin activity logs

### User Deletion

Only the main admin (eshwar09052005@gmail.com) can delete users. The main admin account cannot be deleted.

## Admin Activities

All admin actions are logged in the MongoDB database in the `adminactivities` collection. This includes:

- Login/logout events
- User data access
- Project data access
- Other administrative actions

## Security Features

1. Only the main admin account can access the admin dashboard
2. Admin registration has been disabled
3. All admin activities are logged with IP addresses
4. Admin sessions are stored securely in HTTP-only cookies
5. Sessions expire after 24 hours or on server restart

## MongoDB Collections

The system uses the following MongoDB collections:

1. `users` - Stores user data including the admin account
2. `projects` - Stores project data
3. `adminactivities` - Logs all admin activities
4. `adminverifications` - Used for admin verification (not active)

## Accessing the Admin Dashboard

To access the admin dashboard:

1. Go to `/admin/sign-in`
2. Enter the admin credentials (email and password)
3. You will be redirected to the admin dashboard upon successful login

## Troubleshooting

If you encounter issues with admin authentication:

1. Make sure the MongoDB connection is working correctly
2. Clear browser cookies and try logging in again
3. Check the server logs for authentication errors
