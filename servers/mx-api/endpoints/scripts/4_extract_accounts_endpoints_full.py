#!/usr/bin/env python3
import json
from pathlib import Path
from collections import deque


def extract_schema_references(obj, refs=None):
    """
    Recursively extract all schema references from an object.
    Returns a set of all schema references found.
    """
    if refs is None:
        refs = set()

    if isinstance(obj, dict):
        for key, value in obj.items():
            if key == '$ref' and isinstance(value, str) and value.startswith('#/components/schemas/'):
                # Extract the schema name from the reference
                schema_name = value.replace('#/components/schemas/', '')
                refs.add(schema_name)
            else:
                extract_schema_references(value, refs)
    elif isinstance(obj, list):
        for item in obj:
            extract_schema_references(item, refs)

    return refs


def extract_required_schemas(api_spec, endpoint_paths):
    """
    Get all schemas required by the given endpoints, including nested dependencies.
    Returns a dictionary of required schemas.
    """
    # Start with direct references from endpoints
    all_refs = set()
    for path, methods in endpoint_paths.items():
        extract_schema_references(methods, all_refs)

    # Process queue to find all nested dependencies
    schemas_to_process = deque(all_refs)
    processed_schemas = set()

    while schemas_to_process:
        schema_name = schemas_to_process.popleft()

        if schema_name in processed_schemas:
            continue

        processed_schemas.add(schema_name)

        # Find this schema in the components
        if 'components' in api_spec and 'schemas' in api_spec['components'] and schema_name in api_spec['components']['schemas']:
            schema = api_spec['components']['schemas'][schema_name]

            # Extract references from this schema
            new_refs = extract_schema_references(schema)

            # Add new references to the processing queue
            for ref in new_refs:
                if ref not in processed_schemas:
                    schemas_to_process.append(ref)

    # Create a dictionary with only the required schemas
    required_schemas = {}
    if 'components' in api_spec and 'schemas' in api_spec['components']:
        for schema_name in processed_schemas:
            if schema_name in api_spec['components']['schemas']:
                required_schemas[schema_name] = api_spec['components']['schemas'][schema_name]

    return required_schemas


def write_components_file(schemas, output_file):
    """
    Write the components schemas to a separate file.
    """
    components_spec = {
        'components': {
            'schemas': schemas
        }
    }

    with open(output_file, 'w') as f:
        json.dump(components_spec, f, indent=2)

    print(f"Extracted {len(schemas)} schemas to {output_file}")


def extract_accounts_endpoints_by_third_segment():
    """
    Extract full endpoint details for /accounts/{address}/* from mx-api.json 
    and group them by the third path segment.
    Creates separate files for each third segment named mx-api-accounts-{segment}-endpoints.json
    Also creates separate files for GET and POST methods.
    Includes only the necessary components/schemas for each endpoint.
    Additionally creates separate component files with -components appended to the endpoint filename.
    """
    # Get the directory of the current script
    script_dir = Path(__file__).parent.absolute()

    # Define input file path
    input_file = script_dir / '_mx-api.json'

    # Read the input file
    with open(input_file, 'r') as f:
        api_spec = json.load(f)

    # Get all unique third segments for /accounts/{address}/* paths
    third_segments = set()
    for path in api_spec['paths'].keys():
        segments = path.split('/')
        # Check if this is an accounts/{address}/* endpoint
        if len(segments) > 3 and segments[1] == 'accounts' and segments[2].startswith('{') and segments[2].endswith('}'):
            if len(segments) > 3:  # Ensure there's a third segment
                third_segments.add(segments[3])

    # Create a file for each third segment with only matching endpoints
    for segment in third_segments:
        # Filter paths that match the pattern /accounts/{address}/{segment}
        segment_paths = {}
        segment_get_paths = {}
        segment_post_paths = {}

        for path, methods in api_spec['paths'].items():
            segments = path.split('/')
            # Check if this is an accounts/{address}/{segment} endpoint
            if (len(segments) > 3 and
                segments[1] == 'accounts' and
                segments[2].startswith('{') and segments[2].endswith('}') and
                    segments[3] == segment):

                segment_paths[path] = methods

                # Separate GET and POST methods
                if 'get' in methods:
                    segment_get_paths[path] = {'get': methods['get']}
                if 'post' in methods:
                    segment_post_paths[path] = {'post': methods['post']}

        # Skip if no endpoints were found for this segment
        if not segment_paths:
            continue

        # Extract required schemas for all endpoints in this segment
        all_required_schemas = extract_required_schemas(
            api_spec, segment_paths)

        # Create output for all methods
        output_spec = {
            'openapi': api_spec['openapi'],
            'paths': segment_paths
        }

        # Add required schemas if any were found
        if all_required_schemas:
            output_spec['components'] = {
                'schemas': all_required_schemas
            }

        # Create GET-specific output if there are any GET endpoints
        if segment_get_paths:
            # Extract required schemas for GET endpoints
            get_schemas = extract_required_schemas(api_spec, segment_get_paths)

            get_output_spec = {
                'openapi': api_spec['openapi'],
                'paths': segment_get_paths
            }

            # Add required schemas if any were found
            if get_schemas:
                get_output_spec['components'] = {
                    'schemas': get_schemas
                }

            get_output_file = script_dir / \
                f'mx-api-accounts-{segment}-get-endpoints.json'

            with open(get_output_file, 'w') as f:
                json.dump(get_output_spec, f, indent=2)

            print(
                f"Extracted {len(segment_get_paths)} GET endpoints to {get_output_file}")

            # Create a separate components file for GET endpoints
            # if get_schemas:
            #     get_components_file = script_dir / \
            #         f'mx-api-accounts-{segment}-get-components.json'
            #     write_components_file(get_schemas, get_components_file)

        # Create POST-specific output if there are any POST endpoints
        if segment_post_paths:
            # Extract required schemas for POST endpoints
            post_schemas = extract_required_schemas(
                api_spec, segment_post_paths)

            post_output_spec = {
                'openapi': api_spec['openapi'],
                'paths': segment_post_paths
            }

            # Add required schemas if any were found
            if post_schemas:
                post_output_spec['components'] = {
                    'schemas': post_schemas
                }

            post_output_file = script_dir / \
                f'mx-api-accounts-{segment}-post-endpoints.json'

            with open(post_output_file, 'w') as f:
                json.dump(post_output_spec, f, indent=2)

            print(
                f"Extracted {len(segment_post_paths)} POST endpoints to {post_output_file}")

            # Create a separate components file for POST endpoints
            # if post_schemas:
            #     post_components_file = script_dir / \
            #         f'mx-api-accounts-{segment}-post-components.json'
            #     write_components_file(post_schemas, post_components_file)


if __name__ == '__main__':
    extract_accounts_endpoints_by_third_segment()
