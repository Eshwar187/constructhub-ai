import mongoose from 'mongoose';
import { connectToDatabase } from './mongoose';
import { User, Verification, AdminVerification, Project } from './models';
import { clearAllSessions } from './clear-sessions';

/**
 * Initialize the database with required data
 * Creates all necessary collections and indexes
 */
export async function initializeDatabase() {
  try {
    console.log('Initializing database connection...');

    // Connect to the database
    const db = await connectToDatabase();
    console.log('Database connection successful');

    // Create collections if they don't exist
    const collections = await db.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Existing collections:', collectionNames);

    // Initialize User collection
    if (!collectionNames.includes('users')) {
      console.log('Creating users collection...');
      await db.connection.db.createCollection('users');
      // Create indexes for User collection
      await User.createIndexes();
      console.log('Users collection created with indexes');
    }

    // Initialize Verification collection
    if (!collectionNames.includes('verifications')) {
      console.log('Creating verifications collection...');
      await db.connection.db.createCollection('verifications');
      // Create indexes for Verification collection
      await Verification.createIndexes();
      console.log('Verifications collection created with indexes');
    }

    // Initialize AdminVerification collection
    if (!collectionNames.includes('adminverifications')) {
      console.log('Creating adminverifications collection...');
      await db.connection.db.createCollection('adminverifications');
      // Create indexes for AdminVerification collection
      await AdminVerification.createIndexes();
      console.log('AdminVerifications collection created with indexes');
    }

    // Initialize Project collection
    if (!collectionNames.includes('projects')) {
      console.log('Creating projects collection...');
      await db.connection.db.createCollection('projects');
      // Create indexes for Project collection
      await Project.createIndexes();
      console.log('Projects collection created with indexes');
    }

    console.log('All collections initialized successfully');

    // Clear all sessions on server startup
    await clearAllSessions();
    return { success: true, message: 'Database initialized successfully', collections: collectionNames };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export default initializeDatabase;
