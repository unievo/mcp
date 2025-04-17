import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_TRANSFER_FIELDS = ['txHash', 'sender', 'receiver', 'value', 'status', 'timestamp'];

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

interface TransferDetails {
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

export const accountTransfersTools = [
    {
        name: 'get_account_transfers',
        description: 'Returns both transfers triggerred by a user account (type = Transaction), as well as transfers triggerred by smart contracts (type = SmartContractResult)',
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
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Address of the transfer sender or multiple senders (comma-separated)'
                },
                receiver: {
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Address of the transfer receiver or multiple receivers (comma-separated)'
                },
                token: {
                    type: 'string',
                    description: 'Identifier of the token'
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
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by a comma-separated list of transfer hashes'
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
                    description: 'Return transfers before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return transfers after given timestamp'
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
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                },
                relayer: {
                    type: 'string',
                    description: 'Address of the relayer'
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
                isScCall: {
                    type: 'boolean',
                    description: 'Returns sc call transactions details'
                },
                withLogs: {
                    type: 'boolean',
                    description: 'Return logs for transfers'
                },
                withOperations: {
                    type: 'boolean',
                    description: 'Return operations for transfers'
                },
                withActionTransferValue: {
                    type: 'boolean',
                    description: 'Returns value in USD and EGLD for transferred tokens within the action attribute'
                },
                withRefunds: {
                    type: 'boolean',
                    description: 'Include refund transactions'
                },
                withTxsRelayedByAddress: {
                    type: 'boolean',
                    description: 'Include transactions that were relayed by the address'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'get_account_transfers_count',
        description: 'Return total count of transfers triggerred by a user account (type = Transaction), as well as transfers triggerred by smart contracts (type = SmartContractResult)',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                sender: {
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Address of the transfer sender or multiple senders (comma-separated)'
                },
                receiver: {
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Address of the transfer receiver or multiple receivers (comma-separated)'
                },
                token: {
                    type: 'string',
                    description: 'Identifier of the token'
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
                    type: ['string', 'array'],
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by a comma-separated list of transfer hashes'
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
                    description: 'Return transfers before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return transfers after given timestamp'
                },
                round: {
                    type: 'number',
                    description: 'Filter by round number'
                },
                senderOrReceiver: {
                    type: 'string',
                    description: 'One address that current address interacted with'
                },
                isScCall: {
                    type: 'boolean',
                    description: 'Returns sc call transactions details'
                },
                withRefunds: {
                    type: 'boolean',
                    description: 'Include refund transactions'
                }
            },
            required: ['address']
        }
    }
];

export async function handleGetAccountTransfers(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.sender) queryParams.append('sender', Array.isArray(params.sender) ? params.sender.join(',') : params.sender);
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
        if (params.relayer) queryParams.append('relayer', params.relayer);
        if (params.withScamInfo !== undefined) queryParams.append('withScamInfo', params.withScamInfo.toString());
        if (params.withUsername !== undefined) queryParams.append('withUsername', params.withUsername.toString());
        if (params.withBlockInfo !== undefined) queryParams.append('withBlockInfo', params.withBlockInfo.toString());
        if (params.senderOrReceiver) queryParams.append('senderOrReceiver', params.senderOrReceiver);
        if (params.isScCall !== undefined) queryParams.append('isScCall', params.isScCall.toString());
        if (params.withLogs !== undefined) queryParams.append('withLogs', params.withLogs.toString());
        if (params.withOperations !== undefined) queryParams.append('withOperations', params.withOperations.toString());
        if (params.withActionTransferValue !== undefined) queryParams.append('withActionTransferValue', params.withActionTransferValue.toString());
        if (params.withRefunds !== undefined) queryParams.append('withRefunds', params.withRefunds.toString());
        if (params.withTxsRelayedByAddress !== undefined) queryParams.append('withTxsRelayedByAddress', params.withTxsRelayedByAddress.toString());

        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TRANSFER_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/transfers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<TransferDetails[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(transfer => {
                const filteredTransfer: Partial<TransferDetails> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in transfer) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredTransfer as any)[field] = transfer[field as keyof TransferDetails];
                    }
                });
                return filteredTransfer as TransferDetails;
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
            `Failed to get account transfers: ${errorMessage}`
        );
    }
}

export async function handleGetAccountTransfersCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.sender) queryParams.append('sender', Array.isArray(params.sender) ? params.sender.join(',') : params.sender);
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
        if (params.isScCall !== undefined) queryParams.append('isScCall', params.isScCall.toString());
        if (params.withRefunds !== undefined) queryParams.append('withRefunds', params.withRefunds.toString());

        const url = `/accounts/${params.address}/transfers/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get account transfers count: ${errorMessage}`
        );
    }
}
