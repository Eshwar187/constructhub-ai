"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

interface MongoDBUser {
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

export function UserInfoCard(): React.ReactElement {
  const { user: clerkUser } = useUser();
  const [mongoUser, setMongoUser] = useState<MongoDBUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMongoUser = async () => {
      try {
        const response = await fetch('/api/auth/sync-user');
        if (!response.ok) {
          throw new Error('Failed to fetch user data from MongoDB');
        }
        const data = await response.json();
        setMongoUser(data);
      } catch (error) {
        console.error('Error fetching MongoDB user:', error);
        toast.error('Failed to fetch user data from MongoDB');
      } finally {
        setLoading(false);
      }
    };

    if (clerkUser) {
      fetchMongoUser();
    }
  }, [clerkUser]);

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mongoUser) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No user data found in MongoDB.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle>User Information (MongoDB)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          {mongoUser.photo && (
            <img 
              src={mongoUser.photo} 
              alt={mongoUser.username} 
              className="w-16 h-16 rounded-full border-2 border-blue-500"
            />
          )}
          <div>
            <h3 className="text-xl font-semibold">
              {mongoUser.firstName} {mongoUser.lastName}
            </h3>
            <p className="text-gray-400">@{mongoUser.username}</p>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Email:</span>
            <span className="font-medium">{mongoUser.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Role:</span>
            <span className="font-medium capitalize">{mongoUser.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Verified:</span>
            <span className={`font-medium ${mongoUser.isVerified ? 'text-green-500' : 'text-red-500'}`}>
              {mongoUser.isVerified ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Joined:</span>
            <span className="font-medium">
              {new Date(mongoUser.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
