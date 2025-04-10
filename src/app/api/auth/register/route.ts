import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models';
import { clerkClient } from '@clerk/nextjs';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, username, password, role } = await req.json();

    // Validate input
    if (!firstName || !lastName || !email || !username || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'user' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Create user in Clerk
    try {
      const clerkUser = await clerkClient.users.createUser({
        firstName,
        lastName,
        emailAddress: [email],
        username,
        password,
      });

      // Connect to the database
      await connectToDatabase();

      // Create user in our database
      const newUser = new User({
        clerkId: clerkUser.id,
        username,
        email,
        firstName,
        lastName,
        role: role, // 'user' or 'admin'
        isVerified: false,
      });

      await newUser.save();

      return NextResponse.json(
        { 
          message: 'User registered successfully',
          userId: clerkUser.id,
          token: 'dummy-token' // In a real app, you'd generate a JWT here
        }, 
        { status: 201 }
      );
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      // Check if it's a Clerk API error
      if (error.clerkError) {
        // Handle specific Clerk errors
        if (error.errors && error.errors.length > 0) {
          const firstError = error.errors[0];
          
          if (firstError.code === 'user_exists') {
            return NextResponse.json(
              { error: 'A user with this email or username already exists' },
              { status: 409 }
            );
          }
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in registration:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
