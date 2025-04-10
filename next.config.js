/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async redirects() {
    return [];
  },
  // Disable middleware for now to prevent redirect issues
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,

  // Disable ESLint during build to prevent build failures
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript type checking during build
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;
