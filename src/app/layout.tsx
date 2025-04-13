import type { Metadata } from "next";
// Remove Google Fonts dependency to fix deployment issues
// import { Inter, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from '@/components/providers/AuthProvider';
import { DatabaseProvider } from '@/components/providers/DatabaseProvider';
import { DatabaseInitializer } from '@/components/providers/DatabaseInitializer';
import { ClerkRedirectHandler } from '@/components/auth/CustomClerk';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// Define CSS variables for fonts without using Google Fonts
// This ensures the app will work even if Google Fonts is unavailable
const fontVariables = {
  variable: "--font-sans --font-mono",
};

export const metadata: Metadata = {
  title: "ConstructHub.ai - Next-Gen Construction Management",
  description: "AI-powered construction project planning and management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add the fix-redirect script to every page */}
        <script src="/fix-redirect.js" async></script>
      </head>
      <body
        className={`${fontVariables.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider defaultTheme="light">
          <AuthProvider>
            <DatabaseProvider>
              <DatabaseInitializer />
              <ClerkRedirectHandler />
              <Toaster />
              {children}
            </DatabaseProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
