import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_DEPLOY_FIELDS = ['address', 'deployTxHash', 'timestamp'];
const DEFAULT_CONTRACT_FIELDS = ['address', 'deployTxHash', 'timestamp'];
const DEFAULT_SC_RESULT_FIELDS = ['hash', 'receiver', 'function', 'status'];

interface AccountAssets {
    name?: string;
    description?: string;
    tags?: string[];
    website?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
    ledgerSignature?: string;
    lockedAccounts?: string;
    extraTokens?: string[];
    social?: {
        email?: string;
        blog?: string;
        twitter?: string;
        whitepaper?: string;
        coinmarketcap?: string;
        coingecko?: string;
    };
}

interface TransactionLogEvent {
    address: string;
    addressAssets?: AccountAssets | null;
    identifier: string;
    topics: string[];
    data: string;
    additionalData?: any;
    order?: number;
}

interface TransactionLog {
    id: string;
    address: string;
    events: TransactionLogEvent[];
    addressAssets?: AccountAssets | null;
}

interface TransactionAction {
    category: string;
    name: string;
    description: string;
    arguments: {
        [key: string]: string;
    };
}

interface DeployedContract {
    address: string;
    deployTxHash: string;
    timestamp: number;
    assets?: AccountAssets | null;
}

interface SmartContractResult {
    hash: string;
    timestamp: number;
    nonce: number;
    gasLimit: number;
    gasPrice: number;
    value: string;
    sender: string;
    receiver: string;
    data: string;
    prevTxHash: string;
    originalTxHash: string;
    callType: string;
    status: string;
    senderAssets?: AccountAssets | null;
    receiverAssets?: AccountAssets | null;
    relayedValue?: string;
    miniBlockHash?: string | null;
    logs?: TransactionLog | null;
    returnMessage?: string | null;
    action?: TransactionAction | null;
    function?: string | null;
}

interface ContractDetails {
    address: string;
    deployTxHash: string;
    timestamp: number;
    assets?: AccountAssets | null;
    scResults?: {
        txHash: string;
        timestamp: number;
        data: string;
        value: string;
        receiver: string;
        sender: string;
    }[];
}

export const accountContractTools = [
    {
        name: 'get_account_deploys',
        description: 'Returns deploys details for a given account',
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
        name: 'get_account_deploys_count',
        description: 'Returns total number of deploys for a given address',
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
    },
    {
        name: 'get_account_sc_results',
        description: 'Returns smart contract results where the account is sender or receiver',
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
        name: 'get_account_sc_results_count',
        description: 'Returns number of smart contract results where the account is sender or receiver',
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
    },
    {
        name: 'get_account_sc_result',
        description: 'Returns details of a smart contract result where the account is sender or receiver',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                scHash: {
                    type: 'string',
                    description: 'Smart contract result hash'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['address', 'scHash']
        }
    },
    {
        name: 'get_account_contracts',
        description: 'Returns contracts details for a given account',
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
        name: 'get_account_contracts_count',
        description: 'Returns total number of contracts for a given address',
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

export async function handleGetAccountDeploys(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_DEPLOY_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/deploys${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<DeployedContract[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(deploy => {
                const filteredDeploy: Partial<DeployedContract> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in deploy) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredDeploy as any)[field] = deploy[field as keyof DeployedContract];
                    }
                });
                return filteredDeploy as DeployedContract;
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
            `Failed to get account deploys: ${errorMessage}`
        );
    }
}

export async function handleGetAccountDeploysCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const url = `/accounts/${params.address}/deploys/count`;
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
            `Failed to get account deploys count: ${errorMessage}`
        );
    }
}

export async function handleGetAccountScResult(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }
        if (!params.scHash) {
            throw new McpError(ErrorCode.InvalidParams, 'Smart contract result hash is required');
        }

        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_SC_RESULT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/results/${params.scHash}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<SmartContractResult>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredResult: Partial<SmartContractResult> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredResult as any)[field] = response[field as keyof SmartContractResult];
                }
            });
            filteredResponse = filteredResult as SmartContractResult;
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
            `Failed to get account smart contract result: ${errorMessage}`
        );
    }
}

export async function handleGetAccountScResultsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const url = `/accounts/${params.address}/results/count`;
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
            `Failed to get account smart contract results count: ${errorMessage}`
        );
    }
}

export async function handleGetAccountScResults(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_SC_RESULT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/results${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<SmartContractResult[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(result => {
                const filteredResult: Partial<SmartContractResult> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in result) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredResult as any)[field] = result[field as keyof SmartContractResult];
                    }
                });
                return filteredResult as SmartContractResult;
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
            `Failed to get account smart contract results: ${errorMessage}`
        );
    }
}

export async function handleGetAccountContracts(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_CONTRACT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/contracts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<ContractDetails[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(contract => {
                const filteredContract: Partial<ContractDetails> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in contract) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredContract as any)[field] = contract[field as keyof ContractDetails];
                    }
                });
                return filteredContract as ContractDetails;
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
            `Failed to get account contracts: ${errorMessage}`
        );
    }
}

export async function handleGetAccountContractsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const url = `/accounts/${params.address}/contracts/count`;
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
            `Failed to get account contracts count: ${errorMessage}`
        );
    }
}
