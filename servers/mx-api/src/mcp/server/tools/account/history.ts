import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_HISTORY_FIELDS = ['token', 'balance', 'timestamp'];
const DEFAULT_TOKEN_HISTORY_FIELDS = ['token', 'balance', 'timestamp'];

interface AccountHistoryEntry {
    address: string;
    balance: string;
    timestamp: number;
    isSender?: boolean | null;
}

interface AccountEsdtHistoryEntry {
    address: string;
    balance: string;
    timestamp: number;
    isSender?: boolean | null;
    token: string;
    identifier: string;
    txHash?: string;
}

export const accountHistoryTools = [
    {
        name: 'get_account_history',
        description: 'Return account network token balance history',
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
                before: {
                    type: 'number',
                    description: 'Before timestamp'
                },
                after: {
                    type: 'number',
                    description: 'After timestamp'
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
        name: 'get_account_history_count',
        description: 'Return account network token balance history count',
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
                before: {
                    type: 'number',
                    description: 'Before timestamp'
                },
                after: {
                    type: 'number',
                    description: 'After timestamp'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'get_account_token_history',
        description: 'Returns account network token balance history',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                tokenIdentifier: {
                    type: 'string',
                    description: 'Token identifier'
                },
                from: {
                    type: 'number',
                    description: 'Number of items to skip for the result set'
                },
                size: {
                    type: 'number',
                    description: 'Number of items to retrieve'
                },
                before: {
                    type: 'number',
                    description: 'Before timestamp'
                },
                after: {
                    type: 'number',
                    description: 'After timestamp'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['address', 'tokenIdentifier']
        }
    },
    {
        name: 'get_account_token_history_count',
        description: 'Return account token balance history count',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                tokenIdentifier: {
                    type: 'string',
                    description: 'Token identifier'
                },
                before: {
                    type: 'number',
                    description: 'Before timestamp'
                },
                after: {
                    type: 'number',
                    description: 'After timestamp'
                }
            },
            required: ['address', 'tokenIdentifier']
        }
    }
];

export async function handleGetAccountHistory(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_HISTORY_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<AccountHistoryEntry[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(entry => {
                const filteredEntry: Partial<AccountHistoryEntry> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in entry) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredEntry as any)[field] = entry[field as keyof AccountHistoryEntry];
                    }
                });
                return filteredEntry as AccountHistoryEntry;
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
            `Failed to get account history: ${errorMessage}`
        );
    }
}

export async function handleGetAccountHistoryCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());

        const url = `/accounts/${params.address}/history/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get account history count: ${errorMessage}`
        );
    }
}

export async function handleGetAccountTokenHistory(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }
        if (!params.tokenIdentifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TOKEN_HISTORY_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/history/${params.tokenIdentifier}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<AccountEsdtHistoryEntry[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(entry => {
                const filteredEntry: Partial<AccountEsdtHistoryEntry> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in entry) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredEntry as any)[field] = entry[field as keyof AccountEsdtHistoryEntry];
                    }
                });
                return filteredEntry as AccountEsdtHistoryEntry;
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
            `Failed to get account token history: ${errorMessage}`
        );
    }
}

export async function handleGetAccountTokenHistoryCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }
        if (!params.tokenIdentifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());

        const url = `/accounts/${params.address}/history/${params.tokenIdentifier}/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<{ count: number }>(url);

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
            `Failed to get account token history count: ${errorMessage}`
        );
    }
}
