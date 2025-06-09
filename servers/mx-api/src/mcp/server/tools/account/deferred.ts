import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_DEFERRED_FIELDS = ['deferredPayment', 'secondsLeft'];

interface AccountDeferred {
    deferredPayment: string;
    secondsLeft: number;
}

export const accountDeferredTools = [
    {
        name: 'get-account-deferred',
        description: 'Returns deferred payments for a given account',
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
    }
];

export async function handleGetAccountDeferred(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_DEFERRED_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/deferred${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<AccountDeferred[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(deferred => {
                const filteredDeferred: Partial<AccountDeferred> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in deferred) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredDeferred as any)[field] = deferred[field as keyof AccountDeferred];
                    }
                });
                return filteredDeferred as AccountDeferred;
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
            `Failed to get account deferred payments: ${errorMessage}`
        );
    }
}
