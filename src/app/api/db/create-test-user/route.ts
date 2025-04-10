import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models';

export async function POST() {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Create a test user
    const testUser = await User.create({
      clerkId: 'test-clerk-id-' + Date.now(),
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      photo: 'https://via.placeholder.com/150',
      role: 'user',
      isVerified: true,
    });
    
    return NextResponse.json({
      message: 'Test user created successfully',
      user: {
        ...testUser.toObject(),
        _id: testUser._id.toString(),
        createdAt: testUser.createdAt?.toISOString(),
        updatedAt: testUser.updatedAt?.toISOString(),
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json({
      error: 'Failed to create test user',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
