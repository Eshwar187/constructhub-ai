import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models';

// Flag to track if sessions have been cleared
let sessionsCleared = false;

export async function GET() {
  try {
    if (sessionsCleared) {
      return NextResponse.json(
        { message: 'Sessions already cleared on this server instance' },
        { status: 200 }
      );
    }

    console.log('Clearing all user sessions on server startup...');
    
    // Connect to the database
    await connectToDatabase();
    
    // Clear all session tokens for both regular users and admins
    const result = await User.updateMany(
      { sessionToken: { $exists: true, $ne: null } },
      { $unset: { sessionToken: "", sessionExpiry: "" } }
    );
    
    console.log(`Cleared sessions for ${result.modifiedCount} users`);
    sessionsCleared = true;
    
    return NextResponse.json(
      { message: `Cleared sessions for ${result.modifiedCount} users` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error clearing sessions:', error);
    return NextResponse.json(
      { error: 'Failed to clear sessions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
