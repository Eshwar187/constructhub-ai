import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models';
import { cookies } from 'next/headers';

/**
 * API route to check admin authentication on the server side
 * This is used by the admin dashboard layout to verify admin authentication
 */
export async function GET() {
  try {
    // Get the admin session token from cookies
    const cookieStore = cookies();
    const adminSessionToken = cookieStore.get('admin_session')?.value;

    if (!adminSessionToken) {
      return NextResponse.json(
        { authenticated: false, message: 'No admin session token found' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the admin user with the session token
    const adminUser = await User.findOne({
      sessionToken: adminSessionToken,
      role: 'admin',
      sessionExpiry: { $gt: new Date() }
    });

    if (!adminUser) {
      // Clear the invalid session cookies
      cookieStore.delete('admin_session');
      cookieStore.delete('admin_authenticated');
      
      return NextResponse.json(
        { authenticated: false, message: 'Invalid or expired admin session' },
        { status: 401 }
      );
    }

    // Set the admin_authenticated cookie if it doesn't exist
    if (!cookieStore.get('admin_authenticated')) {
      cookieStore.set('admin_authenticated', 'true', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
    }

    return NextResponse.json(
      { 
        authenticated: true,
        user: {
          id: adminUser._id,
          email: adminUser.email,
          username: adminUser.username,
          role: adminUser.role
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking admin authentication:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Failed to check authentication' },
      { status: 500 }
    );
  }
}
