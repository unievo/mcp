import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../api-client.js';

// Default fields configuration
const DEFAULT_TOKEN_FIELDS = ['name', 'ticker', 'price', 'marketCap', 'identifier', 'collection', 'type', 'subType', 'supply', 'circulatingSupply', 'minted', 'burnt', 'decimals', 'accounts', 'timestamp', 'owner'];
const DEFAULT_TOKEN_ACCOUNT_FIELDS = ['address', 'balance', 'identifier', 'attributes'];
const DEFAULT_TOKEN_SUPPLY_FIELDS = ['totalSupply', 'circulatingSupply', 'minted', 'burnt', 'initialMinted'];
const DEFAULT_TOKEN_TRANSACTION_FIELDS = ['txHash', 'status'];
const DEFAULT_TOKEN_TRANSFER_FIELDS = ['txHash', 'status'];

// Basic interfaces
interface Amount {
    // Empty object as per the schema
}

interface AccountAssets {
    // Empty object as per the schema
}

interface TokenOwnersHistory {
    // Empty object as per the schema
}

interface ScamInfo {
    type: string | null;
    info: string | null;
}

interface TokenAssets {
    website: string;
    description: string;
    status: 'active' | 'inactive';
    pngUrl: string;
    name: string;
    svgUrl: string;
    ledgerSignature: string;
    lockedAccounts: string;
    extraTokens: string[];
    preferredRankAlgorithm: 'trait' | 'statistical' | 'openRarity' | 'jaccardDistances' | 'custom' | null;
    priceSource: number | null;
}

interface TokenRoles {
    address: string | null;
    canLocalMint: boolean | null;
    canLocalBurn: boolean | null;
    canCreate: boolean | null;
    canBurn: boolean | null;
    canAddQuantity: boolean | null;
    canUpdateAttributes: boolean | null;
    canAddUri: boolean | null;
    canTransfer: boolean | null;
    roles: string[];
}

interface TransactionAction {
    category: string;
    name: string;
    description: string;
    arguments: object;
}

// Main token interfaces
interface TokenDetailed {
    type: 'FungibleESDT' | 'NonFungibleESDT' | 'SemiFungibleESDT' | 'MetaESDT';
    subType: 'NonFungibleESDT' | 'SemiFungibleESDT' | 'MetaESDT' | 'NonFungibleESDTv2' | 'DynamicNonFungibleESDT' | 'DynamicSemiFungibleESDT' | 'DynamicMetaESDT' | '';
    identifier: string;
    collection: string | null;
    nonce: number | null;
    name: string;
    ticker: string;
    owner: string;
    minted: string;
    burnt: string;
    initialMinted: string;
    decimals: number;
    isPaused: boolean;
    assets: TokenAssets | null;
    transactions: number | null;
    transactionsLastUpdatedAt: number | null;
    transfers: number | null;
    transfersLastUpdatedAt: number | null;
    accounts: number | null;
    accountsLastUpdatedAt: number | null;
    canUpgrade: boolean;
    canMint: boolean | null;
    canBurn: boolean | null;
    canChangeOwner: boolean | null;
    canAddSpecialRoles: boolean | null;
    canPause: boolean;
    canFreeze: boolean | null;
    canWipe: boolean;
    canTransferNftCreateRole: boolean | null;
    price: number | null;
    marketCap: number | null;
    supply: string;
    circulatingSupply: string;
    timestamp: number;
    mexPairType: 'core' | 'community' | 'ecosystem' | 'experimental' | 'unlisted';
    totalLiquidity?: number | null;
    totalVolume24h?: number | null;
    isLowLiquidity?: boolean | null;
    lowLiquidityThresholdPercent?: number | null;
    tradesCount?: number | null;
    ownersHistory: TokenOwnersHistory | null;
    roles: TokenRoles[] | null;
    canTransfer: boolean | null;
}

interface EsdtSupply {
    totalSupply: string;
    circulatingSupply: string;
    minted: string;
    burned: string;
    initialMinted: string;
    lockedAccounts: object;
}

interface TokenAccount {
    address: string;
    balance: string;
    identifier: string | null;
    attributes: string | null;
    assets: AccountAssets | null;
}

