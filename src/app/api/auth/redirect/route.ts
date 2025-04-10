import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { getRedirectUrl } from '@/lib/auth-redirects';

export async function GET() {
  try {
    // Get the current user ID from Clerk
    const { userId } = auth();
    
    // Determine the appropriate redirect URL
    const redirectUrl = await getRedirectUrl(userId);
    
    // Return the redirect URL
    return NextResponse.json({ redirectUrl }, { status: 200 });
  } catch (error) {
    console.error('Error in redirect API:', error);
    return NextResponse.json(
      { error: 'Failed to determine redirect URL', redirectUrl: '/dashboard' },
      { status: 500 }
    );
  }
}
