import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../api-client.js';

// Default fields configuration
const DEFAULT_TRANSFERS_FIELDS = ['txHash', 'sender', 'receiver', 'value', 'status', 'timestamp'];

// Basic interfaces
interface AccountAssets {
    // Empty object as per the schema
}

interface ScamInfo {
    type: string | null;
    info: string | null;
}

interface TransactionAction {
    category: string;
    name: string;
    description: string;
    arguments: object;
}

// Main transfer interface
interface Transfer {
    txHash: string;
    gasLimit: number;
    gasPrice: number;
    gasUsed: number;
    miniBlockHash: string;
    nonce: number;
    receiver: string;
    receiverUsername: string | null;
    receiverAssets: AccountAssets | null;
    receiverShard: number;
    round: number;
    sender: string;
    senderUsername: string | null;
    senderAssets: AccountAssets | null;
    senderShard: number;
    signature: string;
    status: string;
    value: string;
    fee: string;
    timestamp: number;
    data: string | null;
    function: string | null;
    action: TransactionAction | null;
    scamInfo: ScamInfo | null;
    type: 'Transaction' | 'SmartContractResult' | 'Reward' | null;
    originalTxHash: string | null;
    pendingResults: boolean | null;
    guardianAddress: string | null;
    guardianSignature: string | null;
    isRelayed: string | null;
    relayer: string | null;
    relayerSignature: string | null;
    isScCall: boolean | null;
}

// Define the transfer tools
export const transferTools = [
    {
        name: 'get-transfers',
        description: 'Returns both transfers triggered by a user account (type = Transaction), as well as transfers triggered by smart contracts (type = SmartContractResult)',
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
                receiver: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Search by multiple receiver addresses, comma-separated'
                },
                sender: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Search by multiple sender addresses, comma-separated'
                },
                token: {
                    type: 'string',
                    description: 'Identifier of the token'
                },
                function: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter transfers by function name'
                },
                senderShard: {
                    type: 'number',
                    description: 'Id of the shard the sender address belongs to'
                },
                receiverShard: {
                    type: 'number',
                    description: 'Id of the shard the receiver address belongs to'
                },
                miniBlockHash: {
                    type: 'string',
                    description: 'Filter by miniblock hash'
                },
                hashes: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by a comma-separated list of transfer hashes'
                },
                status: {
                    type: 'string',
                    enum: ['success', 'pending', 'invalid', 'fail'],
                    description: 'Status of the transaction (success / pending / invalid / fail)'
                },
                before: {
                    type: 'number',
                    description: 'Before timestamp'
                },
                after: {
                    type: 'number',
                    description: 'After timestamp'
                },
                round: {
                    type: 'number',
                    description: 'Round number'
                },
                order: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: 'Sort order (asc/desc)'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                },
                relayer: {
                    type: 'string',
                    description: 'Filter by relayer address'
                },
                isRelayed: {
                    type: 'boolean',
                    description: 'Returns relayed transactions details'
                },
                isScCall: {
                    type: 'boolean',
                    description: 'Returns smart contract calls'
                },
                withScamInfo: {
                    type: 'boolean',
                    description: 'Returns scam information'
                },
                withUsername: {
                    type: 'boolean',
                    description: 'Integrates username in assets for all addresses present in the transfers'
                },
                withBlockInfo: {
                    type: 'boolean',
                    description: 'Returns sender / receiver block details'
                }
            }
        }
    },
    {
        name: 'get-transfers-count',
        description: 'Return total count of transfers triggered by a user account (type = Transaction), as well as transfers triggered by smart contracts (type = SmartContractResult)',
        inputSchema: {
            type: 'object',
            properties: {
                receiver: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Search by multiple receiver addresses, comma-separated'
                },
                sender: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Search by multiple sender addresses, comma-separated'
                },
                token: {
                    type: 'string',
                    description: 'Identifier of the token'
                },
                function: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter transfers by function name'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                },
                senderShard: {
                    type: 'number',
                    description: 'Id of the shard the sender address belongs to'
                },
                receiverShard: {
                    type: 'number',
                    description: 'Id of the shard the receiver address belongs to'
                },
                miniBlockHash: {
                    type: 'string',
                    description: 'Filter by miniblock hash'
                },
                hashes: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by a comma-separated list of transfer hashes'
                },
                status: {
                    type: 'string',
                    enum: ['success', 'pending', 'invalid', 'fail'],
                    description: 'Status of the transaction (success / pending / invalid / fail)'
                },
                before: {
                    type: 'number',
                    description: 'Before timestamp'
                },
                after: {
                    type: 'number',
                    description: 'After timestamp'
                },
                round: {
                    type: 'number',
                    description: 'Round number'
                },
                relayer: {
                    type: 'string',
                    description: 'Filter by relayer address'
                },
                isRelayed: {
                    type: 'boolean',
                    description: 'Returns relayed transactions details'
                },
                isScCall: {
                    type: 'boolean',
                    description: 'Returns smart contract calls'
                },
                withScamInfo: {
                    type: 'boolean',
                    description: 'Returns scam information'
                },
                withUsername: {
                    type: 'boolean',
                    description: 'Integrates username in assets for all addresses present in the transfers'
                },
                withBlockInfo: {
                    type: 'boolean',
                    description: 'Returns sender / receiver block details'
                }
            }
        }
    }
];

