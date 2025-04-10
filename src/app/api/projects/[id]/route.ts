import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Project, User } from '@/lib/db/models';
import { auth } from '@clerk/nextjs';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the project
    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if the user is authorized to view this project
    const user = await User.findOne({ clerkId: userId });
    
    if (project.userId !== userId && user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to view this project' },
        { status: 403 }
      );
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projectData = await req.json();

    // Connect to the database
    await connectToDatabase();

    // Find the project
    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if the user is authorized to update this project
    if (project.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this project' },
        { status: 403 }
      );
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      projectData,
      { new: true }
    );

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the project
    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if the user is authorized to delete this project
    const user = await User.findOne({ clerkId: userId });
    
    if (project.userId !== userId && user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to delete this project' },
        { status: 403 }
      );
    }

    // Delete the project
    await Project.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