// Define the token tools
export const tokenTools = [
    {
        name: 'get_tokens',
        description: 'Returns all tokens available on the blockchain',
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
                type: {
                    type: 'string',
                    enum: ['FungibleESDT', 'NonFungibleESDT', 'SemiFungibleESDT', 'MetaESDT'],
                    description: 'Token type'
                },
                search: {
                    type: 'string',
                    description: 'Search by collection identifier'
                },
                name: {
                    type: 'string',
                    description: 'Search by token name'
                },
                identifier: {
                    type: 'string',
                    description: 'Search by token identifier'
                },
                identifiers: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Search by multiple token identifiers, comma-separated'
                },
                sort: {
                    type: 'string',
                    enum: ['accounts', 'transactions', 'price', 'marketCap'],
                    description: 'Sorting criteria'
                },
                order: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: 'Sorting order (asc / desc)'
                },
                includeMetaESDT: {
                    type: 'boolean',
                    description: 'Include MetaESDTs in response'
                },
                mexPairType: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Token Mex Pair'
                },
                priceSource: {
                    type: 'string',
                    enum: ['dataApi', 'customUrl'],
                    description: 'Token Price Source'
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
        name: 'get_tokens_count',
        description: 'Returns the total number of tokens',
        inputSchema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    enum: ['FungibleESDT', 'NonFungibleESDT', 'SemiFungibleESDT', 'MetaESDT'],
                    description: 'Token type'
                },
                search: {
                    type: 'string',
                    description: 'Search by collection identifier'
                },
                name: {
                    type: 'string',
                    description: 'Search by token name'
                },
                identifier: {
                    type: 'string',
                    description: 'Search by token identifier'
                }
            }
        }
    },
    {
        name: 'get_token',
        description: 'Returns the details of a specific token',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Token identifier'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['identifier']
        }
    },
    {
        name: 'get_token_supply',
        description: 'Returns supply metrics for a specific token',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Token identifier'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['identifier']
        }
    },
    {
        name: 'get_token_accounts',
        description: 'Returns a list of accounts that hold a specific token',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Token identifier'
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
            required: ['identifier']
        }
    },
    {
        name: 'get_token_accounts_count',
        description: 'Returns the number of accounts that hold a specific token',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Token identifier'
                }
            },
            required: ['identifier']
        }
    },
    {
        name: 'get_token_transactions',
        description: 'Returns a list of transactions for a specific token',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Token identifier'
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
                    type: 'string',
                    description: 'Address of the transaction receiver'
                },
                senderShard: {
                    type: 'number',
                    description: 'Filter by sender shard'
                },
                receiverShard: {
                    type: 'number',
                    description: 'Filter by receiver shard'
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
                    description: 'Filter by transaction status'
                },
                function: {
                    type: 'string',
                    description: 'Filter by function name'
                },
                before: {
                    type: 'number',
                    description: 'Filter by timestamp (transactions before the given timestamp)'
                },
                after: {
                    type: 'number',
                    description: 'Filter by timestamp (transactions after the given timestamp)'
                },
                order: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: 'Sort order (asc/desc)'
                },
                withScResults: {
                    type: 'boolean',
                    description: 'Include smart contract results in response'
                },
                withOperations: {
                    type: 'boolean',
                    description: 'Include operations in response'
                },
                withLogs: {
                    type: 'boolean',
                    description: 'Include logs in response'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['identifier']
        }
    },
    {
        name: 'get_token_transactions_count',
        description: 'Returns the number of transactions for a specific token',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Token identifier'
                },
                sender: {
                    type: 'string',
                    description: 'Address of the transaction sender'
                },
                receiver: {
                    type: 'string',
                    description: 'Address of the transaction receiver'
                },
                senderShard: {
                    type: 'number',
                    description: 'Filter by sender shard'
                },
                receiverShard: {
                    type: 'number',
                    description: 'Filter by receiver shard'
                },
                miniBlockHash: {
                    type: 'string',
                    description: 'Filter by miniblock hash'
                },
                status: {
                    type: 'string',
                    description: 'Filter by transaction status'
                },
                search: {
                    type: 'string',
                    description: 'Search in transaction data'
                },
                function: {
                    type: 'string',
                    description: 'Filter by function name'
                },
                before: {
                    type: 'number',
                    description: 'Before timestamp'
                },
                after: {
                    type: 'number',
                    description: 'After timestamp'
                }
            },
            required: ['identifier']
        }
    },
    {
        name: 'get_token_transfers',
        description: 'Returns transfers for a specific token',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Token identifier'
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
                    description: 'Address of the transfer sender'
                },
                receiver: {
                    type: 'string',
                    description: 'Address of the transfer receiver'
                },
                senderShard: {
                    type: 'number',
                    description: 'Filter by sender shard'
                },
                receiverShard: {
                    type: 'number',
                    description: 'Filter by receiver shard'
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
                    description: 'Filter by transfer status'
                },
                function: {
                    type: 'string',
                    description: 'Filter by function name'
                },
                before: {
                    type: 'number',
                    description: 'Before timestamp'
                },
                after: {
                    type: 'number',
                    description: 'After timestamp'
                },
                order: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: 'Sorting order (asc / desc)'
                },
                search: {
                    type: 'string',
                    description: 'Search in transfer data'
                },
                withScResults: {
                    type: 'boolean',
                    description: 'Include smart contract results in response'
                },
                withLogs: {
                    type: 'boolean',
                    description: 'Include logs in response'
                },
                withOperation: {
                    type: 'boolean',
                    description: 'Include operation in response'
                },
                withBlockInfo: {
                    type: 'boolean',
                    description: 'Include block info in response'
                },
                withUsername: {
                    type: 'boolean',
                    description: 'Include username in response'
                },
                withScamInfo: {
                    type: 'boolean',
                    description: 'Include scam info in response'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['identifier']
        }
    },
    {
        name: 'get_token_transfers_count',
        description: 'Returns the number of transfers for a specific token',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Token identifier'
                },
                sender: {
                    type: 'string',
                    description: 'Address of the transfer sender'
                },
                receiver: {
                    type: 'string',
                    description: 'Address of the transfer receiver'
                },
                senderShard: {
                    type: 'number',
                    description: 'Filter by sender shard'
                },
                receiverShard: {
                    type: 'number',
                    description: 'Filter by receiver shard'
                },
                miniBlockHash: {
                    type: 'string',
                    description: 'Filter by miniblock hash'
                },
                status: {
                    type: 'string',
                    description: 'Filter by transfer status'
                },
                search: {
                    type: 'string',
                    description: 'Search in transfer data'
                },
                function: {
                    type: 'string',
                    description: 'Filter by function name'
                },
                before: {
                    type: 'number',
                    description: 'Before timestamp'
                },
                after: {
                    type: 'number',
                    description: 'After timestamp'
                }
            },
            required: ['identifier']
        }
    },
    {
        name: 'get_token_logo_png',
        description: 'Returns the PNG logo for a specific token',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Token identifier'
                }
            },
            required: ['identifier']
        }
    },
    {
        name: 'get_token_logo_svg',
        description: 'Returns the SVG logo for a specific token',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Token identifier'
                }
            },
            required: ['identifier']
        }
    }
];

