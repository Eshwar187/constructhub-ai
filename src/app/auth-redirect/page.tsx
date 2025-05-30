'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function RedirectPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Only proceed when Clerk has loaded the user
    if (!isLoaded) return;

    const handleRedirect = async () => {
      try {
        // If user is not signed in, redirect to home
        if (!isSignedIn) {
          router.push('/');
          return;
        }

        // Check if there's a Clerk DB JWT parameter in the URL
        const hasClerkDbJwt = window.location.search.includes('__clerk_db_jwt');
        if (hasClerkDbJwt) {
          // Remove the JWT parameter from the URL without reloading the page
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }

        // Fetch the appropriate redirect URL from the API using absolute URL
        const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/api/auth/redirect`;
        const response = await fetch(apiUrl);

        if (response.ok) {
          const data = await response.json();
          // Redirect to the appropriate URL
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
      } finally {
        setIsRedirecting(false);
      }
    };

    handleRedirect();
  }, [isLoaded, isSignedIn, router]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        {isRedirecting ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
            <p className="text-gray-400">Taking you to your dashboard</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">Redirection failed</h1>
            <p className="text-gray-400 mb-4">Unable to determine your dashboard</p>
            <button
              onClick={() => router.replace(`${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/dashboard`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
