import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Project } from '@/lib/db/models';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

// Promisify exec for async/await usage
const execAsync = promisify(exec);

// Function to generate floor plan blueprint image using the Python script with Gemini-enhanced blueprint generator
async function generateFloorPlan(projectId: string, prompt: string) {
  try {
    // Get the absolute path to the script
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate_floor_plan.py');

    // Escape the prompt for command line usage
    const escapedPrompt = prompt.replace(/"/g, '\\"');

    // Execute the Python script
    console.log(`Executing Python script: python ${scriptPath} ${projectId} "${escapedPrompt}"`);
    // Use python3 if on Linux/Mac, python if on Windows
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    const { stdout, stderr } = await execAsync(`${pythonCommand} "${scriptPath}" "${projectId}" "${escapedPrompt}"`);

    if (stderr) {
      console.error('Python script error:', stderr);
    }

    console.log('Python script output:', stdout);

    // Parse the JSON result from the output
    try {
      // Look for JSON between markers
      const jsonMatch = stdout.match(/===JSON_RESULT_START===\s*\n(.+?)\s*\n===JSON_RESULT_END===/s);
      if (jsonMatch && jsonMatch[1]) {
        const jsonStr = jsonMatch[1].trim();
        console.log('Found JSON string:', jsonStr.substring(0, 100) + '...');
        return JSON.parse(jsonStr);
      } else {
        // Fallback to the old method if markers aren't found
        const fallbackMatch = stdout.match(/(\{[\s\S]*\})(?![\s\S]*\{)/);
        if (fallbackMatch) {
          const jsonStr = fallbackMatch[0];
          console.log('Found JSON string (fallback):', jsonStr.substring(0, 100) + '...');
          return JSON.parse(jsonStr);
        } else {
          console.error('Could not find JSON in output');
          throw new Error('Could not parse JSON result from Python output');
        }
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error executing Python script:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { projectId, prompt } = await req.json();

    if (!projectId || !prompt) {
      return NextResponse.json(
        { error: 'Project ID and prompt are required' },
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

    // Check if the user is authorized to update this project
    if (project.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this project' },
        { status: 403 }
      );
    }

    let dataUrl = '';

    // Create the description for floor plan blueprint generation
    // This description will be analyzed by Google's Gemini API to create a more accurate floor plan
    const fullPrompt = `Professional architectural blueprint for a ${project.landArea} ${project.landUnit} house with ${prompt}. Top-down 2D floor plan with precise measurements, clean lines, labeled rooms, doors, windows, and dimensions. Technical architectural drawing style with blue lines on white background.`;
    console.log('Using description for blueprint generation:', fullPrompt);

    try {
      console.log('Generating floor plan using Python script...');

      // Call the Python script to generate the floor plan
      const result = await generateFloorPlan(project._id, fullPrompt);

      if (!result || !result.success) {
        throw new Error('Failed to generate floor plan');
      }

      console.log('Floor plan generated successfully');

      // Store the description in the project
      project.floorPlanDescription = result.description;

      // Create a data URL from the base64 image
      dataUrl = `data:image/png;base64,${result.imageData}`;

      // Create a public URL for the image file
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const publicImageUrl = `${baseUrl}/floor-plans/${project._id}.png`;

      console.log('Floor plan image saved at:', publicImageUrl);
    } catch (error) {
      console.error('Error generating floor plan:', error);

      // Return an error response
      return NextResponse.json(
        { error: 'Failed to generate floor plan. Please try again.' },
        { status: 500 }
      );
    }

    // Check if painting recommendations file exists
    const paintingFilePath = path.join(process.cwd(), 'public', 'floor-plans', `${project._id}_painting.json`);
    let paintingRecommendations = null;

    if (fs.existsSync(paintingFilePath)) {
      try {
        paintingRecommendations = JSON.parse(fs.readFileSync(paintingFilePath, 'utf8'));
        console.log('Found painting recommendations');
      } catch (error) {
        console.error('Error reading painting recommendations:', error);
      }
    }

    // Update the project with the floor plan
    project.floorPlan = dataUrl;
    await project.save();

    return NextResponse.json(
      {
        floorPlan: dataUrl,
        paintingRecommendations: paintingRecommendations
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating floor plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate floor plan' },
      { status: 500 }
    );
  }
}
