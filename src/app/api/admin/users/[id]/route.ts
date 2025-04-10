import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User, AdminActivity } from '@/lib/db/models';
import { auth } from '@clerk/nextjs';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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
      action: 'view_user',
      details: `Admin viewed user details for ID: ${params.id}`,
      ipAddress,
    });

    // Get the user
    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if the user is the main admin
    const adminUser = await User.findOne({
      sessionToken: adminSessionToken,
      role: 'admin',
      email: 'eshwar09052005@gmail.com' // Only the main admin can delete users
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Only the main admin can delete users.' },
        { status: 403 }
      );
    }

    // Get the user to be deleted
    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deleting the main admin
    if (user.email === 'eshwar09052005@gmail.com') {
      return NextResponse.json(
        { error: 'Cannot delete the main admin account' },
        { status: 403 }
      );
    }

    // Delete the user
    await User.findByIdAndDelete(params.id);

    // Log the admin activity
    const headersList = headers();
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown';

    await AdminActivity.create({
      adminId: adminUser._id.toString(),
      adminEmail: adminUser.email,
      action: 'delete_user',
      details: `Admin deleted user: ${user.email}`,
      ipAddress,
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
