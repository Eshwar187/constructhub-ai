import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { AdminVerification, User } from '@/lib/db/models';
import { sendAdminVerificationEmail } from '@/lib/services/mailjet.service';
import { auth, currentUser } from '@clerk/nextjs';
import crypto from 'crypto';

// Main admin credentials
const MAIN_ADMIN_EMAIL = 'eshwar09052005@gmail.com';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      console.error('Unauthorized: No user found in auth context');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Processing admin request for user:', {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress
    });

    // Connect to the database
    await connectToDatabase();

    // Find the user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      console.log('User not found in MongoDB, creating user record first');

      // If user not found, create a new user record
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        return NextResponse.json(
          { error: 'No email found for user' },
          { status: 400 }
        );
      }

      // Create the user first
      const newUser = await User.create({
        clerkId: userId,
        username: clerkUser.username || email.split('@')[0],
        email: email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        photo: clerkUser.imageUrl,
        role: 'user',
        isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified' || false,
      });

      console.log('Created new user in MongoDB:', newUser);

      // Use the newly created user
      const userEmail = newUser.email;
      const userClerkId = newUser.clerkId;

      // Generate a verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Set expiration time (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Save the admin verification request
      const adminVerification = await AdminVerification.findOneAndUpdate(
        { userId: userClerkId },
        {
          userId: userClerkId,
          email: userEmail,
          verificationToken,
          expiresAt
        },
        { upsert: true, new: true }
      );

      console.log('Created admin verification request:', adminVerification);

      // Create verification link
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const verificationLink = `${baseUrl}/api/admin/verify?token=${verificationToken}`;

      console.log('Sending admin verification email to:', MAIN_ADMIN_EMAIL);
      console.log('Verification link:', verificationLink);

      // Send the verification email to the main admin
      try {
        console.log('Attempting to send email via Mailjet...');
        const emailResult = await sendAdminVerificationEmail(
          MAIN_ADMIN_EMAIL,
          userEmail,
          verificationLink
        );
        console.log('Email sent successfully:', emailResult);
      } catch (emailError) {
        console.error('Failed to send email via Mailjet:', emailError);
        // Continue the process even if email fails
        // This allows testing without email configuration
      }

      return NextResponse.json(
        { message: 'Admin verification request sent successfully' },
        { status: 200 }
      );
    }

    // User exists, proceed with admin verification request
    console.log('User found in MongoDB:', user);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Set expiration time (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Save the admin verification request
    const adminVerification = await AdminVerification.findOneAndUpdate(
      { userId: user.clerkId },
      {
        userId: user.clerkId,
        email: user.email,
        verificationToken,
        expiresAt
      },
      { upsert: true, new: true }
    );

    console.log('Created admin verification request:', adminVerification);

    // Create verification link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationLink = `${baseUrl}/api/admin/verify?token=${verificationToken}`;

    console.log('Sending admin verification email to:', MAIN_ADMIN_EMAIL);
    console.log('Verification link:', verificationLink);

    // Send the verification email to the main admin
    try {
      console.log('Attempting to send email via Mailjet...');
      const emailResult = await sendAdminVerificationEmail(
        MAIN_ADMIN_EMAIL,
        user.email,
        verificationLink
      );
      console.log('Email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('Failed to send email via Mailjet:', emailError);
      // Continue the process even if email fails
      // This allows testing without email configuration
    }

    return NextResponse.json(
      { message: 'Admin verification request sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error requesting admin verification:', error);
    return NextResponse.json(
      { error: 'Failed to request admin verification', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
