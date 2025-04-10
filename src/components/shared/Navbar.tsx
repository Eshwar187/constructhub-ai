'use client';

import { useState } from 'react';
import { UserButton as ClerkUserButton, useUser as useClerkUser } from '@clerk/nextjs';
import { UserButton as MockUserButton, useUser as useMockUser } from '@/lib/clerk-mock';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface NavbarProps {
  isAdmin?: boolean;
}

export default function Navbar({ isAdmin = false }: NavbarProps) {
  // Use either the real Clerk hook or our mock hook based on environment
  const { user } = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'
    ? useMockUser()
    : useClerkUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleAdminLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      toast.success('Logged out successfully');
      router.push('/admin/sign-in');
    } catch (error) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    }
  };

  const navLinks = isAdmin
    ? [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/projects', label: 'Projects' },
        { href: '/admin/settings', label: 'Settings' },
      ]
    : [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/projects', label: 'My Projects' },
        { href: '/profile', label: 'Profile' },
      ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-md border-b border-border/50 py-4 px-6 sticky top-0 z-50 bg-background/90 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href={isAdmin ? '/admin/dashboard' : '/dashboard'}>
          <div className="flex items-center space-x-2">
            <div className="relative mr-3">
              <div className="absolute -inset-2 rounded-full blur-md bg-gradient-to-r from-yellow-500 via-blue-500 to-pink-500 opacity-80"></div>
              <div className="relative bg-black dark:bg-gray-900 rounded-full p-2 border-2 border-yellow-400 dark:border-yellow-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FBBF24"/>
                      <stop offset="0.5" stopColor="#3B82F6"/>
                      <stop offset="1" stopColor="#EC4899"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <span className="text-2xl font-extrabold">
              <span className="text-yellow-400 dark:text-yellow-400">Construct</span>
              <span className="text-blue-500 dark:text-blue-400">Hub</span>
              <span className="text-white">.ai</span>
            </span>
            {isAdmin && (
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full ml-2 shadow-lg shadow-purple-700/20 font-bold border border-pink-500">
                ADMIN
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex space-x-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 relative group overflow-hidden">
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="h-6 w-px bg-border"></div>
            {isAdmin ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAdminLogout}
                className="text-muted-foreground hover:text-foreground hover:bg-red-500/20 flex items-center gap-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            ) : (
              <>
                <span className="text-muted-foreground">{user?.firstName || user?.username}</span>
                {process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' ? (
                  <MockUserButton />
                ) : (
                  <ClerkUserButton />
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background/95 text-foreground border-border backdrop-blur-md">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-blue-500 to-pink-500">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 relative group overflow-hidden border border-transparent hover:border-border transition-all duration-300">
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10">{link.label}</span>
                    </Button>
                  </Link>
                ))}

                {isAdmin && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-red-500/20 relative group overflow-hidden border border-transparent hover:border-red-700/30 transition-all duration-300 mt-4"
                    onClick={() => {
                      setIsOpen(false);
                      handleAdminLogout();
                    }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center gap-2">
                      <LogOut size={16} />
                      Logout
                    </span>
                  </Button>
                )}
                <div className="pt-4 border-t border-gray-700 mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Theme</span>
                    <ThemeToggle />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{user?.firstName || user?.username}</span>
                    {process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' ? (
                      <MockUserButton />
                    ) : (
                      <ClerkUserButton />
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