// Handler functions
export async function handleGetTokens(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) { queryParams.append('from', params.from.toString()); }
        if (params.size !== undefined) { queryParams.append('size', params.size.toString()); }
        if (params.type !== undefined) { queryParams.append('type', params.type); }
        if (params.search !== undefined) { queryParams.append('search', params.search); }
        if (params.name !== undefined) { queryParams.append('name', params.name); }
        if (params.identifier !== undefined) { queryParams.append('identifier', params.identifier); }
        if (params.identifiers !== undefined) { queryParams.append('identifiers', params.identifiers.join(',')); }
        if (params.sort !== undefined) { queryParams.append('sort', params.sort); }
        if (params.order !== undefined) { queryParams.append('order', params.order); }
        if (params.includeMetaESDT !== undefined) { queryParams.append('includeMetaESDT', params.includeMetaESDT.toString()); }
        if (params.mexPairType !== undefined) { queryParams.append('mexPairType', params.mexPairType.join(',')); }
        if (params.priceSource !== undefined) { queryParams.append('priceSource', params.priceSource); }
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TOKEN_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }
        
        const url = `/tokens${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<TokenDetailed[]>(url);
        
        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(token => {
                const filteredToken: Partial<TokenDetailed> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in token) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredToken as any)[field] = token[field as keyof TokenDetailed];
                    }
                });
                return filteredToken as TokenDetailed;
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
            `Failed to get tokens: ${errorMessage}`
        );
    }
}

export async function handleGetTokensCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.type) { queryParams.append('type', params.type); }
        if (params.search) { queryParams.append('search', params.search); }
        if (params.name) { queryParams.append('name', params.name); }
        if (params.identifier) { queryParams.append('identifier', params.identifier); }
        
        const url = `/tokens/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get tokens count: ${errorMessage}`
        );
    }
}

export async function handleGetToken(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }
        
        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TOKEN_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }
        
        const url = `/tokens/${params.identifier}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<TokenDetailed>(url);
        
        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredToken: Partial<TokenDetailed> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredToken as any)[field] = response[field as keyof TokenDetailed];
                }
            });
            filteredResponse = filteredToken as TokenDetailed;
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
            `Failed to get token: ${errorMessage}`
        );
    }
}

