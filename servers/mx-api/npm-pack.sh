#!/bin/bash

# Script to pack all package-*.json files except those specified in the excluded_files array
# For each file, it:
# 1. Renames the file to package.json
# 2. Renames the corresponding README-*.md file to README.md (if it exists)
# 3. Runs npm pack
# 4. Renames the files back to their original names

# Default configuration
dry_run=false
verbose=false
pattern="package-*.json"
packages_dir="packages"

# Configure excluded files in this array
excluded_files=(
  "package-lock.json"
  # Add more files to exclude as needed
)

# Function to display usage information
show_usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -h, --help                Show this help message"
  echo "  -d, --dry-run             Show what would be done without making changes"
  echo "  -v, --verbose             Show more detailed output"
  echo "  -p, --pattern PATTERN     File pattern to match (default: package-*.json)"
  echo "  -e, --exclude FILE        Add FILE to exclusion list (can be used multiple times)"
  echo "  -i, --include FILE        Process only these files (can be used multiple times)"
  echo "  --clear-excludes          Clear the default exclusion list"
  echo "  --packages-dir DIR        Directory to store generated packages (default: packages)"
  echo ""
  echo "Examples:"
  echo "  $0 --dry-run              Preview what would happen"
  echo "  $0 --exclude package-network.json --exclude package-tokens.json"
  echo "  $0 --include package-accounts.json --include package-transactions.json"
  echo "  $0 --pattern \"package-a*.json\"  Process only package files starting with 'a'"
}

# Parse command line arguments
include_files=()
while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      show_usage
      exit 0
      ;;
    -d|--dry-run)
      dry_run=true
      shift
      ;;
    -v|--verbose)
      verbose=true
      shift
      ;;
    -p|--pattern)
      pattern="$2"
      shift 2
      ;;
    -e|--exclude)
      excluded_files+=("$2")
      shift 2
      ;;
    -i|--include)
      include_files+=("$2")
      shift 2
      ;;
    --clear-excludes)
      excluded_files=()
      shift
      ;;
    --packages-dir)
      packages_dir="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      show_usage
      exit 1
      ;;
  esac
done

# Function to check if a file is in an array
is_in_array() {
  local element="$1"
  shift
  local array=("$@")
  for item in "${array[@]}"; do
    if [[ "$item" == "$element" ]]; then
      return 0
    fi
  done
  return 1
}

# Display configuration
echo "Starting to pack package files..."
echo "Pattern: $pattern"
echo "Excluded files: ${excluded_files[*]}"
if [[ ${#include_files[@]} -gt 0 ]]; then
  echo "Including only: ${include_files[*]}"
fi
echo "Packages directory: $packages_dir"
if [[ "$dry_run" == true ]]; then
  echo "DRY RUN MODE: No changes will be made"
fi
echo ""

# Create packages directory if it doesn't exist
if [[ "$dry_run" == false ]]; then
  if [[ ! -d "$packages_dir" ]]; then
    echo "Creating packages directory: $packages_dir"
    mkdir -p "$packages_dir"
  fi
fi

# Process files
for file in $pattern; do
  # Skip if file doesn't exist or doesn't match pattern
  if [[ ! -f "$file" ]]; then
    continue
  fi
  
  # Check if we're using include mode and this file isn't in the include list
  if [[ ${#include_files[@]} -gt 0 ]] && ! is_in_array "$file" "${include_files[@]}"; then
    [[ "$verbose" == true ]] && echo "Skipping non-included file: $file"
    continue
  fi
  
  # Check if the file is in the excluded_files array
  if is_in_array "$file" "${excluded_files[@]}"; then
    echo "Skipping excluded file: $file"
    continue
  fi
  
  # Extract the package name from the file name (e.g., "accounts" from "package-accounts.json")
  package_name=${file#package-}
  package_name=${package_name%.json}
  readme_file="README-${package_name}.md"
  
  # Track if we renamed the README file
  readme_renamed=false
  
  echo "Processing $file..."
  
  if [[ "$dry_run" == true ]]; then
    echo "  [DRY RUN] Would rename $file to package.json"
    if [[ -f "$readme_file" ]]; then
      echo "  [DRY RUN] Would rename $readme_file to README.md"
    fi
    echo "  [DRY RUN] Would run npm pack"
    echo "  [DRY RUN] Would move generated package to $packages_dir"
    echo "  [DRY RUN] Would rename package.json back to $file"
    if [[ -f "$readme_file" ]]; then
      echo "  [DRY RUN] Would rename README.md back to $readme_file"
    fi
    echo "  Done with $file (dry run)"
    echo ""
    continue
  fi
  
  # Backup any existing package.json and README.md
  if [ -f "package.json" ]; then
    echo "  Backing up existing package.json"
    mv package.json package.json.backup
  fi
  
  if [ -f "README.md" ]; then
    echo "  Backing up existing README.md"
    mv README.md README-.md.backup
  fi
  
  # Rename the package file to package.json
  echo "  Renaming $file to package.json"
  mv "$file" package.json
  
  # Rename the README file if it exists
  if [ -f "$readme_file" ]; then
    echo "  Renaming $readme_file to README.md"
    mv "$readme_file" README.md
    readme_renamed=true
  fi
  
  # Run npm pack
  echo "  Running npm pack..."
  if npm pack; then
    echo "  npm pack completed successfully"
    
    # Move the generated package to the packages directory
    # Get the package name and version from package.json
    pkg_name=$(node -e "console.log(require('./package.json').name.replace('@', '').replace('/', '-'))")
    pkg_version=$(node -e "console.log(require('./package.json').version)")
    tarball_name="${pkg_name}-${pkg_version}.tgz"
    
    if [[ -f "$tarball_name" ]]; then
      echo "  Moving $tarball_name to $packages_dir/"
      mv "$tarball_name" "$packages_dir/"
    else
      echo "  WARNING: Expected tarball $tarball_name not found"
    fi
  else
    echo "  ERROR: npm pack failed for $file"
    # Ensure we rename back even if npm pack fails
    echo "  Renaming package.json back to $file (after error)"
    mv package.json "$file"
    
    # Rename README.md back if it was renamed
    if [ "$readme_renamed" = true ] && [ -f "README.md" ]; then
      echo "  Renaming README.md back to $readme_file (after error)"
      mv README.md "$readme_file"
    fi
    
    # Restore backups if they exist
    if [ -f "package.json.backup" ]; then
      echo "  Restoring original package.json"
      mv package.json.backup package.json
    fi
    
    if [ -f "README.md.backup" ]; then
      echo "  Restoring original README.md"
      mv README.md.backup README.md
    fi
    
    echo "  Failed with $file"
    echo ""
    continue
  fi
  
  # Rename back to original
  echo "  Renaming package.json back to $file"
  mv package.json "$file"
  
  # Rename README.md back to the original README file if it was renamed
  if [ "$readme_renamed" = true ] && [ -f "README.md" ]; then
    echo "  Renaming README.md back to $readme_file"
    mv README.md "$readme_file"
  fi
  
  # Restore backups if they exist
  if [ -f "package.json.backup" ]; then
    echo "  Restoring original package.json"
    mv package.json.backup package.json
  fi
  
  if [ -f "README-.md.backup" ]; then
    echo "  Restoring original README.md"
    mv README-.md.backup README.md
  fi
  
  echo "  Done with $file"
  echo ""
done

echo "All packages have been processed!"
echo "Generated packages are available in the $packages_dir directory"
