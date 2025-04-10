import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';


export function useSessionStorage() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Store auth state in sessionStorage when user signs in
    const storeAuthState = async () => {
      if (isSignedIn) {
        try {
          // Get the JWT token
          const token = await getToken();
          
          // Store it in sessionStorage (will be cleared when browser is closed)
          if (token) {
            sessionStorage.setItem('auth-session', 'active');
            sessionStorage.setItem('last-active', new Date().toISOString());
          }
        } catch (error) {
          console.error('Error storing auth state:', error);
        }
      } else {
        // Clear session storage when user signs out
        sessionStorage.removeItem('auth-session');
        sessionStorage.removeItem('last-active');
      }
    };

    storeAuthState();

    // Set up an interval to update the last active timestamp
    const interval = setInterval(() => {
      if (isSignedIn && sessionStorage.getItem('auth-session') === 'active') {
        sessionStorage.setItem('last-active', new Date().toISOString());
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isSignedIn, getToken]);

  return null;
}
