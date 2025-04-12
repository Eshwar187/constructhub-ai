#!/bin/bash

# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Clean up previous build artifacts
echo "Cleaning up previous build..."
rm -rf .next

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

echo "Build completed successfully!"
