import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_TOKEN_FIELDS = ['identifier', 'name', 'balance', 'decimals', 'price', 'valueUsd'];

interface TokenAssets {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    name?: string;
    svgUrl?: string;
    ledgerSignature?: string;
    lockedAccounts?: string;
    extraTokens?: string[];
    preferredRankAlgorithm?: string | null;
    priceSource?: number | null;
    
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

interface TokenOwnersHistory {
    currentOwner: string;
    previousOwner: string;
    timestamp: number;
}

interface TokenDetails {
    type: string;
    subType?: string;
    identifier: string;
    name: string;
    ticker: string;
    owner: string;
    minted: string;
    burnt: string;
    initialMinted: string;
    decimals: number;
    isPaused: boolean;
    transactions: number;
    transactionsLastUpdatedAt?: number;
    transfers: number;
    transfersLastUpdatedAt?: number;
    accounts: number;
    accountsLastUpdatedAt?: number;
    canUpgrade: boolean;
    canMint: boolean;
    canBurn: boolean;
    canChangeOwner: boolean;
    canAddSpecialRoles: boolean;
    canPause: boolean;
    canFreeze: boolean;
    canWipe: boolean;
    canTransferNftCreateRole: boolean;
    supply: string;
    circulatingSupply: string;
    timestamp: number;
    mexPairType?: string;
    ownersHistory?: TokenOwnersHistory[] | null;
    balance: string;
    
    collection?: string;
    nonce?: number;
    assets?: TokenAssets;
    price?: number;
    marketCap?: number;
    totalLiquidity?: number;
    totalVolume24h?: number;
    isLowLiquidity?: boolean;
    lowLiquidityThresholdPercent?: number;
    tradesCount?: number;
    valueUsd?: number;
    attributes?: string;
    scamInfo?: ScamInfo;
    isWhitelistedStorage?: boolean;
}

export const accountTokensTools = [
    {
        name: 'get_account_tokens',
        description: 'Returns a list of all available fungible tokens for a given address, together with their balance',
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
                type: {
                    type: 'string',
                    enum: ['FungibleESDT', 'MetaESDT'],
                    description: 'Token type'
                },
                subType: {
                    type: 'string',
                    enum: [
                        'NonFungibleESDT',
                        'SemiFungibleESDT',
                        'MetaESDT',
                        'NonFungibleESDTv2',
                        'DynamicNonFungibleESDT',
                        'DynamicSemiFungibleESDT',
                        'DynamicMetaESDT',
                        ''
                    ],
                    description: 'Token sub type'
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
                    type: 'string',
                    description: 'A comma-separated list of identifiers to filter by'
                },
                includeMetaESDT: {
                    type: 'boolean',
                    description: 'Include MetaESDTs in response'
                },
                timestamp: {
                    type: 'number',
                    description: 'Retrieve entries from timestamp'
                },
                mexPairType: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Token Mex Pair'
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
        name: 'get_account_tokens_count',
        description: 'Returns the total number of tokens for a given address',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                type: {
                    type: 'string',
                    enum: ['FungibleESDT', 'MetaESDT'],
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
                    type: 'string',
                    description: 'A comma-separated list of identifiers to filter by'
                },
                includeMetaESDT: {
                    type: 'boolean',
                    description: 'Include MetaESDTs in response'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'get_account_token',
        description: 'Returns details about a specific fungible token from a given address',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                token: {
                    type: 'string',
                    description: 'Token identifier'
                },
                timestamp: {
                    type: 'number',
                    description: 'Retrieve entries from timestamp'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['address', 'token']
        }
    }
];

export async function handleGetAccountTokens(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.type !== undefined) queryParams.append('type', params.type.toString());
        if (params.subType !== undefined) queryParams.append('subType', params.subType.toString());
        if (params.search !== undefined) queryParams.append('search', params.search.toString());
        if (params.name !== undefined) queryParams.append('name', params.name.toString());
        if (params.identifier !== undefined) queryParams.append('identifier', params.identifier.toString());
        if (params.identifiers !== undefined) queryParams.append('identifiers', params.identifiers.toString());
        if (params.includeMetaESDT !== undefined) queryParams.append('includeMetaESDT', params.includeMetaESDT.toString());
        if (params.timestamp !== undefined) queryParams.append('timestamp', params.timestamp.toString());
        if (params.mexPairType !== undefined) {
            if (Array.isArray(params.mexPairType)) {
                queryParams.append('mexPairType', params.mexPairType.join(','));
            } else {
                queryParams.append('mexPairType', params.mexPairType.toString());
            }
        }

        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TOKEN_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/tokens${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<TokenDetails[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(token => {
                const filteredToken: Partial<TokenDetails> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in token) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredToken as any)[field] = token[field as keyof TokenDetails];
                    }
                });
                return filteredToken as TokenDetails;
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
            `Failed to get account tokens: ${errorMessage}`
        );
    }
}

export async function handleGetAccountTokensCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.type !== undefined) queryParams.append('type', params.type.toString());
        if (params.search !== undefined) queryParams.append('search', params.search.toString());
        if (params.name !== undefined) queryParams.append('name', params.name.toString());
        if (params.identifier !== undefined) queryParams.append('identifier', params.identifier.toString());
        if (params.identifiers !== undefined) queryParams.append('identifiers', params.identifiers.toString());
        if (params.includeMetaESDT !== undefined) queryParams.append('includeMetaESDT', params.includeMetaESDT.toString());

        const url = `/accounts/${params.address}/tokens/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get account tokens count: ${errorMessage}`
        );
    }
}

export async function handleGetAccountToken(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }
        if (!params.token) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.timestamp !== undefined) queryParams.append('timestamp', params.timestamp.toString());

        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TOKEN_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/tokens/${params.token}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<TokenDetails>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredToken: Partial<TokenDetails> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredToken as any)[field] = response[field as keyof TokenDetails];
                }
            });
            filteredResponse = filteredToken as TokenDetails;
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
            `Failed to get account token: ${errorMessage}`
        );
    }
}
