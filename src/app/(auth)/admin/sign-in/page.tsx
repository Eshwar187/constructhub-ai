"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminSignInPage(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      toast.success('Signed in successfully');
      // Use replace instead of push for a cleaner navigation experience
      router.replace('/admin/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
      <div className="fixed inset-0 -z-10 cyberpunk-grid"></div>
      <div className="fixed top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[100px]"></div>
      <div className="fixed bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]"></div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 right-10 w-24 h-24 border border-purple-500/20 rounded-full"
        animate={{ y: [0, -15, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-32 h-32 border border-blue-500/20 rounded-full"
        animate={{ y: [0, 15, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <div className="animated-border mb-8">
          <Card className="frosted-glass relative z-10">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full blur-sm bg-gradient-to-r from-purple-600 to-blue-600 opacity-75"></div>
                  <div className="relative bg-black rounded-full p-3 border border-gray-800">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7ZM20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z" fill="url(#paint0_linear)"/>
                      <defs>
                        <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#8B5CF6"/>
                          <stop offset="1" stopColor="#3B82F6"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              <CardTitle className="text-center">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 animate-gradient-text neon-purple"
                >
                  Admin Sign In
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="bg-gray-800/70 border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-gray-800/70 border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-purple-700/20 transition-all duration-300 hover:shadow-purple-700/40"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <p className="text-sm text-gray-400">
                Contact the main administrator for admin access.
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-gray-400">
              <Link href="/" className="text-gray-400 hover:text-gray-300 transition-colors">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back to Home
                </span>
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
