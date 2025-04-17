import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_ESDT_HISTORY_FIELDS = ['token', 'balance', 'timestamp'];

interface EsdtHistoryEntry {
    address: string;
    balance: string;
    timestamp: number;
    isSender?: boolean | null;
    token: string;
    identifier: string;
    tokenDetails?: {
        identifier: string;
        name: string;
        ticker: string;
        decimals: number;
        price: number;
        marketCap: number;
    };
    txHash?: string;
}

export const accountEsdtHistoryTools = [
    {
        name: 'get_account_esdt_history',
        description: 'Returns account esdts balance history',
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
                    description: 'Return entries before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return entries after given timestamp'
                },
                identifier: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filter by multiple esdt identifiers, comma-separated'
                },
                token: {
                    type: 'string',
                    description: 'Filter by token identifier'
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
        name: 'get_account_esdt_history_count',
        description: 'Returns total number of ESDT history entries for a given address',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                before: {
                    type: 'number',
                    description: 'Return entries before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return entries after given timestamp'
                },
                identifier: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filter by multiple esdt identifiers, comma-separated'
                },
                token: {
                    type: 'string',
                    description: 'Filter by token identifier'
                }
            },
            required: ['address']
        }
    }
];

export async function handleGetAccountEsdtHistory(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());
        if (params.token) queryParams.append('token', params.token);
        if (params.identifier) queryParams.append('identifier', params.identifier.join(','));
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_ESDT_HISTORY_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/esdthistory${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<EsdtHistoryEntry[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(entry => {
                const filteredEntry: Partial<EsdtHistoryEntry> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in entry) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredEntry as any)[field] = entry[field as keyof EsdtHistoryEntry];
                    }
                });
                return filteredEntry as EsdtHistoryEntry;
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
            `Failed to get account ESDT history: ${errorMessage}`
        );
    }
}

export async function handleGetAccountEsdtHistoryCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());
        if (params.token) queryParams.append('token', params.token);
        if (params.identifier) queryParams.append('identifier', params.identifier.join(','));

        const url = `/accounts/${params.address}/esdthistory/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get account ESDT history count: ${errorMessage}`
        );
    }
}
