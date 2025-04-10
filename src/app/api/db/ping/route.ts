import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';

// A lightweight endpoint to check database connectivity
export async function GET() {
  try {
    // Just test the connection
    await connectToDatabase();
    
    return NextResponse.json(
      { status: 'ok', message: 'Database connection successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 500 }
    );
  }
}
