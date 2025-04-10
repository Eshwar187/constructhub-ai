"use client";

import { SignIn as ClerkSignIn } from '@clerk/nextjs';
import { SignIn as MockSignIn } from '@/lib/clerk-mock';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInPage(): React.ReactElement {
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
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/20 dark:bg-yellow-500/15 rounded-full blur-[120px]"
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
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/20 dark:bg-pink-500/15 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Cyberpunk grid overlay */}
      <div className="fixed inset-0 -z-8 cyberpunk-grid opacity-15"></div>

      {/* Floating particles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full"
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-purple-500 rounded-full"
        animate={{
          y: [0, 40, 0],
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.5, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-2 h-2 bg-cyan-500 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

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
              <div className="absolute -inset-3 rounded-full blur-lg bg-gradient-to-r from-yellow-500 via-blue-500 to-pink-500 opacity-80"></div>
              <div className="relative bg-black dark:bg-gray-900 rounded-full p-4 border-2 border-yellow-400 dark:border-yellow-500">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          </motion.div>
          <h1 className="text-4xl font-extrabold mb-4">
            <span className="text-yellow-400 dark:text-yellow-400">Welcome</span>
            <span className="text-white"> to </span>
            <span className="text-blue-500 dark:text-blue-400">ConstructHub</span>
            <span className="text-white">.ai</span>
          </h1>
          <p className="text-gray-300 dark:text-gray-300 max-w-md mx-auto text-lg">
            Sign in to your account to manage your construction projects with AI-powered insights
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
                  <span className="absolute -inset-1 blur-sm bg-gradient-to-r from-yellow-500/30 to-blue-500/30 rounded-lg opacity-70"></span>
                  <span className="relative">Sign In</span>
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent>
          {process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' ? (
            <MockSignIn redirectUrl="/auth-redirect" />
          ) : (
            <ClerkSignIn
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold shadow-lg shadow-yellow-700/20 transition-all duration-300 hover:shadow-yellow-700/40',
                  formFieldInput: 'bg-gray-800/70 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                  formFieldLabel: 'text-gray-300 font-medium',
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  footerAction: 'text-gray-300 hover:text-white',
                  identityPreview: 'bg-gray-800/70 border-gray-700',
                  formFieldAction: 'text-blue-400 hover:text-blue-300',
                  dividerLine: 'bg-gray-700',
                  dividerText: 'text-gray-400',
                  socialButtonsBlockButton: 'border-gray-700 hover:bg-gray-800/70',
                  socialButtonsBlockButtonText: 'text-gray-300',
                  socialButtonsBlockButtonArrow: 'text-gray-400',
                  otpCodeFieldInput: 'bg-gray-800/70 border-gray-700 text-white',
                  alertText: 'text-gray-300',
                  profileSectionPrimaryButton: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black',
                  formResendCodeLink: 'text-blue-400 hover:text-blue-300',
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
                  colorPrimary: '#FBBF24',
                  colorText: 'white',
                  colorTextSecondary: '#CBD5E1',
                  colorBackground: 'transparent',
                  colorInputBackground: '#1F2937',
                  colorInputText: 'white',
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '0.5rem',
                },
              }}
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
              redirectUrl="/auth-redirect"
            />
          )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-gray-400">
              Don't have an account?{' '}
              <a href="/sign-up" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
                Sign up
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
