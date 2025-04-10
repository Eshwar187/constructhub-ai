import { User } from '@/lib/db/models';
import { connectToDatabase } from '@/lib/db/mongoose';

/**
 * Determines the appropriate redirect URL based on user role
 * @param userId The Clerk user ID
 * @returns The URL to redirect to
 */
export async function getRedirectUrl(userId: string | null | undefined): Promise<string> {
  // If no user is logged in, redirect to home page
  if (!userId) {
    return '/';
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Find the user in the database
    const user = await User.findOne({ clerkId: userId });

    // If user not found, redirect to dashboard (default)
    if (!user) {
      return '/dashboard';
    }

    // Redirect based on user role
    if (user.role === 'admin') {
      return '/admin/dashboard';
    } else {
      return '/dashboard';
    }
  } catch (error) {
    console.error('Error determining redirect URL:', error);
    // Default to dashboard on error
    return '/dashboard';
  }
}
