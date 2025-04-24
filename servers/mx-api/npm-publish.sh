#!/bin/bash

# Script to publish all .tgz files in the packages directory to npm with public access

# Directory containing the packages
PACKAGES_DIR="$(dirname "$0")/packages"

# Check if the directory exists
if [ ! -d "$PACKAGES_DIR" ]; then
  echo "Error: Packages directory not found at $PACKAGES_DIR"
  exit 1
fi

# Count the number of .tgz files
TGZ_COUNT=$(find "$PACKAGES_DIR" -name "*.tgz" | wc -l)

if [ "$TGZ_COUNT" -eq 0 ]; then
  echo "No .tgz files found in $PACKAGES_DIR"
  exit 0
fi

echo "Found $TGZ_COUNT .tgz files to publish"

# Process each .tgz file
for PACKAGE in "$PACKAGES_DIR"/*.tgz; do
  PACKAGE_FILENAME=$(basename "$PACKAGE")
  echo "Publishing $PACKAGE_FILENAME..."
  npm publish "$PACKAGE" --access public
  
  # Check the result of the publish command
  if [ $? -eq 0 ]; then
    echo "✅ Successfully published $PACKAGE_FILENAME"
  else
    echo "❌ Failed to publish $PACKAGE_FILENAME"
  fi
  
  # Add a small delay between publishes to avoid rate limiting
  sleep 1
done

echo "Publishing process completed"
