"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmailAddressPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');

  useEffect(() => {
    // If there's a redirect URL, redirect after a short delay
    if (redirectUrl) {
      const timer = setTimeout(() => {
        router.push(redirectUrl);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [redirectUrl, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Enhanced background elements with 3D depth - using brand colors */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-gray-900 to-black dark:from-blue-900/30 dark:via-gray-900 dark:to-black"></div>
      <div className="fixed inset-0 -z-10 bg-grid-white/[0.03] bg-[length:50px_50px] animate-[pulse_4s_ease-in-out_infinite]"></div>

      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 dark:from-transparent dark:via-gray-900/30 dark:to-gray-900/70 -z-5"></div>

      {/* Enhanced animated background elements with brand colors */}
      <div className="fixed inset-0 -z-5 opacity-40">
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/20 dark:bg-green-500/15 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-500/15 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-full blur-lg bg-gradient-to-r from-green-500 via-blue-500 to-green-500 opacity-80"></div>
              <div className="relative bg-black dark:bg-gray-900 rounded-full p-4 border-2 border-green-400 dark:border-green-500">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#10B981"/>
                      <stop offset="0.5" stopColor="#3B82F6"/>
                      <stop offset="1" stopColor="#10B981"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </motion.div>
          <h1 className="text-4xl font-extrabold mb-4">
            <span className="text-green-400 dark:text-green-400">Email</span>
            <span className="text-white"> Verified</span>
          </h1>
          <p className="text-gray-300 dark:text-gray-300 max-w-md mx-auto text-lg">
            Your email has been successfully verified
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
                  <span className="absolute -inset-1 blur-sm bg-gradient-to-r from-green-500/30 to-blue-500/30 rounded-lg opacity-70"></span>
                  <span className="relative">Success!</span>
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gray-800/70 rounded-lg p-6 border border-gray-700">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
                  <div className="relative bg-gray-800 rounded-full flex items-center justify-center w-full h-full border border-green-500/30">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Thank you for verifying your email address. Your account is now fully activated.
                </p>
                {redirectUrl && (
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm">Redirecting you to the dashboard in a few seconds...</p>
                    <div className="mt-2 relative h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-blue-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4 pb-6">
              <Link href="/sign-in">
                <Button variant="outline" className="border-gray-700 hover:bg-gray-800/50 hover:text-white transition-all duration-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg shadow-green-700/20 transition-all duration-300 hover:shadow-green-700/40 hover:scale-105 relative overflow-hidden group">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-600/20 to-blue-600/20 animate-pulse-slow"></span>
                  <span className="absolute -inset-x-2 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-70"></span>
                  <span className="relative">Go to Dashboard</span>
                </Button>
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
              Need help? <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Contact Support</a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
