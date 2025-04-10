import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Project } from '@/lib/db/models';

// Mock data for materials and professionals
// In a real application, this would come from an external API or database
const getMockMaterials = (budget: number, currency: string) => {
  return [
    {
      name: 'Premium Cement',
      cost: budget * 0.05,
      description: 'High-quality cement for durable construction',
    },
    {
      name: 'Standard Bricks',
      cost: budget * 0.03,
      description: 'Regular clay bricks for walls and structures',
    },
    {
      name: 'Eco-friendly Insulation',
      cost: budget * 0.02,
      description: 'Sustainable insulation material for energy efficiency',
    },
    {
      name: 'Weather-resistant Paint',
      cost: budget * 0.01,
      description: 'Long-lasting exterior paint with UV protection',
    },
    {
      name: 'Hardwood Flooring',
      cost: budget * 0.04,
      description: 'Premium hardwood for elegant interior flooring',
    },
  ];
};

// Local professionals have been removed as requested

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if the user is authorized to view this project
    if (project.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to view this project' },
        { status: 403 }
      );
    }

    // Get suggestions based on project details
    const materials = getMockMaterials(project.budget, project.currency);

    // Update the project with suggestions (professionals removed)
    project.suggestions = {
      materials,
      professionals: [] // Empty array as professionals have been removed
    };
    await project.save();

    return NextResponse.json(
      {
        materials,
        professionals: [] // Empty array as professionals have been removed
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    );
  }
}