// Handler functions
export async function handleGetTransfers(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) {
            queryParams.append('from', params.from.toString());
        }
        
        if (params.size !== undefined) {
            queryParams.append('size', params.size.toString());
        }
        
        if (params.receiver !== undefined) {
            queryParams.append('receiver', Array.isArray(params.receiver) ? params.receiver.join(',') : params.receiver);
        }
        
        if (params.sender !== undefined) {
            queryParams.append('sender', Array.isArray(params.sender) ? params.sender.join(',') : params.sender);
        }
        
        if (params.token !== undefined) {
            queryParams.append('token', params.token);
        }
        
        if (params.function !== undefined) {
            queryParams.append('function', Array.isArray(params.function) ? params.function.join(',') : params.function);
        }
        
        if (params.senderShard !== undefined) {
            queryParams.append('senderShard', params.senderShard.toString());
        }
        
        if (params.receiverShard !== undefined) {
            queryParams.append('receiverShard', params.receiverShard.toString());
        }
        
        if (params.miniBlockHash !== undefined) {
            queryParams.append('miniBlockHash', params.miniBlockHash);
        }
        
        if (params.hashes !== undefined) {
            queryParams.append('hashes', Array.isArray(params.hashes) ? params.hashes.join(',') : params.hashes);
        }
        
        if (params.status !== undefined) {
            queryParams.append('status', params.status);
        }
        
        if (params.before !== undefined) {
            queryParams.append('before', params.before.toString());
        }
        
        if (params.after !== undefined) {
            queryParams.append('after', params.after.toString());
        }
        
        if (params.round !== undefined) {
            queryParams.append('round', params.round.toString());
        }
        
        if (params.order !== undefined) {
            queryParams.append('order', params.order);
        }
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TRANSFERS_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }
        
        if (params.relayer !== undefined) {
            queryParams.append('relayer', params.relayer);
        }
        
        if (params.isRelayed !== undefined) {
            queryParams.append('isRelayed', params.isRelayed.toString());
        }
        
        if (params.isScCall !== undefined) {
            queryParams.append('isScCall', params.isScCall.toString());
        }
        
        if (params.withScamInfo !== undefined) {
            queryParams.append('withScamInfo', params.withScamInfo.toString());
        }
        
        if (params.withUsername !== undefined) {
            queryParams.append('withUsername', params.withUsername.toString());
        }
        
        if (params.withBlockInfo !== undefined) {
            queryParams.append('withBlockInfo', params.withBlockInfo.toString());
        }
        
        const url = `/transfers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<Transfer[]>(url);
        
        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(transfer => {
                const filteredTransfer: Partial<Transfer> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in transfer) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredTransfer as any)[field] = transfer[field as keyof Transfer];
                    }
                });
                return filteredTransfer as Transfer;
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
            `Failed to get transfers: ${errorMessage}`
        );
    }
}

export async function handleGetTransfersCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.receiver !== undefined) {
            queryParams.append('receiver', Array.isArray(params.receiver) ? params.receiver.join(',') : params.receiver);
        }
        
        if (params.sender !== undefined) {
            queryParams.append('sender', Array.isArray(params.sender) ? params.sender.join(',') : params.sender);
        }
        
        if (params.token !== undefined) {
            queryParams.append('token', params.token);
        }
        
        if (params.function !== undefined) {
            queryParams.append('function', Array.isArray(params.function) ? params.function.join(',') : params.function);
        }
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || [];
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }
        
        if (params.senderShard !== undefined) {
            queryParams.append('senderShard', params.senderShard.toString());
        }
        
        if (params.receiverShard !== undefined) {
            queryParams.append('receiverShard', params.receiverShard.toString());
        }
        
        if (params.miniBlockHash !== undefined) {
            queryParams.append('miniBlockHash', params.miniBlockHash);
        }
        
        if (params.hashes !== undefined) {
            queryParams.append('hashes', Array.isArray(params.hashes) ? params.hashes.join(',') : params.hashes);
        }
        
        if (params.status !== undefined) {
            queryParams.append('status', params.status);
        }
        
        if (params.before !== undefined) {
            queryParams.append('before', params.before.toString());
        }
        
        if (params.after !== undefined) {
            queryParams.append('after', params.after.toString());
        }
        
        if (params.round !== undefined) {
            queryParams.append('round', params.round.toString());
        }
        
        if (params.relayer !== undefined) {
            queryParams.append('relayer', params.relayer);
        }
        
        if (params.isRelayed !== undefined) {
            queryParams.append('isRelayed', params.isRelayed.toString());
        }
        
        if (params.isScCall !== undefined) {
            queryParams.append('isScCall', params.isScCall.toString());
        }
        
        if (params.withScamInfo !== undefined) {
            queryParams.append('withScamInfo', params.withScamInfo.toString());
        }
        
        if (params.withUsername !== undefined) {
            queryParams.append('withUsername', params.withUsername.toString());
        }
        
        if (params.withBlockInfo !== undefined) {
            queryParams.append('withBlockInfo', params.withBlockInfo.toString());
        }
        
        const url = `/transfers/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<any>(url);
        
        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            // For count endpoints, we typically don't need to filter as the response is usually simple
            // But we'll implement it for consistency
            const filteredCount: Partial<any> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    (filteredCount as any)[field] = response[field as keyof any];
                }
            });
            filteredResponse = filteredCount;
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
            `Failed to get transfers count: ${errorMessage}`
        );
    }
}
