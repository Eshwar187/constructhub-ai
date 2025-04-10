import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { User, Verification, AdminVerification, Project } from '@/lib/db/models';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Connect to the database
    const db = await connectToDatabase();
    
    // Get all collections
    const collections = await db.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Get counts for each collection
    const userCount = await User.countDocuments();
    const verificationCount = await Verification.countDocuments();
    const adminVerificationCount = await AdminVerification.countDocuments();
    const projectCount = await Project.countDocuments();
    
    // Get database stats
    const dbStats = await db.connection.db.stats();
    
    // Get a sample user if available
    const sampleUser = await User.findOne().lean();
    
    return NextResponse.json({
      status: 'connected',
      database: db.connection.db.databaseName,
      collections: collectionNames,
      counts: {
        users: userCount,
        verifications: verificationCount,
        adminVerifications: adminVerificationCount,
        projects: projectCount,
      },
      dbStats,
      sampleUser: sampleUser ? {
        ...sampleUser,
        _id: sampleUser._id.toString(),
        createdAt: sampleUser.createdAt?.toISOString(),
        updatedAt: sampleUser.updatedAt?.toISOString(),
      } : null,
      mongooseVersion: mongoose.version,
      nodeVersion: process.version,
    }, { status: 200 });
  } catch (error) {
    console.error('Error testing database:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
