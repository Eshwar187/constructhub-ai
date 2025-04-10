import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Verification } from '@/lib/db/models';
import { sendVerificationEmail } from '@/lib/services/mailjet.service';

export async function POST(req: Request) {
  try {
    const { email, username } = await req.json();

    console.log('Sending verification code to:', { email, username });

    if (!email || !username) {
      console.error('Missing required fields:', { email, username });
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated verification code:', code);

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    try {
      // Save the verification code to the database
      const verification = await Verification.findOneAndUpdate(
        { email },
        { email, code, expiresAt },
        { upsert: true, new: true }
      );

      console.log('Saved verification code to database:', verification);

      // Send the verification email
      console.log('Sending verification email with Mailjet...');
      const result = await sendVerificationEmail(email, code, username);
      console.log('Mailjet response:', result);

      return NextResponse.json(
        { message: 'Verification code sent successfully', code: process.env.NODE_ENV === 'development' ? code : undefined },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database or email error:', dbError);
      return NextResponse.json(
        { error: 'Failed to process verification request. Please try again.', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
