"use client";

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { MockClerkProvider } from '@/lib/clerk-mock';
import { UserSyncProvider } from "./UserSyncProvider";
import { customNavigate } from '@/lib/clerk-config';

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
      // Configure routing with absolute URLs for production
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/verification"
      // Use our custom navigation handler to prevent unwanted redirects
      navigate={customNavigate}

    >
      <UserSyncProvider>
        {children}
      </UserSyncProvider>
    </ClerkProvider>
  );
}
