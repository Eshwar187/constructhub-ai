import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Verification, User } from '@/lib/db/models';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    console.log('Verifying email with code:', { email, code });

    if (!email || !code) {
      console.error('Missing required fields:', { email, code });
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    try {
      // Connect to the database
      await connectToDatabase();

      // Find the verification record
      const verification = await Verification.findOne({ email });

      if (!verification) {
        console.error('No verification record found for email:', email);
        return NextResponse.json(
          { error: 'No verification code found for this email. Please request a new code.' },
          { status: 404 }
        );
      }

      console.log('Found verification record:', verification);

      // Check if the code has expired
      const now = new Date();
      if (now > verification.expiresAt) {
        console.error('Verification code has expired:', {
          now,
          expiresAt: verification.expiresAt,
          email
        });
        await Verification.findByIdAndDelete(verification._id);
        return NextResponse.json(
          { error: 'Verification code has expired. Please request a new code.' },
          { status: 400 }
        );
      }

      // Check if the code matches
      if (verification.code !== code) {
        console.error('Invalid verification code:', {
          providedCode: code,
          expectedCode: verification.code,
          email
        });
        return NextResponse.json(
          { error: 'Invalid verification code. Please check and try again.' },
          { status: 400 }
        );
      }

      console.log('Verification code is valid, updating user verification status');

      // Update the user's verification status
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { isVerified: true },
        { upsert: true, new: true } // Create the user record if it doesn't exist
      );

      console.log('Updated user verification status:', updatedUser);

      // Delete the verification record
      await Verification.findByIdAndDelete(verification._id);
      console.log('Deleted verification record');

      return NextResponse.json(
        { message: 'Email verified successfully' },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database error during verification:', dbError);
      return NextResponse.json(
        { error: 'Failed to process verification. Please try again.', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
