import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_TRANSACTION_FIELDS = ['txHash', 'sender', 'receiver', 'value', 'status', 'timestamp'];

interface AccountAssets {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
    social?: {
        email?: string;
        blog?: string;
        twitter?: string;
        whitepaper?: string;
        coinmarketcap?: string;
        coingecko?: string;
    };
}

interface ScamInfo {
    type: string | null;
    info: string | null;
}

interface TransactionAction {
    category: string;
    name: string;
    description: string;
    arguments: {
        [key: string]: string;
    };
}

interface TransactionLogEvent {
    address: string;
    addressAssets?: AccountAssets;
    identifier: string;
    topics: string[];
    data: string;
    additionalData?: any;
    order?: number;
}

interface TransactionLog {
    id: string;
    address: string;
    addressAssets?: AccountAssets;
    events: TransactionLogEvent[];
}

interface TransactionDetails {
    txHash: string;
    gasLimit: number;
    gasPrice: number;
    gasUsed: number;
    miniBlockHash: string;
    nonce: number;
    receiver: string;
    receiverUsername?: string;
    receiverAssets?: AccountAssets;
    receiverShard: number;
    round: number;
    sender: string;
    senderUsername?: string;
    senderAssets?: AccountAssets;
    senderShard: number;
    signature: string;
    status: string;
    value: string;
    fee: string;
    timestamp: number;
    data?: string;
    function?: string;
    action?: TransactionAction;
    scamInfo?: ScamInfo;
    type?: string;
    originalTxHash?: string;
    pendingResults?: boolean;
    guardianAddress?: string;
    guardianSignature?: string;
    isRelayed?: string | boolean;
    relayer?: string;
    relayedValue?: string;
    relayerSignature?: string;
    isScCall?: boolean;
    results?: any[];
    operations?: any[];
    logs?: TransactionLog;
}

export const accountTransactionsTools = [
    {
        name: 'get-account-transactions',
        description: 'Returns details of all transactions where the account is sender or receiver',
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
                sender: {
                    type: 'string',
                    description: 'Address of the transaction sender'
                },
                receiver: {
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Address of the transaction receiver or multiple receivers (comma-separated)'
                },
                token: {
                    type: 'string',
                    description: 'Identifier of the token'
                },
                senderShard: {
                    type: 'number',
                    description: 'Id of the shard the sender address is in'
                },
                receiverShard: {
                    type: 'number',
                    description: 'Id of the shard the receiver address is in'
                },
                miniBlockHash: {
                    type: 'string',
                    description: 'Filter by miniblock hash'
                },
                hashes: {
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by a comma-separated list of transaction hashes'
                },
                status: {
                    type: 'string',
                    description: 'Status of the transaction (success/pending/invalid/fail)'
                },
                function: {
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by function name or multiple function names (comma-separated)'
                },
                before: {
                    type: 'number',
                    description: 'Return transactions before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return transactions after given timestamp'
                },
                round: {
                    type: 'number',
                    description: 'Filter by round number'
                },
                order: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: 'Sort order (asc/desc)'
                },
                withScResults: {
                    type: 'boolean',
                    description: 'Return smart contract results for transactions'
                },
                withOperations: {
                    type: 'boolean',
                    description: 'Return operations for transactions'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                },
                withLogs: {
                    type: 'boolean',
                    description: 'Return logs for transactions'
                },
                withScamInfo: {
                    type: 'boolean',
                    description: 'Returns scam information'
                },
                withUsername: {
                    type: 'boolean',
                    description: 'Integrates username in assets for all addresses present in the transactions'
                },
                withBlockInfo: {
                    type: 'boolean',
                    description: 'Returns sender / receiver block details'
                },
                senderOrReceiver: {
                    type: 'string',
                    description: 'One address that current address interacted with'
                },
                isRelayed: {
                    type: 'boolean',
                    description: 'Returns isRelayed transactions details'
                },
                isScCall: {
                    type: 'boolean',
                    description: 'Returns sc call transactions details'
                },
                withActionTransferValue: {
                    type: 'boolean',
                    description: 'Returns value in USD and EGLD for transferred tokens within the action attribute'
                },
                withRelayedScresults: {
                    type: 'boolean',
                    description: 'If set to true, will include smart contract results that resemble relayed transactions'
                },
                computeScamInfo: {
                    type: 'boolean',
                    description: 'Compute scam information for transactions'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'get-account-transactions-count',
        description: 'Returns total number of transactions for a given address where the account is sender or receiver',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                sender: {
                    type: 'string',
                    description: 'Address of the transaction sender'
                },
                receiver: {
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Address of the transaction receiver or multiple receivers (comma-separated)'
                },
                token: {
                    type: 'string',
                    description: 'Identifier of the token'
                },
                senderShard: {
                    type: 'number',
                    description: 'Id of the shard the sender address is in'
                },
                receiverShard: {
                    type: 'number',
                    description: 'Id of the shard the receiver address is in'
                },
                miniBlockHash: {
                    type: 'string',
                    description: 'Filter by miniblock hash'
                },
                hashes: {
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by a comma-separated list of transaction hashes'
                },
                status: {
                    type: 'string',
                    description: 'Status of the transaction (success/pending/invalid/fail)'
                },
                function: {
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by function name or multiple function names (comma-separated)'
                },
                before: {
                    type: 'number',
                    description: 'Return transactions before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return transactions after given timestamp'
                },
                round: {
                    type: 'number',
                    description: 'Filter by round number'
                },
                senderOrReceiver: {
                    type: 'string',
                    description: 'One address that current address interacted with'
                },
                isRelayed: {
                    type: 'boolean',
                    description: 'Returns isRelayed transactions details'
                },
                isScCall: {
                    type: 'boolean',
                    description: 'Returns sc call transactions details'
                },
                withRelayedScresults: {
                    type: 'boolean',
                    description: 'If set to true, will include smart contract results that resemble relayed transactions'
                }
            },
            required: ['address']
        }
    }
];

