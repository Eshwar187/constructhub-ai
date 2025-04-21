import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User, AdminActivity } from '@/lib/db/models';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { headers } from 'next/headers';

// Main admin credentials
const ADMIN_EMAIL = 'eshwar09052005@gmail.com';
const ADMIN_PASSWORD = 'Eshwar@005';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if the credentials match the main admin
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the admin user
    let adminUser = await User.findOne({ email: ADMIN_EMAIL, role: 'admin' });

    // If admin user doesn't exist, create it
    if (!adminUser) {
      console.log('Admin account not found. Creating admin account...');

      try {
        adminUser = await User.create({
          clerkId: 'admin_eshwar2005',
          username: 'eshwar2005',
          email: ADMIN_EMAIL,
          firstName: 'Eshwar',
          lastName: '',
          role: 'admin',
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        console.log('Admin account created successfully');
      } catch (error) {
        console.error('Error creating admin account:', error);
        return NextResponse.json(
          { error: 'Failed to create admin account.' },
          { status: 500 }
        );
      }
    }

    // Generate a session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // Set the session cookie
    const cookieStore = cookies();
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Set the admin_authenticated cookie for redirect logic
    cookieStore.set('admin_authenticated', 'true', {
      httpOnly: false, // Allow JavaScript to read this cookie
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Store the session token in the database
    adminUser.sessionToken = sessionToken;
    adminUser.sessionExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    await adminUser.save();

    // Log the admin login activity
    const headersList = headers();
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown';

    await AdminActivity.create({
      adminId: adminUser._id.toString(),
      adminEmail: ADMIN_EMAIL,
      action: 'login',
      details: 'Admin logged in successfully',
      ipAddress,
    });

    return NextResponse.json(
      {
        message: 'Admin login successful',
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
    console.error('Error during admin login:', error);
    return NextResponse.json(
      { error: 'Failed to login', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
