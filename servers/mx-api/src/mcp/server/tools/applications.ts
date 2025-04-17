import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../api-client.js';

// Default fields configuration
const DEFAULT_APPLICATION_FIELDS = ['contract', 'deployer', 'owner', 'codeHash', 'timestamp', 'balance', 'txCount'];

interface AccountAssets {
    // Empty object as per the schema
}

interface Application {
    contract: string;
    deployer: string;
    owner: string;
    codeHash: string;
    timestamp: number;
    assets: AccountAssets | null;
    balance: string;
    txCount?: number;
}

export const applicationTools = [
    {
        name: 'get_applications',
        description: 'Returns all smart contracts available on blockchain. By default it returns 25 smart contracts',
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
                before: {
                    type: 'number',
                    description: 'Before timestamp'
                },
                after: {
                    type: 'number',
                    description: 'After timestamp'
                },
                withTxCount: {
                    type: 'boolean',
                    description: 'Include transaction count'
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
        name: 'get_applications_count',
        description: 'Returns total number of smart contracts',
        inputSchema: {
            type: 'object',
            properties: {
                before: {
                    type: 'number',
                    description: 'Before timestamp'
                },
                after: {
                    type: 'number',
                    description: 'After timestamp'
                }
            }
        }
    },
    {
        name: 'get_application',
        description: 'Returns details of a smart contract',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'The address of the smart contract'
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

export async function handleGetApplications(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());
        if (params.withTxCount !== undefined) queryParams.append('withTxCount', params.withTxCount.toString());

        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_APPLICATION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/applications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<Application[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(application => {
                const filteredApplication: Partial<Application> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in application) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredApplication as any)[field] = application[field as keyof Application];
                    }
                });
                return filteredApplication as Application;
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
            `Failed to get applications: ${errorMessage}`
        );
    }
}

export async function handleGetApplicationsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());

        const url = `/applications/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get applications count: ${errorMessage}`
        );
    }
}

export async function handleGetApplication(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Application address is required');
        }

        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_APPLICATION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/applications/${params.address}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<Application>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredApplication: Partial<Application> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredApplication as any)[field] = response[field as keyof Application];
                }
            });
            filteredResponse = filteredApplication as Application;
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
            `Failed to get application: ${errorMessage}`
        );
    }
}
