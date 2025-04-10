import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models';

export async function adminAuthMiddleware(req: NextRequest) {
  try {
    // Get the admin session token from cookies
    const adminSessionToken = req.cookies.get('admin_session')?.value;

    if (!adminSessionToken) {
      return NextResponse.redirect(new URL('/admin/sign-in', req.url));
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
      // Clear the invalid session cookie
      const response = NextResponse.redirect(new URL('/admin/sign-in', req.url));
      response.cookies.delete('admin_session');
      return response;
    }

    // Admin is authenticated, continue
    return NextResponse.next();
  } catch (error) {
    console.error('Error in admin auth middleware:', error);
    return NextResponse.redirect(new URL('/admin/sign-in', req.url));
  }
}
