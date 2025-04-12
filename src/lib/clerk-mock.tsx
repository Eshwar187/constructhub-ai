"use client";

import React, { createContext, useContext, useState } from 'react';

// Mock user data
const mockUser = {
  id: 'user_mock123',
  firstName: 'Demo',
  lastName: 'User',
  username: 'demouser',
  emailAddresses: [{ emailAddress: 'demo@example.com' }],
  primaryEmailAddress: { emailAddress: 'demo@example.com' },
  imageUrl: 'https://via.placeholder.com/150',
  fullName: 'Demo User'
};

// Create context
type ClerkContextType = {
  user: typeof mockUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
};

const ClerkContext = createContext<ClerkContextType>({
  user: null,
  isLoaded: false,
  isSignedIn: false
});

// Create provider
export function MockClerkProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(true);

  const value = {
    user: isSignedIn ? mockUser : null,
    isLoaded: true,
    isSignedIn
  };

  return (
    <ClerkContext.Provider value={value}>
      {children}
    </ClerkContext.Provider>
  );
}

// Create hooks
export function useUser() {
  const context = useContext(ClerkContext);
  return {
    user: context.user,
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn
  };
}

export function useAuth() {
  const context = useContext(ClerkContext);
  return {
    userId: context.user?.id,
    sessionId: 'mock_session_123',
    getToken: async () => 'mock_token_123',
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn
  };
}

export function useSession() {
  return {
    session: {
      id: 'mock_session_123',
      userId: mockUser.id,
      status: 'active',
      lastActiveAt: new Date(),
      expireAt: new Date(Date.now() + 86400000), // 24 hours from now
      abandonAt: new Date(Date.now() + 86400000 * 14), // 14 days from now
    },
    isLoaded: true,
    isSignedIn: true,
    status: 'active'
  };
}

// Mock sign-in component
export function SignIn({ redirectUrl }: { redirectUrl?: string }) {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate inputs
    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    setTimeout(async () => {
      try {
        // Always redirect directly to dashboard to avoid JWT issues
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Error during redirect:', error);
        window.location.href = '/dashboard';
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="p-6 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm shadow-xl">
      <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Welcome Back</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <div className="relative">
            <input
              type="email"
              className="w-full p-2 pl-10 bg-gray-700/70 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              className="w-full p-2 pl-10 bg-gray-700/70 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-blue-500"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-md shadow-lg shadow-blue-700/20 transition-all duration-300 hover:shadow-blue-700/40 hover:scale-[1.02] flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-400">
        <p>This is a mock login form for development purposes.</p>
      </div>
    </div>
  );
}

// Mock sign-up component
export function SignUp({ redirectUrl }: { redirectUrl?: string }) {
  const [firstName, setFirstName] = useState('Demo');
  const [lastName, setLastName] = useState('User');
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate inputs
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to the specified URL
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }, 1500);
  };

  return (
    <div className="p-6 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm shadow-xl">
      <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Create Admin Account</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-700/70 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-700/70 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 bg-gray-700/70 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 bg-gray-700/70 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-md shadow-lg shadow-purple-700/20 transition-all duration-300 hover:shadow-purple-700/40 hover:scale-[1.02] flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Register as Admin'
          )}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-400">
        <p>This is a mock registration form for development purposes.</p>
      </div>
    </div>
  );
}

// Mock user button
export function UserButton() {
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white relative border border-gray-800">
      {mockUser.firstName.charAt(0)}
    </div>
  );
}
