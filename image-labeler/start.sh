#!/bin/bash

# Image Labeler Startup Script

echo "🚀 Starting Image Labeler..."

# Check if path is provided as command line argument
if [ $# -eq 1 ]; then
    export REACT_APP_IMAGES_PATH="$1"
    echo "📁 Using images path from command line argument: $REACT_APP_IMAGES_PATH"
elif [ -z "$REACT_APP_IMAGES_PATH" ]; then
    echo "⚠️  REACT_APP_IMAGES_PATH environment variable is not set"
    echo "Usage: $0 [images_directory_path]"
    echo "Or set the environment variable: export REACT_APP_IMAGES_PATH=\"/path/to/your/images/directory\""
    echo ""
    read -p "Enter the path to your images directory: " images_path
    export REACT_APP_IMAGES_PATH="$images_path"
fi

# Check if the images directory exists
if [ ! -d "$REACT_APP_IMAGES_PATH" ]; then
    echo "❌ Images directory not found: $REACT_APP_IMAGES_PATH"
    echo "Please check if the directory exists and you have read permissions."
    exit 1
fi

echo "📁 Images directory: $REACT_APP_IMAGES_PATH"
echo "🔧 Starting development server..."

# Start the application with the environment variable
REACT_APP_IMAGES_PATH="$REACT_APP_IMAGES_PATH" npm run dev 