import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_STAKE_FIELDS = ['totalStaked'];

interface StakeDetails {
    totalStaked: string;
    unstakedTokens?: {
        amount: string;
        expires: number | null;
        epochs: number | null;
    }[];
}

export const accountStakeTools = [
    {
        name: 'get_account_stake',
        description: 'Summarizes total staked amount for the given provider, as well as when and how much unbond will be performed',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
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

export async function handleGetAccountStake(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_STAKE_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/stake${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<StakeDetails>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredStake: Partial<StakeDetails> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredStake as any)[field] = response[field as keyof StakeDetails];
                }
            });
            filteredResponse = filteredStake as StakeDetails;
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
            `Failed to get account stake details: ${errorMessage}`
        );
    }
}
