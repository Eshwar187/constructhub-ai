"use client";

import { Toaster } from 'sonner';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster position="top-right" />
      {children}
    </div>
  );
}
