import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    // Get the admin session token from cookies
    const cookieStore = cookies();
    const adminSessionToken = cookieStore.get('admin_session')?.value;

    if (!adminSessionToken) {
      return NextResponse.json(
        { authenticated: false },
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
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Create the response
    const response = NextResponse.json(
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

    // Set the admin_authenticated cookie for redirect logic
    // Only set it if it doesn't already exist
    if (!cookieStore.get('admin_authenticated')) {
      response.cookies.set('admin_authenticated', 'true', {
        httpOnly: false, // Allow JavaScript to read this cookie
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Error checking admin authentication:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Failed to check authentication' },
      { status: 500 }
    );
  }
}
