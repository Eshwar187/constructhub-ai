import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Project, User, AdminActivity } from '@/lib/db/models';
import { auth } from '@clerk/nextjs';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projectData = await req.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'landArea', 'landUnit', 'budget', 'currency', 'location'];
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Connect to the database
    await connectToDatabase();

    // Create the project
    const project = await Project.create({
      ...projectData,
      userId,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Check for admin session
    const cookieStore = cookies();
    const adminSessionToken = cookieStore.get('admin_session')?.value;
    let isAdmin = false;
    let adminUser = null;

    if (adminSessionToken) {
      // Check if this is an admin request
      adminUser = await User.findOne({
        sessionToken: adminSessionToken,
        role: 'admin',
        sessionExpiry: { $gt: new Date() }
      });

      if (adminUser) {
        isAdmin = true;

        // Log the admin activity
        const headersList = headers();
        const ipAddress = headersList.get('x-forwarded-for') || 'unknown';

        await AdminActivity.create({
          adminId: adminUser._id.toString(),
          adminEmail: adminUser.email,
          action: 'view_projects',
          details: 'Admin viewed all projects',
          ipAddress,
        });
      }
    }

    // If not admin, check for regular user authentication
    const { userId } = auth();

    if (!isAdmin && !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const userIdParam = url.searchParams.get('userId');

    let query = {};

    // If admin, return all projects or filter by userId if provided
    if (isAdmin) {
      if (userIdParam) {
        query = { userId: userIdParam };
      }
      // If no userIdParam, return all projects (empty query)
    } else {
      // For regular users, only return their own projects
      query = { userId };
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
