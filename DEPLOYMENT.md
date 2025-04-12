# ConstructHub Deployment Guide

This document provides instructions for deploying the ConstructHub application.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- MongoDB Atlas account (for database)
- Clerk account (for authentication)
- Groq API key (for AI features)
- Mailjet account (for email functionality)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Mailjet
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
MAILJET_SENDER_EMAIL=your_sender_email
MAILJET_SENDER_NAME=ConstructHub

# App URLs
NEXT_PUBLIC_APP_URL=your_app_url
```

## Build and Deployment

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Production Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy the application

### Deployment to Other Platforms

For other platforms like Netlify, Railway, or a custom server:

1. Build the application: `npm run build`
2. Start the server: `npm start`
3. Configure environment variables according to the platform's documentation

## Known Issues and Workarounds

### Dynamic Server Usage Warnings

During the build process, you may see warnings about dynamic server usage. These are expected and won't prevent deployment since we've disabled ESLint and TypeScript checking during the build.

### MongoDB Connection

If you encounter MongoDB connection issues:

1. Make sure your IP address is whitelisted in MongoDB Atlas
2. Check that the connection string is correct
3. Ensure the database user has the correct permissions

### Clerk Authentication

If you encounter Clerk authentication issues:

1. Verify that your Clerk keys are correct
2. Check that the Clerk webhook is properly configured
3. Make sure the redirect URLs are properly set up in the Clerk dashboard

## Post-Deployment Verification

After deploying, verify the following:

1. User registration and login work correctly
2. Admin authentication functions properly
3. Project creation and management work as expected
4. AI-powered floor plan generation is functioning
5. Email verification is working

## Troubleshooting

If you encounter issues during deployment:

1. Check the server logs for error messages
2. Verify all environment variables are correctly set
3. Ensure MongoDB Atlas is accessible from your deployment environment
4. Check that all API keys are valid and have the necessary permissions
