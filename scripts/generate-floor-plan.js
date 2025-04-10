const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Generate a floor plan using the Python script
 * @param {string} projectId - The project ID
 * @param {string} prompt - The floor plan prompt
 * @returns {Promise<Object>} - The result object
 */
async function generateFloorPlan(projectId, prompt) {
  return new Promise((resolve, reject) => {
    // Make sure the public/floor-plans directory exists
    const outputDir = path.join(__dirname, '../public/floor-plans');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Generating floor plan for project ${projectId} with prompt: ${prompt}`);
    
    // Spawn the Python process
    const pythonProcess = spawn('python', [
      path.join(__dirname, 'generate_floor_plan.py'),
      projectId,
      prompt
    ]);
    
    let outputData = '';
    let errorData = '';
    
    // Collect stdout data
    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
      console.log(`Python stdout: ${data}`);
    });
    
    // Collect stderr data
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error(`Python stderr: ${data}`);
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      
      if (code !== 0) {
        return reject(new Error(`Python process exited with code ${code}: ${errorData}`));
      }
      
      try {
        // Extract the JSON result from the output
        const jsonMatch = outputData.match(/({.*})/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return resolve(result);
        } else {
          return reject(new Error('Could not parse JSON result from Python output'));
        }
      } catch (error) {
        return reject(new Error(`Error parsing Python output: ${error.message}`));
      }
    });
  });
}

// If this script is run directly, execute the function with command line arguments
if (require.main === module) {
  const projectId = process.argv[2];
  const prompt = process.argv[3];
  
  if (!projectId || !prompt) {
    console.error('Usage: node generate-floor-plan.js <projectId> <prompt>');
    process.exit(1);
  }
  
  generateFloorPlan(projectId, prompt)
    .then(result => {
      console.log('Floor plan generated successfully:');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error('Error generating floor plan:', error);
      process.exit(1);
    });
} else {
  // Export the function for use in other modules
  module.exports = { generateFloorPlan };
}
