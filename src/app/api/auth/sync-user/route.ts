import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models';
import { auth, currentUser } from '@clerk/nextjs';

export async function POST(req: Request) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      console.error('Unauthorized: No user found in auth context');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Clerk user found:', {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName
    });

    // Get the user data from the request body
    const userData = await req.json();
    console.log('Received user data:', userData);

    // Connect to the database
    await connectToDatabase();

    // Ensure we have an email
    const email = userData.email || clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      console.error('No email found for user');
      return NextResponse.json(
        { error: 'No email found for user' },
        { status: 400 }
      );
    }

    // Check if a user with this clerkId already exists
    let user = await User.findOne({ clerkId: userId });

    if (user) {
      // User exists, update fields except username to avoid duplicate key errors
      user.email = email;
      user.firstName = userData.firstName || clerkUser.firstName;
      user.lastName = userData.lastName || clerkUser.lastName;
      user.photo = userData.imageUrl || clerkUser.imageUrl;
      user.isVerified = userData.emailVerified || clerkUser.emailAddresses[0]?.verification?.status === 'verified' || false;

      // Only update username if it's different and not already taken
      const newUsername = userData.username || email.split('@')[0];
      if (user.username !== newUsername) {
        // Check if the new username is already taken by another user
        const existingUserWithUsername = await User.findOne({ username: newUsername, clerkId: { $ne: userId } });
        if (!existingUserWithUsername) {
          user.username = newUsername;
        }
      }

      await user.save();
    } else {
      // Create a new user, but handle potential duplicate username
      const baseUsername = userData.username || email.split('@')[0];
      let username = baseUsername;
      let counter = 1;

      // Keep trying with incremented usernames until we find one that's not taken
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await User.create({
        clerkId: userId,
        username: username,
        email: email,
        firstName: userData.firstName || clerkUser.firstName,
        lastName: userData.lastName || clerkUser.lastName,
        photo: userData.imageUrl || clerkUser.imageUrl,
        role: userData.role || 'user',
        isVerified: userData.emailVerified || clerkUser.emailAddresses[0]?.verification?.status === 'verified' || false,
      });
    }

    console.log('User synced with MongoDB:', user);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      console.error('Unauthorized: No user found in auth context');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Fetching user data for:', userId);

    // Connect to the database
    await connectToDatabase();

    // Find the user in MongoDB
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      console.log('User not found in MongoDB, creating new user record');

      // If user not found, create a new user record
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        return NextResponse.json(
          { error: 'No email found for user' },
          { status: 400 }
        );
      }

      // Handle potential duplicate username
      const baseUsername = clerkUser.username || email.split('@')[0];
      let username = baseUsername;
      let counter = 1;

      // Keep trying with incremented usernames until we find one that's not taken
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      const newUser = await User.create({
        clerkId: userId,
        username: username,
        email: email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        photo: clerkUser.imageUrl,
        role: 'user',
        isVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified' || false,
      });

      console.log('Created new user in MongoDB:', newUser);
      return NextResponse.json(newUser, { status: 201 });
    }

    console.log('Found user in MongoDB:', user);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
