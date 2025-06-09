import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../api-client.js';

// Default fields configuration
const DEFAULT_TRANSACTIONS_FIELDS = ['txHash', 'sender', 'receiver', 'value', 'status', 'timestamp'];
const DEFAULT_TRANSACTION_FIELDS = ['txHash', 'sender', 'receiver', 'value', 'status', 'timestamp'];

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

interface TransactionLogEvent {
    address: string;
    addressAssets: AccountAssets | null;
    identifier: string;
    topics: string[];
    data: string;
    additionalData: object;
}

interface TransactionLog {
    id: string;
    events: TransactionLogEvent[];
}

interface TransactionReceipt {
    value: string;
    sender: string;
    data: string;
}

interface TransactionOperation {
    id: string;
    action: string;
    type: string;
    sender: string;
    receiver: string;
    value: string;
    data: string;
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
    senderAssets: AccountAssets | null;
    receiverAssets: AccountAssets | null;
    relayedValue: string;
    data: string;
    prevTxHash: string;
    originalTxHash: string;
    callType: string;
    miniBlockHash: string | null;
    logs: TransactionLog | null;
    returnMessage: string | null;
    action: TransactionAction | null;
    function: string | null;
    status: string | null;
}

interface Transaction {
    txHash: string;
    nonce: number;
    round: number;
    value: string;
    receiver: string;
    sender: string;
    receiverShard: number;
    senderShard: number;
    gasPrice: number;
    gasLimit: number;
    gasUsed: number;
    fee: string;
    data: string;
    signature: string;
    timestamp: number;
    status: string;
    searchOrder: number;
    miniBlockHash: string;
    blockNonce: number;
    blockHash: string;
    notarizedAtSourceInMetaNonce: number;
    NotarizedAtSourceInMetaHash: string;
    notarizedAtDestinationInMetaNonce: number;
    notarizedAtDestinationInMetaHash: string;
    function: string | null;
    action: TransactionAction | null;
    scResults: SmartContractResult[] | null;
    operations: TransactionOperation[] | null;
    logs: TransactionLog | null;
    pendingResults: boolean;
    senderAssets: AccountAssets | null;
    receiverAssets: AccountAssets | null;
}

interface TransactionDetailed extends Transaction {
    receipt: TransactionReceipt | null;
}

// POST transaction interfaces
interface TransactionSendResult {
    receiver: string;
    receiverShard: number;
    sender: string;
    senderShard: number;
    status: string;
    txHash: string;
}

interface TransactionCreate {
    chainId: string;
    data: string;
    gasLimit: number;
    gasPrice: number;
    nonce: number;
    receiver: string;
    receiverUsername?: object;
    sender: string;
    senderUsername?: object;
    signature: string;
    value: string;
    version: number;
    options?: number;
    guardian?: string;
    guardianSignature?: string;
}

interface TransactionDecodeDto {
    action: TransactionAction | null;
    data: string;
    receiver: string;
    sender: string;
    value: string;
}

