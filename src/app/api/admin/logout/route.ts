import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User, AdminActivity } from '@/lib/db/models';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Get the admin session token from cookies
    const cookieStore = cookies();
    const adminSessionToken = cookieStore.get('admin_session')?.value;

    if (adminSessionToken) {
      // Connect to the database
      await connectToDatabase();

      // Find the admin user with the session token
      const adminUser = await User.findOne({ sessionToken: adminSessionToken });

      if (adminUser) {
        // Clear the session token
        adminUser.sessionToken = undefined;
        adminUser.sessionExpiry = undefined;
        await adminUser.save();

        // Log the admin logout activity
        const headersList = headers();
        const ipAddress = headersList.get('x-forwarded-for') || 'unknown';

        await AdminActivity.create({
          adminId: adminUser._id.toString(),
          adminEmail: adminUser.email,
          action: 'logout',
          details: 'Admin logged out successfully',
          ipAddress,
        });
      }
    }

    // Clear the session cookie
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Delete both admin cookies
    response.cookies.delete('admin_session');
    response.cookies.delete('admin_authenticated');

    return response;
  } catch (error) {
    console.error('Error during admin logout:', error);
    return NextResponse.json(
      { error: 'Failed to logout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
