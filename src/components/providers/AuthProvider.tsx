"use client";

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { MockClerkProvider } from '@/lib/clerk-mock';
import { UserSyncProvider } from "./UserSyncProvider";

// Check if we're using mock auth
const useMockAuth = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' ||
                   !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
                   process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'placeholder';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use mock provider if configured to do so
  if (useMockAuth) {
    return (
      <MockClerkProvider>
        <UserSyncProvider>
          {children}
        </UserSyncProvider>
      </MockClerkProvider>
    );
  }

  // Otherwise use the real Clerk provider with custom paths
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        layout: {
          termsPageUrl: "https://clerk.com/terms",
          privacyPageUrl: "https://clerk.com/privacy",
        },
      }}
      // Configure routing
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/auth-redirect"
      afterSignUpUrl="/verification"
      // Disable multi-factor authentication redirects
      signInMode="redirect"

    >
      <UserSyncProvider>
        {children}
      </UserSyncProvider>
    </ClerkProvider>
  );
}
