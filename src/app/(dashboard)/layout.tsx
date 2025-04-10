"use client";

// Toaster is now in the root layout
import Navbar from '@/components/shared/Navbar';
// import { redirect } from 'next/navigation';
// import { currentUser } from '@clerk/nextjs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication temporarily disabled until Clerk is configured
  // const user = await currentUser();
  //
  // if (!user) {
  //   redirect('/sign-in');
  // }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {children}
      </main>
      {/* Toaster is now in the root layout */}
    </div>
  );
}
