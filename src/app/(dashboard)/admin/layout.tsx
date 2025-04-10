"use client";

// Toaster is now in the root layout
import Navbar from '@/components/shared/Navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth');
        const data = await response.json();

        if (!response.ok || !data.authenticated) {
          toast.error('Admin authentication required');
          router.push('/admin/sign-in');
        }
      } catch (error) {
        console.error('Error checking admin authentication:', error);
        toast.error('Authentication error');
        router.push('/admin/sign-in');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <Navbar isAdmin />
          <main className="max-w-7xl mx-auto p-4 md:p-6">
            {children}
          </main>
        </>
      )}
      {/* Toaster is now in the root layout */}
    </div>
  );
}
