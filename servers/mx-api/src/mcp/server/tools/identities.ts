import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../api-client.js';

// Default fields configuration
const DEFAULT_IDENTITY_FIELDS = ['identity', 'name', 'description', 'rank', 'score', 'apr', 'validators', 'stake', 'stakePercent', 'website', 'location'];

interface Identity {
    identity: string;
    name: string;
    description: string;
    avatar: string;
    website?: string;
    twitter?: string;
    location: string;
    score?: number;
    validators: number;
    stake: string;
    topUp: string;
    locked: string;
    distribution: {
        total: string;
        distributed: string;
        undistributed: string;
    };
    providers?: {
        provider: string;
        apr: number;
        numNodes: number;
        stake: string;
        topUp: string;
        locked: string;
        featured: boolean;
    }[];
    stakePercent?: number;
    rank?: number;
    apr?: number;
}

export const identityTools = [
    {
        name: 'get_identities',
        description: 'List of all node identities, used to group nodes by the same entity. "Free-floating" nodes that do not belong to any identity will also be returned',
        inputSchema: {
            type: 'object',
            properties: {
                from: {
                    type: 'number',
                    description: 'Number of items to skip for the result set'
                },
                size: {
                    type: 'number',
                    description: 'Number of items to retrieve'
                },
                identities: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by comma-separated list of identities'
                },
                sort: {
                    type: 'string',
                    enum: ['validators', 'stake', 'locked'],
                    description: 'Sort criteria (comma-separated list: validators,stake,locked)'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            }
        }
    },
    {
        name: 'get_identity',
        description: 'Returns the details of a single identity',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Identity identifier'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['identifier']
        }
    },
    {
        name: 'get_identity_avatar',
        description: 'Returns the avatar of a specific identity',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Identity identifier'
                }
            },
            required: ['identifier']
        }
    }
];

export async function handleGetIdentities(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (input.from !== undefined) queryParams.append('from', input.from.toString());
        if (input.size !== undefined) queryParams.append('size', input.size.toString());
        if (input.identities !== undefined) queryParams.append('identities', input.identities.join(','));
        if (input.sort !== undefined) queryParams.append('sort', input.sort);

        // Handle fields parameter
        const fieldsToRetrieve = input.fields || DEFAULT_IDENTITY_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/identities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<Identity[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(identity => {
                const filteredIdentity: Partial<Identity> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in identity) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredIdentity as any)[field] = identity[field as keyof Identity];
                    }
                });
                return filteredIdentity as Identity;
            });
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(filteredResponse, null, 2)
                }
            ]
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to fetch identities: ${errorMessage}`
        );
    }
}

export async function handleGetIdentity(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!input.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Identity identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = input.fields || DEFAULT_IDENTITY_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/identities/${input.identifier}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<Identity>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredIdentity: Partial<Identity> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredIdentity as any)[field] = response[field as keyof Identity];
                }
            });
            filteredResponse = filteredIdentity as Identity;
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(filteredResponse, null, 2)
                }
            ]
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to fetch identity: ${errorMessage}`
        );
    }
}

export async function handleGetIdentityAvatar(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!input.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Identity identifier is required');
        }

        const url = `/identities/${input.identifier}/avatar`;
        const response = await mxApiClient.get<string>(url);

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(response, null, 2)
                }
            ]
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to fetch identity avatar: ${errorMessage}`
        );
    }
}
