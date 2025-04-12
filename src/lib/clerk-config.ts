/**
 * This file contains custom configuration for Clerk authentication
 * to handle redirects properly in both development and production environments.
 */

// Get the base URL for the application
export const getBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // For server-side rendering, use environment variable or default
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

// Get the redirect URL for after sign-in
export const getAfterSignInUrl = () => {
  return '/dashboard';
};

// Get the redirect URL for after sign-up
export const getAfterSignUpUrl = () => {
  return '/verification';
};

// Handle Clerk JWT parameter in URL
export const handleClerkJwt = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  // Check if there's a Clerk DB JWT parameter in the URL
  const hasClerkDbJwt = window.location.search.includes('__clerk_db_jwt');
  
  if (hasClerkDbJwt) {
    // Clean the URL by removing the JWT parameter
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    
    // Redirect to dashboard
    window.location.href = `${window.location.origin}/dashboard`;
  }
};

// Custom navigation handler for Clerk
export const customNavigate = (to: string) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return false;
  
  // Check if the URL contains a Clerk JWT parameter
  if (to.includes('__clerk_db_jwt')) {
    // Extract the path without the JWT parameter
    const url = new URL(to, window.location.origin);
    const path = url.pathname;
    
    // Redirect to the appropriate page
    if (path === '/') {
      window.location.href = `${window.location.origin}/dashboard`;
    } else {
      window.location.href = `${window.location.origin}${path}`;
    }
    
    return true;
  }
  
  // For normal navigation, let Clerk handle it
  return false;
};