export async function handleGetTokenSupply(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }
        
        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TOKEN_SUPPLY_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }
        
        const url = `/tokens/${params.identifier}/supply${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<EsdtSupply>(url);
        
        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredSupply: Partial<EsdtSupply> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredSupply as any)[field] = response[field as keyof EsdtSupply];
                }
            });
            filteredResponse = filteredSupply as EsdtSupply;
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
            `Failed to get token supply: ${errorMessage}`
        );
    }
}

export async function handleGetTokenAccounts(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }
        
        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) { queryParams.append('from', params.from.toString()); }
        if (params.size !== undefined) { queryParams.append('size', params.size.toString()); }
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TOKEN_ACCOUNT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }
        
        const url = `/tokens/${params.identifier}/accounts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<TokenAccount[]>(url);
        
        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(account => {
                const filteredAccount: Partial<TokenAccount> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in account) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredAccount as any)[field] = account[field as keyof TokenAccount];
                    }
                });
                return filteredAccount as TokenAccount;
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
            `Failed to get token accounts: ${errorMessage}`
        );
    }
}

export async function handleGetTokenAccountsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }
        
        const url = `/tokens/${params.identifier}/accounts/count`;
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
            `Failed to get token accounts count: ${errorMessage}`
        );
    }
}

export async function handleGetTokenTransactions(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }
        
        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) { queryParams.append('from', params.from.toString()); }
        if (params.size !== undefined) { queryParams.append('size', params.size.toString()); }
        if (params.sender) { queryParams.append('sender', params.sender); }
        if (params.receiver) { queryParams.append('receiver', params.receiver); }
        if (params.senderShard !== undefined) { queryParams.append('senderShard', params.senderShard.toString()); }
        if (params.receiverShard !== undefined) { queryParams.append('receiverShard', params.receiverShard.toString()); }
        if (params.miniBlockHash) { queryParams.append('miniBlockHash', params.miniBlockHash); }
        if (params.hashes) { queryParams.append('hashes', params.hashes.join(',')); }
        if (params.status) { queryParams.append('status', params.status); }
        if (params.function) { queryParams.append('function', params.function); }
        if (params.before !== undefined) { queryParams.append('before', params.before.toString()); }
        if (params.after !== undefined) { queryParams.append('after', params.after.toString()); }
        if (params.order) { queryParams.append('order', params.order); }
        if (params.withScResults !== undefined) { queryParams.append('withScResults', params.withScResults.toString()); }
        if (params.withOperations !== undefined) { queryParams.append('withOperations', params.withOperations.toString()); }
        if (params.withLogs !== undefined) { queryParams.append('withLogs', params.withLogs.toString()); }
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TOKEN_TRANSACTION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }
        
        const url = `/tokens/${params.identifier}/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<any[]>(url);
        
        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(transaction => {
                const filteredTransaction: Partial<any> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in transaction) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredTransaction as any)[field] = transaction[field as keyof any];
                    }
                });
                return filteredTransaction as any;
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
            `Failed to get token transactions: ${errorMessage}`
        );
    }
}

export async function handleGetTokenTransactionsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }
        
        const queryParams = new URLSearchParams();
        
        if (params.sender) { queryParams.append('sender', params.sender); }
        if (params.receiver) { queryParams.append('receiver', params.receiver); }
        if (params.senderShard !== undefined) { queryParams.append('senderShard', params.senderShard.toString()); }
        if (params.receiverShard !== undefined) { queryParams.append('receiverShard', params.receiverShard.toString()); }
        if (params.miniBlockHash) { queryParams.append('miniBlockHash', params.miniBlockHash); }
        if (params.status) { queryParams.append('status', params.status); }
        if (params.search) { queryParams.append('search', params.search); }
        if (params.function) { queryParams.append('function', params.function); }
        if (params.before !== undefined) { queryParams.append('before', params.before.toString()); }
        if (params.after !== undefined) { queryParams.append('after', params.after.toString()); }

        const url = `/tokens/${params.identifier}/transactions/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get token transactions count: ${errorMessage}`
        );
    }
}

export async function handleGetTokenTransfers(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }
        
        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) { queryParams.append('from', params.from.toString()); }
        if (params.size !== undefined) { queryParams.append('size', params.size.toString()); }
        if (params.sender !== undefined) { queryParams.append('sender', params.sender); }
        if (params.receiver !== undefined) { queryParams.append('receiver', params.receiver); }
        if (params.senderShard !== undefined) { queryParams.append('senderShard', params.senderShard.toString()); }
        if (params.receiverShard !== undefined) { queryParams.append('receiverShard', params.receiverShard.toString()); }
        if (params.miniBlockHash !== undefined) { queryParams.append('miniBlockHash', params.miniBlockHash); }
        if (params.hashes !== undefined) { queryParams.append('hashes', params.hashes.join(',')); }
        if (params.status !== undefined) { queryParams.append('status', params.status); }
        if (params.function !== undefined) { queryParams.append('function', params.function); }
        if (params.before !== undefined) { queryParams.append('before', params.before.toString()); }
        if (params.after !== undefined) { queryParams.append('after', params.after.toString()); }
        if (params.order !== undefined) { queryParams.append('order', params.order); }
        if (params.search !== undefined) { queryParams.append('search', params.search); }
        if (params.withScResults !== undefined) { queryParams.append('withScResults', params.withScResults.toString()); }
        if (params.withLogs !== undefined) { queryParams.append('withLogs', params.withLogs.toString()); }
        if (params.withOperation !== undefined) { queryParams.append('withOperation', params.withOperation.toString()); }
        if (params.withBlockInfo !== undefined) { queryParams.append('withBlockInfo', params.withBlockInfo.toString()); }
        if (params.withUsername !== undefined) { queryParams.append('withUsername', params.withUsername.toString()); }
        if (params.withScamInfo !== undefined) { queryParams.append('withScamInfo', params.withScamInfo.toString()); }
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TOKEN_TRANSFER_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }
        
        const url = `/tokens/${params.identifier}/transfers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<any[]>(url);
        
        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(transfer => {
                const filteredTransfer: Partial<any> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in transfer) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredTransfer as any)[field] = transfer[field as keyof any];
                    }
                });
                return filteredTransfer as any;
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
            `Failed to get token transfers: ${errorMessage}`
        );
    }
}

