// This script runs on every page load to detect and fix localhost redirects
(function() {
  // Check if we're being redirected to localhost
  if (window.location.hostname === 'localhost' && !window.location.href.includes('localhost-fix.html')) {
    // Redirect to the localhost-fix.html page
    console.log('Detected localhost URL, redirecting to fix page');
    window.location.replace('/localhost-fix.html' + window.location.search);
    return;
  }

  // Check if we have a JWT parameter
  if (window.location.search.includes('__clerk_db_jwt') || window.location.search.includes('jwt')) {
    // Clean the URL by removing JWT parameters
    const cleanUrl = window.location.href.replace(/[?&]__clerk_db_jwt=[^&]+/g, '');

    // If we're on the root path, redirect to dashboard
    if (window.location.pathname === '/') {
      window.location.replace(window.location.origin + '/dashboard');
    } else {
      // Otherwise just clean the URL
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }
})();
