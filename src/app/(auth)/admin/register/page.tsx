"use client";

import { SignUp as ClerkSignUp } from '@clerk/nextjs';
import { SignUp as MockSignUp } from '@/lib/clerk-mock';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminRegisterPage(): React.ReactElement {
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
                  <path d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7ZM20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z" fill="url(#paint0_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
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
            <span className="text-white"> Registration</span>
          </h1>
          <p className="text-gray-300 dark:text-gray-300 max-w-md mx-auto text-lg">
            Register as an administrator to manage the ConstructHub.ai platform
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
                  <span className="relative">Admin Sign Up</span>
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' ? (
                <MockSignUp redirectUrl="/admin/pending-approval" />
              ) : (
                <ClerkSignUp
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-purple-700/20 transition-all duration-300 hover:shadow-purple-700/40',
                      formFieldInput: 'bg-gray-800/70 border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
                      formFieldLabel: 'text-gray-300 font-medium',
                      card: 'bg-transparent shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      footerAction: 'text-gray-300 hover:text-white',
                      identityPreview: 'bg-gray-800/70 border-gray-700',
                      formFieldAction: 'text-purple-400 hover:text-purple-300',
                      dividerLine: 'bg-gray-700',
                      dividerText: 'text-gray-400',
                      socialButtonsBlockButton: 'border-gray-700 hover:bg-gray-800/70',
                      socialButtonsBlockButtonText: 'text-gray-300',
                      socialButtonsBlockButtonArrow: 'text-gray-400',
                      otpCodeFieldInput: 'bg-gray-800/70 border-gray-700 text-white',
                      alertText: 'text-gray-300',
                      profileSectionPrimaryButton: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white',
                      formResendCodeLink: 'text-purple-400 hover:text-purple-300',
                      userButtonPopoverCard: 'bg-gray-800 border border-gray-700',
                      userButtonPopoverActionButton: 'text-gray-300 hover:text-white hover:bg-gray-700',
                      userButtonPopoverActionButtonIcon: 'text-gray-400',
                      userButtonPopoverFooter: 'border-gray-700',
                    },
                    layout: {
                      socialButtonsVariant: 'iconButton',
                      socialButtonsPlacement: 'bottom',
                      termsPageUrl: 'https://clerk.com/terms',
                      privacyPageUrl: 'https://clerk.com/privacy',
                    },
                    variables: {
                      colorPrimary: '#A855F7',
                      colorText: 'white',
                      colorTextSecondary: '#CBD5E1',
                      colorBackground: 'transparent',
                      colorInputBackground: '#1F2937',
                      colorInputText: 'white',
                      fontFamily: 'Inter, sans-serif',
                      borderRadius: '0.5rem',
                    },
                  }}
                  path="/admin/register"
                  routing="path"
                  signInUrl="/admin/sign-in"
                  redirectUrl="/admin/pending-approval"
                  afterSignUpUrl="/admin/pending-approval"
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <p className="text-sm text-gray-400">
                After registration, your request will be sent to the main admin for approval.
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
