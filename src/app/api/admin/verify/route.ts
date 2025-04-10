import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { AdminVerification, User } from '@/lib/db/models';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    console.log('Processing admin verification with token:', token);

    if (!token) {
      console.error('Verification token is missing');
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the admin verification record
    const verification = await AdminVerification.findOne({ verificationToken: token });

    if (!verification) {
      console.error('Invalid verification token, no matching record found');
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 404 }
      );
    }

    console.log('Found verification record:', verification);

    // Check if the token has expired
    if (new Date() > verification.expiresAt) {
      console.error('Verification token has expired');
      await AdminVerification.findByIdAndDelete(verification._id);
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update the user's role to admin
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: verification.userId },
      { role: 'admin' },
      { new: true }
    );

    if (!updatedUser) {
      console.error('User not found for clerkId:', verification.userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Updated user role to admin:', updatedUser);

    // Update the verification record
    verification.isApproved = true;
    await verification.save();
    console.log('Updated verification record:', verification);

    // Redirect to a success page
    const redirectUrl = new URL('/admin/approved', req.url);
    console.log('Redirecting to:', redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error verifying admin:', error);
    return NextResponse.json(
      { error: 'Failed to verify admin', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
