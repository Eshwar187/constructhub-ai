'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Hero from '@/components/home/Hero';

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    // Only proceed when Clerk has loaded the user
    if (!isLoaded) return;

    // Check if there's a Clerk DB JWT parameter in the URL
    const hasClerkDbJwt = window.location.search.includes('__clerk_db_jwt');

    if (hasClerkDbJwt) {
      // Clean the URL by removing the JWT parameter
      const cleanUrl = window.location.origin + '/dashboard';

      // Redirect to dashboard directly
      window.location.href = cleanUrl;
      return;
    }

    // If user is signed in and on the home page, redirect to dashboard
    if (isSignedIn && window.location.pathname === '/') {
      router.replace('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen bg-gray-900">
      <main>
        <Hero />
      </main>
    </div>
  );
}
