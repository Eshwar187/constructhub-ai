import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init-db';

// Flag to track if initialization has been done
let initialized = false;

// This is a protected route that should only be called during app initialization
export async function POST() {
  try {
    // Initialize the database
    await initializeDatabase();
    initialized = true;

    return NextResponse.json(
      { message: 'Database initialized successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if database is initialized
export async function GET() {
  if (!initialized) {
    // Auto-initialize on first request
    try {
      await initializeDatabase();
      initialized = true;
      return NextResponse.json(
        { message: 'Database auto-initialized successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error auto-initializing database:', error);
      return NextResponse.json(
        { error: 'Failed to auto-initialize database' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { initialized },
    { status: 200 }
  );
}
