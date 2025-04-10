import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User, AdminActivity } from '@/lib/db/models';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  try {
    // Get the admin session token from cookies
    const cookieStore = cookies();
    const adminSessionToken = cookieStore.get('admin_session')?.value;

    if (!adminSessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the user is an admin
    const adminUser = await User.findOne({
      sessionToken: adminSessionToken,
      role: 'admin',
      sessionExpiry: { $gt: new Date() }
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Log the admin activity
    const headersList = headers();
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown';

    await AdminActivity.create({
      adminId: adminUser._id.toString(),
      adminEmail: adminUser.email,
      action: 'view_users',
      details: 'Admin viewed all users',
      ipAddress,
    });

    // Get all users
    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
