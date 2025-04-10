import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User } from '@/lib/db/models';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400,
    });
  }

  // Connect to the database
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  // Handle the webhook event
  const eventType = evt.type;
  console.log('Received Clerk webhook event:', eventType);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, username, email_addresses, first_name, last_name, image_url } = evt.data;
    console.log('User data from Clerk:', { id, email: email_addresses[0]?.email_address });

    if (!email_addresses || email_addresses.length === 0) {
      console.error('No email addresses found for user:', id);
      return NextResponse.json({ error: 'No email addresses found for user' }, { status: 400 });
    }

    const userData = {
      clerkId: id,
      username: username || email_addresses[0].email_address.split('@')[0],
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
      isVerified: email_addresses[0].verification?.status === 'verified' || false,
    };

    console.log('Prepared user data for MongoDB:', userData);

    try {
      // Upsert the user (create if not exists, update if exists)
      const user = await User.findOneAndUpdate(
        { clerkId: userData.clerkId },
        userData,
        { upsert: true, new: true }
      );

      console.log('User created or updated in MongoDB:', user);
      return NextResponse.json({ message: 'User created or updated', user }, { status: 200 });
    } catch (error) {
      console.error('Error creating or updating user:', error);
      return NextResponse.json({
        error: 'Failed to create or update user',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    console.log('Deleting user from MongoDB:', id);

    try {
      // Delete the user
      const result = await User.findOneAndDelete({ clerkId: id });
      console.log('User deletion result:', result);

      if (!result) {
        console.warn('No user found to delete with clerkId:', id);
      }

      return NextResponse.json({ message: 'User deleted', userId: id }, { status: 200 });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({
        error: 'Failed to delete user',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}
