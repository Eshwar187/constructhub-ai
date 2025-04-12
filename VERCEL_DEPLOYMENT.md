# Vercel Deployment Guide for ConstructHub.ai

This guide provides instructions for deploying ConstructHub.ai to Vercel and setting up the required environment variables.

## Required Environment Variables

The following environment variables must be set in your Vercel project settings:

### Critical Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_APP_URL` | The URL of your deployed application | `https://constructhub-ai.vercel.app` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/database` |

### Authentication Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook secret |

### API Keys

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Groq AI API key |
| `NEXT_PUBLIC_HUGGINGFACE_API_KEY` | Hugging Face API key |

### Email Service

| Variable | Description |
|----------|-------------|
| `MAILJET_API_KEY` | Mailjet API key |
| `MAILJET_SECRET_KEY` | Mailjet secret key |
| `MAILJET_SENDER_EMAIL` | Sender email address |
| `MAILJET_SENDER_NAME` | Sender name |

## Setting Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project (constructhub-ai)
3. Go to "Settings" > "Environment Variables"
4. Add each variable with its corresponding value
5. Make sure to select all environments (Production, Preview, Development)
6. Save the changes

## Important Notes

- The `NEXT_PUBLIC_APP_URL` variable is critical for proper authentication redirects
- Without this variable, users may be redirected to localhost after signing in
- Make sure to use your actual deployed URL (e.g., `https://constructhub-ai.vercel.app`)
- If you're using a custom domain, use that instead (e.g., `https://constructhub.ai`)

## Troubleshooting

If you experience redirection issues after deployment:

1. Verify that `NEXT_PUBLIC_APP_URL` is correctly set in your Vercel environment variables
2. Make sure the URL matches your actual deployment URL exactly
3. Redeploy your application after setting the environment variables
4. Clear your browser cookies and cache before testing

## Deployment Commands

```bash
# Deploy to Vercel
vercel --prod

# Or link to an existing project and deploy
vercel link
vercel --prod
```
