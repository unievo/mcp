#!/usr/bin/env python3
import json
from pathlib import Path


def extract_all_endpoints():
    """
    Extract all endpoints from mx-api.json into mx-api-endpoints.json with only path and method
    """
    # Get the directory of the current script
    script_dir = Path(__file__).parent.absolute()

    # Define input and output file paths
    # get input file from https://api.multiversx.com/-json
    input_file = script_dir / '_mx-api.json'
    output_file = script_dir / '_mx-api-endpoints-list.json'

    # Read the input file
    with open(input_file, 'r') as f:
        api_spec = json.load(f)

    # Extract all paths and their methods (only GET or POST)
    endpoints = []

    for path, methods in api_spec['paths'].items():
        for method in methods:
            if method.lower() in ['get', 'post']:
                endpoints.append({
                    'path': path,
                    'method': method.upper()
                })

    # Sort endpoints by path
    endpoints.sort(key=lambda x: x['path'])

    # Write to output file with pretty formatting
    with open(output_file, 'w') as f:
        json.dump(endpoints, f, indent=2)

    print(f"Extracted {len(endpoints)} endpoints to {output_file}")


if __name__ == '__main__':
    extract_all_endpoints()
