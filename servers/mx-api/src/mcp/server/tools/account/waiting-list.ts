import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_WAITING_LIST_FIELDS = ['address', 'nodes'];

interface WaitingListNode {
    publicKey: string;
    rating: number;
    queueIndex: number;
    position: number;
}

interface WaitingListDetails {
    address: string;
    nodes: WaitingListNode[];
}

export const accountWaitingListTools = [
    {
        name: 'get_account_waiting_list',
        description: 'Returns all nodes in the node queue where the account is owner',
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

export async function handleGetAccountWaitingList(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_WAITING_LIST_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/waiting-list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<WaitingListDetails>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredWaitingList: Partial<WaitingListDetails> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredWaitingList as any)[field] = response[field as keyof WaitingListDetails];
                }
            });
            filteredResponse = filteredWaitingList as WaitingListDetails;
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
            `Failed to get account waiting list: ${errorMessage}`
        );
    }
}
