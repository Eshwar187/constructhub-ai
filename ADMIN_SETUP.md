# Admin Setup Instructions

This document provides instructions for setting up the main admin account for ConstructHub.ai.

## Main Admin Credentials

The main admin account has the following credentials:

- **Email**: eshwar09052005@gmail.com
- **Username**: eshwar2005
- **Password**: Eshwar@005

## Setting Up the Admin Account

The admin account is automatically created when you first log in with the admin credentials. You don't need to run any setup scripts.

Simply:

1. Start the application
2. Go to `/admin/sign-in`
3. Enter the admin credentials listed above

The system will:
- Check if the admin account exists in the database
- If it doesn't exist, create it automatically
- If it exists, verify the credentials and log you in

You can also view the admin credentials by running:

```bash
cd constructhub
node scripts/admin-credentials.js
```

## Admin Authentication

The admin authentication system has been completely separated from the regular user authentication:

1. Admin sessions expire after 24 hours, requiring re-login
2. Admin sessions are not persisted across server restarts
3. Admin authentication is handled through a custom login system, not Clerk

## Accessing the Admin Dashboard

To access the admin dashboard:

1. Go to `/admin/sign-in`
2. Enter the admin credentials (email and password)
3. You will be redirected to the admin dashboard upon successful login

## Security Notes

- The admin account has full access to all user data and projects
- Admin registration has been disabled - only the main admin account can be used
- All admin actions are logged for security purposes
- Admin sessions are stored securely in HTTP-only cookies

## Troubleshooting

If you encounter issues with admin authentication:

1. Make sure the admin account is properly set up in the database
2. Check that the MongoDB connection is working correctly
3. Clear browser cookies and try logging in again
4. If problems persist, check the server logs for authentication errors