export async function handleGetAccountTransactions(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        // Pagination parameters
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        
        // Filter parameters
        if (params.sender) queryParams.append('sender', params.sender);
        if (params.receiver) queryParams.append('receiver', Array.isArray(params.receiver) ? params.receiver.join(',') : params.receiver);
        if (params.token) queryParams.append('token', params.token);
        if (params.senderShard !== undefined) queryParams.append('senderShard', params.senderShard.toString());
        if (params.receiverShard !== undefined) queryParams.append('receiverShard', params.receiverShard.toString());
        if (params.miniBlockHash) queryParams.append('miniBlockHash', params.miniBlockHash);
        if (params.hashes) queryParams.append('hashes', Array.isArray(params.hashes) ? params.hashes.join(',') : params.hashes);
        if (params.status) queryParams.append('status', params.status);
        if (params.function) queryParams.append('function', Array.isArray(params.function) ? params.function.join(',') : params.function);
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());
        if (params.round !== undefined) queryParams.append('round', params.round.toString());
        if (params.order) queryParams.append('order', params.order);
        if (params.withScResults !== undefined) queryParams.append('withScResults', params.withScResults.toString());
        if (params.withOperations !== undefined) queryParams.append('withOperations', params.withOperations.toString());
        if (params.withLogs !== undefined) queryParams.append('withLogs', params.withLogs.toString());
        if (params.withScamInfo !== undefined) queryParams.append('withScamInfo', params.withScamInfo.toString());
        if (params.withUsername !== undefined) queryParams.append('withUsername', params.withUsername.toString());
        if (params.withBlockInfo !== undefined) queryParams.append('withBlockInfo', params.withBlockInfo.toString());
        if (params.senderOrReceiver) queryParams.append('senderOrReceiver', params.senderOrReceiver);
        if (params.isRelayed !== undefined) queryParams.append('isRelayed', params.isRelayed.toString());
        if (params.isScCall !== undefined) queryParams.append('isScCall', params.isScCall.toString());
        if (params.withActionTransferValue !== undefined) queryParams.append('withActionTransferValue', params.withActionTransferValue.toString());
        if (params.withRelayedScresults !== undefined) queryParams.append('withRelayedScresults', params.withRelayedScresults.toString());
        if (params.computeScamInfo !== undefined) queryParams.append('computeScamInfo', params.computeScamInfo.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TRANSACTION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<TransactionDetails[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(transaction => {
                const filteredTransaction: Partial<TransactionDetails> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in transaction) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredTransaction as any)[field] = transaction[field as keyof TransactionDetails];
                    }
                });
                return filteredTransaction as TransactionDetails;
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
            `Failed to get account transactions: ${errorMessage}`
        );
    }
}

export async function handleGetAccountTransactionsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.sender) queryParams.append('sender', params.sender);
        if (params.receiver) queryParams.append('receiver', Array.isArray(params.receiver) ? params.receiver.join(',') : params.receiver);
        if (params.token) queryParams.append('token', params.token);
        if (params.senderShard !== undefined) queryParams.append('senderShard', params.senderShard.toString());
        if (params.receiverShard !== undefined) queryParams.append('receiverShard', params.receiverShard.toString());
        if (params.miniBlockHash) queryParams.append('miniBlockHash', params.miniBlockHash);
        if (params.hashes) queryParams.append('hashes', Array.isArray(params.hashes) ? params.hashes.join(',') : params.hashes);
        if (params.status) queryParams.append('status', params.status);
        if (params.function) queryParams.append('function', Array.isArray(params.function) ? params.function.join(',') : params.function);
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());
        if (params.round !== undefined) queryParams.append('round', params.round.toString());
        if (params.senderOrReceiver) queryParams.append('senderOrReceiver', params.senderOrReceiver);
        if (params.isRelayed !== undefined) queryParams.append('isRelayed', params.isRelayed.toString());
        if (params.isScCall !== undefined) queryParams.append('isScCall', params.isScCall.toString());
        if (params.withRelayedScresults !== undefined) queryParams.append('withRelayedScresults', params.withRelayedScresults.toString());

        const url = `/accounts/${params.address}/transactions/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get account transactions count: ${errorMessage}`
        );
    }
}