// Define the transaction tools
export const transactionTools = [
    {
        name: 'get-transactions',
        description: 'Returns a list of transactions available on the blockchain',
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
                sender: {
                    type: 'string',
                    description: 'Address of the transaction sender'
                },
                receiver: {
                    type: 'string',
                    description: 'Search by multiple receiver addresses, comma-separated'
                },
                relayer: {
                    type: 'string',
                    description: 'Search by a relayer address'
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
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by a comma-separated list of transaction hashes'
                },
                status: {
                    type: 'string',
                    enum: ['success', 'pending', 'invalid', 'fail'],
                    description: 'Status of the transaction (success / pending / invalid / fail)'
                },
                function: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter transactions by function name'
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
                    description: 'Sorting order (asc / desc)'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                },
                withScResults: {
                    type: 'boolean',
                    description: 'Return results for transactions'
                },
                withOperations: {
                    type: 'boolean',
                    description: 'Return operations for transactions'
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
                isRelayed: {
                    type: 'boolean',
                    description: 'Returns relayed transactions details'
                },
                isScCall: {
                    type: 'boolean',
                    description: 'Returns sc call transactions details'
                },
                withActionTransferValue: {
                    type: 'boolean',
                    description: 'Returns value in USD and network token for transferred tokens within the action attribute'
                },
                withRelayedScresults: {
                    type: 'boolean',
                    description: 'If set to true, will include smart contract results that resemble relayed transactions'
                }
            }
        }
    },
    {
        name: 'get-transactions-count',
        description: 'Returns the total number of transactions',
        inputSchema: {
            type: 'object',
            properties: {
                sender: {
                    type: 'string',
                    description: 'Address of the transaction sender'
                },
                receiver: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Search by multiple receiver addresses, comma-separated'
                },
                relayer: {
                    type: 'string',
                    description: 'Search by a relayer address'
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
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by a comma-separated list of transaction hashes'
                },
                status: {
                    type: 'string',
                    enum: ['success', 'pending', 'invalid', 'fail'],
                    description: 'Status of the transaction (success / pending / invalid / fail)'
                },
                function: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter transactions by function name'
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
                isRelayed: {
                    type: 'boolean',
                    description: 'Returns relayed transactions details'
                },
                isScCall: {
                    type: 'boolean',
                    description: 'Returns sc call transactions details'
                },
                withRelayedScresults: {
                    type: 'boolean',
                    description: 'If set to true, will include smart contract results that resemble relayed transactions'
                }
            }
        }
    },
    {
        name: 'get-transaction',
        description: 'Returns the details of a transaction',
        inputSchema: {
            type: 'object',
            properties: {
                txHash: {
                    type: 'string',
                    description: 'Transaction hash'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                },
                withResults: {
                    type: 'boolean',
                    description: 'Include smart contract results'
                },
                withOperations: {
                    type: 'boolean',
                    description: 'Include operations'
                },
                withLogs: {
                    type: 'boolean',
                    description: 'Include logs'
                },
                withScamInfo: {
                    type: 'boolean',
                    description: 'Include scam info'
                },
                withUsername: {
                    type: 'boolean',
                    description: 'Include username'
                },
                withActionTransferValue: {
                    type: 'boolean',
                    description: 'Returns value in USD and network token for transferred tokens within the action attribute'
                }
            },
            required: ['txHash']
        }
    },
    {
        name: 'send-transaction',
        description: 'Posts a signed transaction on the blockchain',
        inputSchema: {
            type: 'object',
            properties: {
                chainId: {
                    type: 'string',
                    description: 'Chain identifier'
                },
                data: {
                    type: 'string',
                    description: 'Transaction data (base64 encoded)'
                },
                gasLimit: {
                    type: 'number',
                    description: 'Gas limit for the transaction'
                },
                gasPrice: {
                    type: 'number',
                    description: 'Gas price for the transaction'
                },
                nonce: {
                    type: 'number',
                    description: 'Sender account nonce'
                },
                receiver: {
                    type: 'string',
                    description: 'Transaction receiver address'
                },
                sender: {
                    type: 'string',
                    description: 'Transaction sender address'
                },
                signature: {
                    type: 'string',
                    description: 'Transaction signature'
                },
                value: {
                    type: 'string',
                    description: 'Transaction value'
                },
                version: {
                    type: 'number',
                    description: 'Transaction version'
                },
                options: {
                    type: 'number',
                    description: 'Transaction options'
                },
                guardian: {
                    type: 'string',
                    description: 'Guardian address'
                },
                guardianSignature: {
                    type: 'string',
                    description: 'Guardian signature'
                }
            },
            required: ['chainId', 'data', 'gasLimit', 'gasPrice', 'nonce', 'receiver', 'sender', 'signature', 'value', 'version']
        }
    },
    {
        name: 'decode-transaction',
        description: 'Decodes transaction action, given a minimum set of transaction details',
        inputSchema: {
            type: 'object',
            properties: {
                data: {
                    type: 'string',
                    description: 'Transaction data (base64 encoded)'
                },
                receiver: {
                    type: 'string',
                    description: 'Transaction receiver address'
                },
                sender: {
                    type: 'string',
                    description: 'Transaction sender address'
                },
                value: {
                    type: 'string',
                    description: 'Transaction value'
                }
            },
            required: ['data', 'receiver', 'sender', 'value']
        }
    }
];

