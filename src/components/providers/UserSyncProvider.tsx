"use client";

import React, { ReactNode } from 'react';
import { useSyncUser } from '@/hooks/useSyncUser';
import { useUser } from '@clerk/nextjs';
import { useSessionStorage } from '@/hooks/useSessionStorage';

interface UserSyncProviderProps {
  children: ReactNode;
}

export function UserSyncProvider({ children }: UserSyncProviderProps): React.ReactElement {
  // Use the hook to sync user data with MongoDB
  const { synced, error } = useSyncUser();
  const { isSignedIn } = useUser();

  // Use session storage to log out users when browser is closed
  useSessionStorage();

  // Only log in development
  if (process.env.NODE_ENV === 'development' && isSignedIn) {
    console.log('User sync status:', { synced, error });
  }

  return <>{children}</>;
}
