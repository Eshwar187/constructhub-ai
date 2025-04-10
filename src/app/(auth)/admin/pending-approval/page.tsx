'use client';

import { useState } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { useUser as useMockUser } from '@/lib/clerk-mock';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

// This should match the email in the API route
const MAIN_ADMIN_EMAIL = 'jeshwar2009@gmail.com';

export default function PendingApprovalPage(): React.ReactElement {
  // Use either the real Clerk hook or our mock hook based on environment
  const { user, isLoaded } = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'
    ? useMockUser()
    : useClerkUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const requestAdminApproval = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/request', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setIsRequested(true);
        toast.success('Admin approval request sent successfully');
      } else {
        toast.error(data.error || 'Failed to send admin approval request');
      }
    } catch (error) {
      toast.error('An error occurred while sending the admin approval request');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full blur-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-70 animate-pulse"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 relative"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-gray-900 to-black dark:from-purple-900/20 dark:via-gray-900 dark:to-black"></div>
      <div className="fixed inset-0 -z-10 cyberpunk-grid opacity-20"></div>

      {/* Animated background elements */}
      <div className="fixed inset-0 -z-5 opacity-40">
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-500/15 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-500/20 dark:bg-pink-500/15 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 right-10 w-24 h-24 border border-purple-500/20 rounded-full"
        animate={{ y: [0, -15, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-32 h-32 border border-pink-500/20 rounded-full"
        animate={{ y: [0, 15, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-full blur-lg bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-80"></div>
              <div className="relative bg-black dark:bg-gray-900 rounded-full p-4 border-2 border-purple-400 dark:border-purple-500">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#A855F7"/>
                      <stop offset="0.5" stopColor="#EC4899"/>
                      <stop offset="1" stopColor="#A855F7"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </motion.div>
          <h1 className="text-4xl font-extrabold mb-4">
            <span className="text-purple-400 dark:text-purple-400">Admin</span>
            <span className="text-white"> Approval</span>
          </h1>
          <p className="text-gray-300 dark:text-gray-300 max-w-md mx-auto text-lg">
            {isRequested
              ? 'Your request has been submitted for approval'
              : 'Request admin privileges for ConstructHub.ai'}
          </p>
        </div>

        <div className="animated-border">
          <Card className="frosted-glass relative z-10 bg-black/40 dark:bg-gray-900/40 border-2 border-gray-800 dark:border-gray-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold text-white relative"
                >
                  <span className="absolute -inset-1 blur-sm bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg opacity-70"></span>
                  <span className="relative">{isRequested ? 'Request Submitted' : 'Request Access'}</span>
                </motion.div>
              </CardTitle>
              <CardDescription className="text-center text-gray-400 mt-2">
                {isRequested
                  ? 'Your admin approval request has been sent'
                  : 'Request admin approval to access admin features'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {isRequested ? (
                <div className="text-center space-y-4 bg-gray-800/70 rounded-lg p-6 border border-gray-700">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
                    <div className="relative bg-gray-800 rounded-full flex items-center justify-center w-full h-full border border-green-500/30">
                      <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    Your request has been sent to the main admin for approval. You will be notified once your request is approved.
                  </p>
                  <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-800/30 mt-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-gray-300">
                        This process typically takes 24-48 hours to complete.
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/30 mt-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-gray-300">
                        For testing: An email should have been sent to {MAIN_ADMIN_EMAIL} with an approval link.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-800/70 rounded-lg p-6 border border-gray-700">
                    <p className="text-gray-300 mb-2">
                      To become an admin, you need to request approval from the main administrator. This will give you access to:
                    </p>
                    <ul className="space-y-2 mt-4">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-gray-300">User management dashboard</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-gray-300">Project approval and oversight</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-gray-300">System configuration settings</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={requestAdminApproval}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-700/20 transition-all duration-300 hover:shadow-purple-700/40 hover:scale-105 relative overflow-hidden group py-6"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse-slow"></span>
                    <span className="absolute -inset-x-2 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></span>
                    <span className="relative flex items-center justify-center text-lg">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                          </svg>
                          Request Admin Approval
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Link href="/" className="text-gray-400 hover:text-gray-300 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Return to Home
              </Link>
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
              Need help? <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Contact Support</a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
