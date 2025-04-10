import mongoose from 'mongoose';
import { User } from '@/lib/db/models';

// This function will be called on server startup to clear all sessions
export async function clearAllSessions() {
  try {
    console.log('Clearing all user sessions on server startup...');
    
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, skipping session clearing');
      return;
    }
    
    // Clear all session tokens for both regular users and admins
    const result = await User.updateMany(
      { sessionToken: { $exists: true, $ne: null } },
      { $unset: { sessionToken: "", sessionExpiry: "" } }
    );
    
    console.log(`Cleared sessions for ${result.modifiedCount} users`);
  } catch (error) {
    console.error('Error clearing sessions:', error);
  }
}
