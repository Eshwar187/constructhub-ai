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

    // Check if we're on the factor-one page
    const isFactorOnePage = window.location.pathname.includes('/factor-one');
    
    // If we're on the factor-one page and signed in, redirect to the dashboard
    if (isFactorOnePage && isSignedIn) {
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
        // Redirect to the appropriate URL
        router.push(data.redirectUrl);
      } else {
        // If there's an error, redirect to the default dashboard
        console.error('Failed to get redirect URL');
        toast.error('Failed to determine your dashboard. Redirecting to default...');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error during redirect:', error);
      toast.error('An error occurred during redirection');
      router.push('/dashboard');
    }
  };

  // This component doesn't render anything
  return null;
}
