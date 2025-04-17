#!/usr/bin/env python3
import json
from pathlib import Path
from collections import defaultdict


def extract_by_segment():
    """
    Extract endpoints from mx-api-endpoints.json and group them by first path segment.
    Creates separate files for each segment named mx-api-{segment}.json
    Also creates separate files for GET and POST methods named mx-api-{segment}-get.json and mx-api-{segment}-post.json
    """
    # Get the directory of the current script
    script_dir = Path(__file__).parent.absolute()

    # Define input file path
    input_file = script_dir / '_mx-api-endpoints-list.json'

    # Read the input file
    with open(input_file, 'r') as f:
        endpoints = json.load(f)

    # Group endpoints by first path segment
    segment_endpoints = defaultdict(list)
    segment_get_endpoints = defaultdict(list)
    segment_post_endpoints = defaultdict(list)

    for endpoint in endpoints:
        path = endpoint['path']
        method = endpoint['method']

        # Extract first segment (skip leading slash)
        segments = path.split('/')
        first_segment = segments[1] if len(segments) > 1 else 'root'

        # Add to the general segment list
        segment_endpoints[first_segment].append(endpoint)

        # Add to the method-specific lists
        if method == 'GET':
            segment_get_endpoints[first_segment].append(endpoint)
        elif method == 'POST':
            segment_post_endpoints[first_segment].append(endpoint)

    # Create separate files for GET endpoints
    for segment, endpoints_list in segment_get_endpoints.items():
        # Sort endpoints by path
        endpoints_list.sort(key=lambda x: x['path'])

        # Create output file
        output_file = script_dir / f'mx-api-{segment}-get-list.json'

        # Write to output file with pretty formatting
        with open(output_file, 'w') as f:
            json.dump(endpoints_list, f, indent=2)

        print(
            f"Extracted {len(endpoints_list)} GET endpoints to {output_file}")

    # Create separate files for POST endpoints
    for segment, endpoints_list in segment_post_endpoints.items():
        # Sort endpoints by path
        endpoints_list.sort(key=lambda x: x['path'])

        # Create output file
        output_file = script_dir / f'mx-api-{segment}-post-list.json'

        # Write to output file with pretty formatting
        with open(output_file, 'w') as f:
            json.dump(endpoints_list, f, indent=2)

        print(
            f"Extracted {len(endpoints_list)} POST endpoints to {output_file}")


if __name__ == '__main__':
    extract_by_segment()
