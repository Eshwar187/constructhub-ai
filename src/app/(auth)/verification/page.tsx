'use client';

import { useState, useEffect } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { useUser as useMockUser } from '@/lib/clerk-mock';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function VerificationPage(): React.ReactElement {
  // Use either the real Clerk hook or our mock hook based on environment
  const { user, isLoaded } = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'
    ? useMockUser()
    : useClerkUser();
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      // Check if we should automatically send the verification code
      // We'll only auto-send if this is the first time loading the page
      const shouldAutoSend = sessionStorage.getItem('verificationCodeSent') !== 'true';

      if (shouldAutoSend) {
        sendVerificationCode();
        // Mark that we've sent the code to prevent multiple sends on page refresh
        sessionStorage.setItem('verificationCodeSent', 'true');
      }
    }
  }, [isLoaded, user]);

  const sendVerificationCode = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userEmail = user.primaryEmailAddress?.emailAddress;
      const userName = user.username || user.firstName || 'User';

      if (!userEmail) {
        toast.error('No email address found for your account');
        return;
      }

      const response = await fetch('/api/verification/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          username: userName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCodeSent(true);
        toast.success(`Verification code sent to ${userEmail}`);
      } else {
        toast.error(data.error || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Verification code error:', error);
      toast.error('An error occurred while sending the verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!user || !verificationCode) return;

    setIsLoading(true);
    try {
      const userEmail = user.primaryEmailAddress?.emailAddress;

      if (!userEmail) {
        toast.error('No email address found for your account');
        return;
      }

      const response = await fetch('/api/verification/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email verified successfully!');
        // Show success message for a moment before redirecting
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        toast.error(data.error || 'Failed to verify code');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred while verifying the code');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full blur-lg bg-gradient-to-r from-blue-500/30 to-green-500/30 opacity-70 animate-pulse"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 relative"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
      <div className="fixed inset-0 -z-10 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>

      {/* Animated background elements */}
      <div className="fixed inset-0 -z-5 opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Email verification animation */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-5 opacity-20"
        animate={{ y: [-10, 10, -10], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="url(#paint0_linear)"/>
          <defs>
            <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6"/>
              <stop offset="1" stopColor="#06B6D4"/>
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
            className="inline-block mb-4"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full blur-sm bg-gradient-to-r from-blue-600 to-cyan-600 opacity-75"></div>
              <div className="relative bg-black rounded-full p-3 border border-gray-800">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="url(#paint0_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3B82F6"/>
                      <stop offset="1" stopColor="#06B6D4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500 animate-gradient-text neon-blue mb-2">
            Email Verification
          </h1>
          <p className="text-gray-400 max-w-sm mx-auto">
            {codeSent
              ? 'Please enter the verification code sent to your email'
              : 'We need to verify your email address to continue'}
          </p>
        </div>

        <div className="animated-border">
          <Card className="frosted-glass relative z-10">
            <CardHeader>
              <CardTitle className="text-center">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl font-medium text-white"
                >
                  {codeSent ? 'Enter Verification Code' : 'Verify Your Email'}
                </motion.div>
              </CardTitle>
              <CardDescription className="text-center text-gray-400 mt-2">
                {codeSent
                  ? `We've sent a code to ${user?.primaryEmailAddress?.emailAddress}`
                  : 'Click the button below to receive a verification code'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
          {codeSent ? (
            <>
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm text-gray-300">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="bg-gray-800/70 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                  maxLength={6}
                />
              </div>
              <Button
                onClick={verifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-700/20 transition-all duration-300 hover:shadow-blue-700/40 hover:scale-[1.02] flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Verify Code
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={sendVerificationCode}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-700/20 transition-all duration-300 hover:shadow-blue-700/40 hover:scale-[1.02] flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Send Verification Code
                </>
              )}
            </Button>
          )}
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              {codeSent && (
                <div className="text-center bg-blue-900/20 rounded-lg p-4 border border-blue-800/30 w-full">
                  <p className="text-sm text-gray-300 flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Didn't receive the code?
                  </p>
                  <Button
                    variant="link"
                    onClick={sendVerificationCode}
                    disabled={isLoading}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Resend verification code
                    </span>
                  </Button>
                </div>
              )}
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
              <a href="/" className="text-gray-400 hover:text-gray-300 transition-colors">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Back to Home
                </span>
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
