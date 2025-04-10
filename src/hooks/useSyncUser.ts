import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

export function useSyncUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only sync when the user is loaded and signed in
    if (!isLoaded || !isSignedIn || !user) return;

    // Skip if already synced
    if (synced) return;

    const syncUser = async () => {
      try {
        console.log('Syncing user with MongoDB...', user);

        // Prepare user data
        const userData = {
          email: user.primaryEmailAddress?.emailAddress,
          username: user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0],
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          emailVerified: user.primaryEmailAddress?.verification?.status === 'verified',
        };

        console.log('User data prepared:', userData);

        // Send the user data to the API
        const response = await fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to sync user');
        }

        console.log('User synced with MongoDB:', data);
        setSynced(true);
      } catch (error) {
        console.error('Error syncing user with MongoDB:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        toast.error('Failed to sync user data with database');
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user, synced]);

  return { synced, error };
}