// Handler functions
export async function handleGetTransactions(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) {
            queryParams.append('from', params.from.toString());
        }
        
        if (params.size !== undefined) {
            queryParams.append('size', params.size.toString());
        }
        
        if (params.sender !== undefined) {
            queryParams.append('sender', params.sender);
        }
        
        if (params.receiver !== undefined) {
            queryParams.append('receiver', params.receiver);
        }
        
        if (params.relayer !== undefined) {
            queryParams.append('relayer', params.relayer);
        }
        
        if (params.token !== undefined) {
            queryParams.append('token', params.token);
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
        
        if (params.function !== undefined) {
            queryParams.append('function', Array.isArray(params.function) ? params.function.join(',') : params.function);
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
        const fieldsToRetrieve = params.fields || DEFAULT_TRANSACTIONS_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }
        
        if (params.withScResults !== undefined) {
            queryParams.append('withScResults', params.withScResults.toString());
        }
        
        if (params.withOperations !== undefined) {
            queryParams.append('withOperations', params.withOperations.toString());
        }
        
        if (params.withLogs !== undefined) {
            queryParams.append('withLogs', params.withLogs.toString());
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
        
        if (params.isRelayed !== undefined) {
            queryParams.append('isRelayed', params.isRelayed.toString());
        }
        
        if (params.isScCall !== undefined) {
            queryParams.append('isScCall', params.isScCall.toString());
        }
        
        if (params.withActionTransferValue !== undefined) {
            queryParams.append('withActionTransferValue', params.withActionTransferValue.toString());
        }
        
        if (params.withRelayedScresults !== undefined) {
            queryParams.append('withRelayedScresults', params.withRelayedScresults.toString());
        }
        
        const url = `/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<Transaction[]>(url);
        
        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(transaction => {
                const filteredTransaction: Partial<Transaction> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in transaction) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredTransaction as any)[field] = transaction[field as keyof Transaction];
                    }
                });
                return filteredTransaction as Transaction;
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
            `Failed to get transactions: ${errorMessage}`
        );
    }
}

export async function handleGetTransactionsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.sender !== undefined) {
            queryParams.append('sender', params.sender);
        }
        
        if (params.receiver !== undefined) {
            queryParams.append('receiver', Array.isArray(params.receiver) ? params.receiver.join(',') : params.receiver);
        }
        
        if (params.relayer !== undefined) {
            queryParams.append('relayer', params.relayer);
        }
        
        if (params.token !== undefined) {
            queryParams.append('token', params.token);
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
        
        if (params.function !== undefined) {
            queryParams.append('function', Array.isArray(params.function) ? params.function.join(',') : params.function);
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
        
        if (params.isRelayed !== undefined) {
            queryParams.append('isRelayed', params.isRelayed.toString());
        }
        
        if (params.isScCall !== undefined) {
            queryParams.append('isScCall', params.isScCall.toString());
        }
        
        if (params.withRelayedScresults !== undefined) {
            queryParams.append('withRelayedScresults', params.withRelayedScresults.toString());
        }
        
        const url = `/transactions/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<{ count: number }>(url);
        
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(response, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get transactions count: ${errorMessage}`
        );
    }
}

export async function handleGetTransaction(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.txHash) {
            throw new McpError(ErrorCode.InvalidParams, 'Transaction hash is required');
        }
        
        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TRANSACTION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }
        
        if (params.withResults !== undefined) {
            queryParams.append('withResults', params.withResults.toString());
        }
        
        if (params.withOperations !== undefined) {
            queryParams.append('withOperations', params.withOperations.toString());
        }
        
        if (params.withLogs !== undefined) {
            queryParams.append('withLogs', params.withLogs.toString());
        }
        
        if (params.withScamInfo !== undefined) {
            queryParams.append('withScamInfo', params.withScamInfo.toString());
        }
        
        if (params.withUsername !== undefined) {
            queryParams.append('withUsername', params.withUsername.toString());
        }
        
        if (params.withActionTransferValue !== undefined) {
            queryParams.append('withActionTransferValue', params.withActionTransferValue.toString());
        }
        
        const url = `/transactions/${params.txHash}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<TransactionDetailed>(url);
        
        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredTransaction: Partial<TransactionDetailed> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredTransaction as any)[field] = response[field as keyof TransactionDetailed];
                }
            });
            filteredResponse = filteredTransaction as TransactionDetailed;
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
            `Failed to get transaction: ${errorMessage}`
        );
    }
}

export async function handleSendTransaction(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        // Validate required parameters
        const requiredParams = ['chainId', 'data', 'gasLimit', 'gasPrice', 'nonce', 'receiver', 'sender', 'signature', 'value', 'version'];
        for (const param of requiredParams) {
            if (params[param] === undefined) {
                throw new McpError(ErrorCode.InvalidParams, `Parameter '${param}' is required`);
            }
        }
        
        // Create transaction object
        const transaction: TransactionCreate = {
            chainId: params.chainId,
            data: params.data,
            gasLimit: params.gasLimit,
            gasPrice: params.gasPrice,
            nonce: params.nonce,
            receiver: params.receiver,
            receiverUsername: params.receiverUsername,
            sender: params.sender,
            senderUsername: params.senderUsername,
            signature: params.signature,
            value: params.value,
            version: params.version,
            options: params.options,
            guardian: params.guardian,
            guardianSignature: params.guardianSignature
        };
        
        // Send transaction
        const url = '/transactions';
        const response = await mxApiClient.post<TransactionSendResult>(url, transaction);
        
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(response, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to send transaction: ${errorMessage}`
        );
    }
}

export async function handleDecodeTransaction(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        // Validate required parameters
        const requiredParams = ['data', 'receiver', 'sender', 'value'];
        for (const param of requiredParams) {
            if (params[param] === undefined) {
                throw new McpError(ErrorCode.InvalidParams, `Parameter '${param}' is required`);
            }
        }
        
        // Create decode request object
        const decodeRequest: TransactionDecodeDto = {
            action: null, // This will be filled by the API
            data: params.data,
            receiver: params.receiver,
            sender: params.sender,
            value: params.value
        };
        
        // Send decode request
        const url = '/transactions/decode';
        const response = await mxApiClient.post<TransactionDecodeDto>(url, decodeRequest);
        
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(response, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to decode transaction: ${errorMessage}`
        );
    }
}
