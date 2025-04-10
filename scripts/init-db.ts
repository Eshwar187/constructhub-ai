import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

interface TestUser {
  clerkId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

async function initializeDatabase(): Promise<void> {
  try {
    console.log('Connecting to MongoDB...');
    const connection = await mongoose.connect(MONGODB_URI, {
      bufferCommands: true,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('Connected to MongoDB successfully');
    const db = connection.connection.db;

    // Get existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Existing collections:', collectionNames);

    // Create collections if they don't exist
    const requiredCollections = ['users', 'verifications', 'adminverifications', 'projects'];
    
    for (const collectionName of requiredCollections) {
      if (!collectionNames.includes(collectionName)) {
        console.log(`Creating ${collectionName} collection...`);
        await db.createCollection(collectionName);
        console.log(`${collectionName} collection created`);
      } else {
        console.log(`${collectionName} collection already exists`);
      }
    }

    // Create a test user
    const usersCollection = db.collection('users');
    const testUser: TestUser = {
      clerkId: 'test-clerk-id-' + Date.now(),
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      photo: 'https://via.placeholder.com/150',
      role: 'user',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(testUser);
    console.log('Test user created:', result.insertedId);

    console.log('Database initialization complete');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();
