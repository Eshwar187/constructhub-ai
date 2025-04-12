#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Wrapper script for generate_floor_plan.py that handles Unicode characters properly.
This script ensures that the floor plan generator can process descriptions with special characters.
"""

import os
import sys
import subprocess
import json

def main():
    """Main function to run the floor plan generator with proper Unicode handling"""
    if len(sys.argv) < 3:
        print("Usage: python run_floor_plan.py <project_id> <prompt>")
        sys.exit(1)

    project_id = sys.argv[1]
    description = sys.argv[2]
    
    # Replace problematic Unicode characters with ASCII equivalents
    description = description.replace('₹', 'Rs.')
    
    print(f"Processing project: {project_id}")
    print(f"Description: {description[:100]}...")
    
    # Get the path to the generate_floor_plan.py script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    generator_script = os.path.join(script_dir, "generate_floor_plan.py")
    
    # Set environment variables to handle Unicode
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    
    try:
        # Run the generator script with the processed description
        result = subprocess.run(
            [sys.executable, generator_script, project_id, description],
            capture_output=True,
            text=True,
            encoding='utf-8',
            env=env
        )
        
        # Check for errors
        if result.returncode != 0:
            print(f"Error running floor plan generator: {result.stderr}")
            sys.exit(1)
        
        # Extract the JSON result from the output
        output = result.stdout
        json_start = output.find("===JSON_RESULT_START===")
        json_end = output.find("===JSON_RESULT_END===")
        
        if json_start >= 0 and json_end >= 0:
            json_str = output[json_start + len("===JSON_RESULT_START==="):json_end].strip()
            try:
                result_data = json.loads(json_str)
                print(json.dumps(result_data))
            except json.JSONDecodeError:
                print("Error parsing JSON result")
                print(output)
        else:
            print(output)
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
