'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

/**
 * This component handles redirection after Clerk authentication
 * It should be included in the layout to run on every page
 */
export function ClerkRedirectHandler() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    // Only proceed when Clerk has loaded the user
    if (!isLoaded) return;

    // Check if we're on a sign-in related page that should be skipped
    const isAuthPage = window.location.pathname.includes('/sign-in') ||
                       window.location.pathname.includes('/sign-up') ||
                       window.location.pathname.includes('/verification');

    // Skip redirection on auth pages
    if (isAuthPage) return;

    // Check if we're on the factor-one page or have a Clerk DB JWT parameter
    const isFactorOnePage = window.location.pathname.includes('/factor-one');
    const hasClerkDbJwt = window.location.search.includes('__clerk_db_jwt');

    // If we're on the factor-one page or have a Clerk DB JWT parameter and are signed in, redirect to the dashboard
    if ((isFactorOnePage || hasClerkDbJwt) && isSignedIn) {
      handleRedirect();
    }

    // If we're on the root page with a Clerk DB JWT parameter, we need to redirect
    if (window.location.pathname === '/' && hasClerkDbJwt && isSignedIn) {
      // Remove the JWT parameter from the URL without reloading the page
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      // Redirect to the appropriate dashboard
      handleRedirect();
    }
  }, [isLoaded, isSignedIn, router]);

  const handleRedirect = async () => {
    try {
      // If user is not signed in, don't redirect
      if (!isSignedIn) return;

      // Get the JWT token to ensure we're authenticated
      const token = await getToken();
      if (!token) return;

      // Fetch the appropriate redirect URL from the API
      const response = await fetch('/api/auth/redirect');

      if (response.ok) {
        const data = await response.json();
        // Redirect to the appropriate URL using replace to prevent back button issues
        router.replace(data.redirectUrl);
      } else {
        // If there's an error, redirect to the default dashboard
        console.error('Failed to get redirect URL');
        toast.error('Failed to determine your dashboard. Redirecting to default...');
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Error during redirect:', error);
      toast.error('An error occurred during redirection');
      router.replace('/dashboard');
    }
  };

  // This component doesn't render anything
  return null;
}
