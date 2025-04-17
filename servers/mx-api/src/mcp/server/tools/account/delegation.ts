import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_DELEGATION_FIELDS = ['address', 'contract', 'userActiveStake', 'claimableRewards'];
const DEFAULT_DELEGATION_LEGACY_FIELDS = ['claimableRewards', 'userActiveStake', 'userWaitingStake'];

interface AccountUndelegation {
    // Required fields according to schema
    amount: string;
    seconds: number;
}

interface AccountDelegation {
    // Required fields according to schema
    address: string;
    contract: string;
    userUnBondable: string;
    userActiveStake: string;
    claimableRewards: string;
    userUndelegatedList: AccountUndelegation[];
}

interface AccountDelegationLegacy {
    // Required fields according to schema
    claimableRewards: string;
    userActiveStake: string;
    userDeferredPaymentStake: string;
    userUnstakedStake: string;
    userWaitingStake: string;
    userWithdrawOnlyStake: string;
}

export const accountDelegationTools = [
    {
        name: 'get_account_delegation',
        description: 'Summarizes all delegation positions with staking providers, together with unDelegation positions',
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
    },
    {
        name: 'get_account_delegation_legacy',
        description: 'Returns staking information related to the legacy delegation pool',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                timestamp: {
                    type: 'number',
                    description: 'Retrieve entry from timestamp'
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

export async function handleGetAccountDelegation(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_DELEGATION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/delegation${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<AccountDelegation[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(delegation => {
                const filteredDelegation: Partial<AccountDelegation> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in delegation) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredDelegation as any)[field] = delegation[field as keyof AccountDelegation];
                    }
                });
                return filteredDelegation as AccountDelegation;
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
            `Failed to get account delegation: ${errorMessage}`
        );
    }
}

export async function handleGetAccountDelegationLegacy(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        if (params.timestamp !== undefined) queryParams.append('timestamp', params.timestamp.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_DELEGATION_LEGACY_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/delegation-legacy${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<AccountDelegationLegacy>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredDelegation: Partial<AccountDelegationLegacy> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredDelegation as any)[field] = response[field as keyof AccountDelegationLegacy];
                }
            });
            filteredResponse = filteredDelegation as AccountDelegationLegacy;
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
            `Failed to get account legacy delegation: ${errorMessage}`
        );
    }
}
