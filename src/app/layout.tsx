import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from '@/components/providers/AuthProvider';
import { DatabaseProvider } from '@/components/providers/DatabaseProvider';
import { DatabaseInitializer } from '@/components/providers/DatabaseInitializer';
import { ClerkRedirectHandler } from '@/components/auth/CustomClerk';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground`}
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
