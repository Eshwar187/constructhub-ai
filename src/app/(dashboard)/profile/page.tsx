'use client';

import { useState, useEffect } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { useUser as useMockUser } from '@/lib/clerk-mock';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserProfile {
  _id: string;
  clerkId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  // Use either the real Clerk hook or our mock hook based on environment
  const { user: clerkUser, isLoaded: clerkLoaded } = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'
    ? useMockUser()
    : useClerkUser();

  // We'll still use our mock profile data for the demo
  const mockUser = {
    id: '123',
    username: 'demo_user',
    firstName: 'Demo',
    lastName: 'User',
    primaryEmailAddress: { emailAddress: 'demo@example.com' },
    imageUrl: '',
  };
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!clerkUser) return;

      try {
        // In a real app, you would fetch the user profile from your API
        // For now, we'll create a mock profile based on Clerk user data
        const mockProfile: UserProfile = {
          _id: '123',
          clerkId: clerkUser?.id || mockUser.id,
          username: clerkUser?.username || mockUser.username,
          email: clerkUser?.primaryEmailAddress?.emailAddress || mockUser.primaryEmailAddress.emailAddress,
          firstName: clerkUser?.firstName || mockUser.firstName,
          lastName: clerkUser?.lastName || mockUser.lastName,
          photo: clerkUser?.imageUrl || mockUser.imageUrl,
          role: 'user', // This would come from your database
          isVerified: true, // This would come from your database
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setProfile(mockProfile);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (clerkLoaded) {
      fetchProfile();
    }
  }, [clerkUser, clerkLoaded]);

  if (!clerkLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <p className="text-gray-400">Unable to load your profile information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-400 mt-1">View and manage your account information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-6"
      >
        <div className="md:w-1/3">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={profile.photo} alt={profile.username} />
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {profile.firstName?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-gray-400">@{profile.username}</p>
              <div className="mt-4">
                <span className={`px-2 py-1 rounded text-xs ${profile.role === 'admin' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </span>
              </div>
              <div className="mt-6 w-full">
                <div className="border-t border-gray-700 pt-4 pb-2">
                  <p className="text-gray-400 text-sm">Member since</p>
                  <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="border-t border-gray-700 pt-4 pb-2">
                  <p className="text-gray-400 text-sm">Email</p>
                  <p>{profile.email}</p>
                </div>
                <div className="border-t border-gray-700 pt-4 pb-2">
                  <p className="text-gray-400 text-sm">Verification Status</p>
                  <p className={profile.isVerified ? 'text-green-400' : 'text-yellow-400'}>
                    {profile.isVerified ? 'Verified' : 'Pending Verification'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger value="profile">Profile Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Your profile is managed through Clerk. To update your profile information, please use the user button in the top right corner.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Your account security is managed through Clerk. To update your password or enable two-factor authentication, please use the user button in the top right corner.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription className="text-gray-400">
                    Customize your experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Preference settings will be available in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
