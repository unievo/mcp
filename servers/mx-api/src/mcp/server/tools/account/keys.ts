import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_KEY_FIELDS = ['blsKey', 'rewardAddress', 'stake', 'topUp', 'status'];

interface AccountKey {
    // Required fields according to schema
    blsKey: string;
    stake: string;
    topUp: string;
    status: string;
    rewardAddress: string;
    queueIndex: string | null;
    queueSize: string | null;
    remainingUnBondPeriod: number;
    
}

export const accountKeysTools = [
    {
        name: 'get_account_keys',
        description: 'Returns node keys for a given account',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                from: {
                    type: 'number',
                    description: 'Number of items to skip for the result set'
                },
                size: {
                    type: 'number',
                    description: 'Number of items to retrieve'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'get_account_keys_count',
        description: 'Returns number of node keys for a given account',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                }
            },
            required: ['address']
        }
    }
];

export async function handleGetAccountKeys(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_KEY_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/keys${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<AccountKey[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(key => {
                const filteredKey: Partial<AccountKey> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in key) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredKey as any)[field] = key[field as keyof AccountKey];
                    }
                });
                return filteredKey as AccountKey;
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
            `Failed to get account keys: ${errorMessage}`
        );
    }
}

export async function handleGetAccountKeysCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const url = `/accounts/${params.address}/keys/count`;
        const response = await mxApiClient.get<number>(url);

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ count: response }, null, 2)
                }
            ]
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get account keys count: ${errorMessage}`
        );
    }
}
