"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminApprovedPage(): React.ReactElement {
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
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-500/20 dark:bg-green-500/15 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Success animation */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-5 opacity-20"
        animate={{ y: [-10, 10, -10], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="paint0_linear" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A855F7"/>
              <stop offset="1" stopColor="#22C55E"/>
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

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
              <div className="absolute -inset-3 rounded-full blur-lg bg-gradient-to-r from-purple-500 via-green-500 to-purple-500 opacity-80"></div>
              <div className="relative bg-black dark:bg-gray-900 rounded-full p-4 border-2 border-purple-400 dark:border-purple-500">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#A855F7"/>
                      <stop offset="1" stopColor="#22C55E"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </motion.div>
          <h1 className="text-4xl font-extrabold mb-4">
            <span className="text-purple-400 dark:text-purple-400">Admin</span>
            <span className="text-white"> Approved</span>
          </h1>
          <p className="text-gray-300 dark:text-gray-300 max-w-md mx-auto text-lg">
            Your admin privileges have been successfully activated
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
                  <span className="absolute -inset-1 blur-sm bg-gradient-to-r from-purple-500/30 to-green-500/30 rounded-lg opacity-70"></span>
                  <span className="relative">Success!</span>
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6 p-6">
              <div className="bg-gray-800/70 rounded-lg p-6 border border-gray-700">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
                  <div className="relative bg-gray-800 rounded-full flex items-center justify-center w-full h-full border border-green-500/30">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  The admin registration has been approved successfully. You can now access the admin dashboard and manage the platform.
                </p>
              </div>

              <Link href="/admin/dashboard" className="block w-full">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white shadow-lg shadow-purple-700/20 transition-all duration-300 hover:shadow-purple-700/40 hover:scale-105 relative overflow-hidden group py-6">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-green-600/20 animate-pulse-slow"></span>
                  <span className="absolute -inset-x-2 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></span>
                  <span className="relative flex items-center justify-center text-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Go to Admin Dashboard
                  </span>
                </Button>
              </Link>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Link href="/" className="text-gray-400 hover:text-gray-300 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Return to Home
              </Link>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