export async function handleGetTokenTransfersCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }
        
        const queryParams = new URLSearchParams();
        
        if (params.sender) { queryParams.append('sender', params.sender); }
        if (params.receiver) { queryParams.append('receiver', params.receiver); }
        if (params.senderShard !== undefined) { queryParams.append('senderShard', params.senderShard.toString()); }
        if (params.receiverShard !== undefined) { queryParams.append('receiverShard', params.receiverShard.toString()); }
        if (params.miniBlockHash) { queryParams.append('miniBlockHash', params.miniBlockHash); }
        if (params.status) { queryParams.append('status', params.status); }
        if (params.search) { queryParams.append('search', params.search); }
        if (params.function) { queryParams.append('function', params.function); }
        if (params.before !== undefined) { queryParams.append('before', params.before.toString()); }
        if (params.after !== undefined) { queryParams.append('after', params.after.toString()); }
        
        const url = `/tokens/${params.identifier}/transfers/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get token transfers count: ${errorMessage}`
        );
    }
}

export async function handleGetTokenLogoPng(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }
        
        const url = `/tokens/${params.identifier}/logo/png`;
        const response = await mxApiClient.get<string>(url);
        
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ logoUrl: response }, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get token PNG logo: ${errorMessage}`
        );
    }
}

export async function handleGetTokenLogoSvg(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }
        
        const url = `/tokens/${params.identifier}/logo/svg`;
        const response = await mxApiClient.get<string>(url);
        
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ logoUrl: response }, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get token SVG logo: ${errorMessage}`
        );
    }
}
