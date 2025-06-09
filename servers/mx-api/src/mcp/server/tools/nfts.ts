import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../api-client.js';

// Default fields configuration
const DEFAULT_NFT_FIELDS = ['identifier', 'collection', 'type', 'subType', 'name', 'creator', 'owner', 'tags', 'supply', 'decimals', 'balance', 'timestamp', 'url'];
const DEFAULT_NFT_ACCOUNT_FIELDS = ['address', 'balance'];
const DEFAULT_NFT_SUPPLY_FIELDS = ['supply', 'circulatingSupply', 'minted', 'burnt'];
const DEFAULT_NFT_TRANSACTION_FIELDS = ['txHash', 'sender', 'receiver', 'value','function', 'status', 'timestamp'];
const DEFAULT_NFT_TRANSFER_FIELDS = ['txHash', 'sender', 'receiver', 'value', 'function', 'status', 'timestamp'];

interface NftMedia {
    url: string;
    originalUrl: string;
    thumbnailUrl: string;
    fileType: string;
    fileSize: number;
}

interface NftMetadataError {
    code: string;
    message: string;
    timestamp: number;
}

interface NftMetadata {
    description: string;
    fileType: string;
    fileUri: string;
    fileName: string;
    error?: NftMetadataError;
}

interface TokenAssets {
    website: string;
    description: string;
    status: string;
    pngUrl: string;
    name: string;
    svgUrl: string;
    ledgerSignature: string;
    lockedAccounts: string;
    extraTokens: string[];
    preferredRankAlgorithm?: string;
    priceSource?: number;
}

interface ScamInfo {
    type: string;
    info: string;
}

interface NftRarity {
    rank: number;
    score: number;
}

interface NftRarities {
    statistical?: NftRarity;
    trait?: NftRarity;
    jaccardDistances?: NftRarity;
    openRarity?: NftRarity;
    custom?: NftRarity;
}

interface UnlockMileStoneModel {
    remainingEpochs: number;
    percent: number;
}

interface AccountAssets {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    name?: string;
    svgUrl?: string;
}

interface TransactionAction {
    category: string;
    name: string;
    description: string;
    arguments?: Record<string, unknown>;
}

interface Transaction {
    txHash: string;
    gasLimit: number;
    gasPrice: number;
    gasUsed: number;
    miniBlockHash: string;
    nonce: number;
    receiver: string;
    receiverUsername?: string | null;
    receiverAssets?: AccountAssets | null;
    receiverShard: number;
    round: number;
    sender: string;
    senderUsername?: string | null;
    senderAssets?: AccountAssets | null;
    senderShard: number;
    signature: string;
    status: string;
    value: string;
    fee: string;
    timestamp: number;
    data?: string | null;
    function?: string | null;
    action?: TransactionAction | null;
    scamInfo?: ScamInfo | null;
    type?: 'Transaction' | 'SmartContractResult' | 'Reward' | null;
    originalTxHash?: string | null;
    pendingResults?: boolean | null;
    guardianAddress?: string | null;
    guardianSignature?: string | null;
    isRelayed?: string | null;
    relayer?: string | null;
    relayerSignature?: string | null;
    isScCall?: boolean | null;
}

interface Nft {
    identifier: string;
    collection: string;
    hash: string;
    timestamp: number | null;
    attributes: string;
    nonce: number;
    type: string;
    subType: string;
    name: string;
    creator: string;
    royalties: number | null;
    uris: string[];
    url: string;
    media?: NftMedia;
    isWhitelistedStorage: boolean;
    thumbnailUrl: string;
    tags: string[];
    metadata: NftMetadata;
    owner: string | null;
    balance: string | null;
    supply: string;
    decimals: number | null;
    assets?: TokenAssets;
    ticker: string;
    scamInfo?: ScamInfo;
    score?: number;
    rank?: number;
    rarities?: NftRarities;
    isNsfw: boolean;
    unlockSchedule?: UnlockMileStoneModel[];
    unlockEpoch?: number;
}

interface NftAccount {
    address: string;
    balance: string;
}

interface NftSupply {
    supply: string;
    circulatingSupply: string;
    minted: string;
    burnt: string;
}

interface ProcessNftRequest {
    collection: string;
    identifier: string;
    forceRefreshMedia: boolean;
    forceRefreshMetadata: boolean;
    forceRefreshThumbnail: boolean;
    skipRefreshThumbnail: boolean;
    uploadAsset: boolean;
}

export const nftTools = [
    {
        name: 'get-nfts',
        description: 'Returns a list of Non-Fungible / Semi-Fungible / MetaESDT tokens available on blockchain',
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
                search: {
                    type: 'string',
                    description: 'Search by collection identifier'
                },
                identifiers: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Search by token identifiers, comma-separated'
                },
                type: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by type (NonFungibleESDT/SemiFungibleESDT)'
                },
                subType: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by subType'
                },
                collection: {
                    type: 'string',
                    description: 'Get all tokens by token collection'
                },
                collections: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Get all tokens by token collections, comma-separated'
                },
                name: {
                    type: 'string',
                    description: 'Get all nfts by name'
                },
                tags: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by one or more comma-separated tags'
                },
                creator: {
                    type: 'string',
                    description: 'Return all NFTs associated with a given creator'
                },
                isWhitelistedStorage: {
                    type: 'boolean',
                    description: 'Return all NFTs that are whitelisted in storage'
                },
                hasUris: {
                    type: 'boolean',
                    description: 'Return all NFTs that have one or more uris'
                },
                isNsfw: {
                    type: 'boolean',
                    description: 'Filter by NSFW status'
                },
                isScam: {
                    type: 'boolean',
                    description: 'Filter by scam status'
                },
                scamType: {
                    type: 'string',
                    description: 'Filter by scam type'
                },
                before: {
                    type: 'number',
                    description: 'Return all NFTs before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return all NFTs after given timestamp'
                },
                withOwner: {
                    type: 'boolean',
                    description: 'Return owner where type = NonFungibleESDT'
                },
                withSupply: {
                    type: 'boolean',
                    description: 'Return supply where type = SemiFungibleESDT'
                },
                withScamInfo: {
                    type: 'boolean',
                    description: 'Return scam info for the NFT'
                },
                computeScamInfo: {
                    type: 'boolean',
                    description: 'Compute scam info for the NFT'
                },
                sort: {
                    type: 'string',
                    description: 'Sort criteria'
                },
                order: {
                    type: 'string',
                    description: 'Sort order (asc/desc)'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                },
                withRoles: {
                    type: 'boolean',
                    description: 'Returns roles for the NFT'
                },
                withRarities: {
                    type: 'boolean',
                    description: 'Returns rarities for the NFT'
                },
                rarityAlgorithm: {
                    type: 'string',
                    description: 'Rarity algorithm to use'
                },
                includeRarities: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Include specific rarities'
                }
            }
        }
    },
    {
        name: 'get-nfts-count',
        description: 'Returns the total number of Non-Fungible / Semi-Fungible / MetaESDT tokens',
        inputSchema: {
            type: 'object',
            properties: {
                search: {
                    type: 'string',
                    description: 'Search by collection identifier'
                },
                identifiers: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Search by token identifiers, comma-separated'
                },
                type: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by type (NonFungibleESDT/SemiFungibleESDT)'
                },
                subType: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by subType'
                },
                collection: {
                    type: 'string',
                    description: 'Get all tokens by token collection'
                },
                collections: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Get all tokens by token collections, comma-separated'
                },
                name: {
                    type: 'string',
                    description: 'Get all nfts by name'
                },
                tags: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by one or more comma-separated tags'
                },
                creator: {
                    type: 'string',
                    description: 'Return all NFTs associated with a given creator'
                },
                isWhitelistedStorage: {
                    type: 'boolean',
                    description: 'Return all NFTs that are whitelisted in storage'
                },
                hasUris: {
                    type: 'boolean',
                    description: 'Return all NFTs that have one or more uris'
                },
                isNsfw: {
                    type: 'boolean',
                    description: 'Filter by NSFW status'
                },
                isScam: {
                    type: 'boolean',
                    description: 'Filter by scam status'
                },
                scamType: {
                    type: 'string',
                    description: 'Filter by scam type'
                },
                before: {
                    type: 'number',
                    description: 'Return all NFTs before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return all NFTs after given timestamp'
                }
            }
        }
    },
    {
        name: 'get-nft',
        description: 'Returns the details of a Non-Fungible / Semi-Fungible / MetaESDT token',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Token identifier'
                },
                withOwner: {
                    type: 'boolean',
                    description: 'Return owner of the NFT'
                },
                withSupply: {
                    type: 'boolean',
                    description: 'Return supply of the NFT'
                },
                withScamInfo: {
                    type: 'boolean',
                    description: 'Return scam info for the NFT'
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
        name: 'get-nft-accounts',
        description: 'Returns a list of addresses that hold a specific Non-Fungible / Semi-Fungible / MetaESDT token',
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
        name: 'get-nft-accounts-count',
        description: 'Returns the total number of addresses that hold a specific Non-Fungible / Semi-Fungible / MetaESDT token',
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
        name: 'get-nft-supply',
        description: 'Returns the supply of a specific Non-Fungible / Semi-Fungible / MetaESDT token',
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
        name: 'get-nft-transactions',
        description: 'Returns a list of transactions for a NonFungibleESDT or SemiFungibleESDT',
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
                    type: 'array',
                    items: {
                        type: 'string'
                    },
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
                    enum: ['success', 'pending', 'invalid', 'fail'],
                    description: 'Filter by transaction status'
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
                    description: 'Return transactions before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return transactions after given timestamp'
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
                withLogs: {
                    type: 'boolean',
                    description: 'Return logs for transactions'
                },
                withScamInfo: {
                    type: 'boolean',
                    description: 'Return scam info for transactions'
                },
                withUsername: {
                    type: 'boolean',
                    description: 'Integrates username in assets for all addresses present in the transactions'
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
        name: 'get-nft-transactions-count',
        description: 'Returns the total number of transactions for a specific NonFungibleESDT or SemiFungibleESDT',
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
                    type: 'array',
                    items: {
                        type: 'string'
                    },
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
                    enum: ['success', 'pending', 'invalid', 'fail'],
                    description: 'Filter by transaction status'
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
                    description: 'Return transactions before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return transactions after given timestamp'
                }
            },
            required: ['identifier']
        }
    },
    {
        name: 'get-nft-transfers',
        description: 'Returns a list of transfers for a NonFungibleESDT or SemiFungibleESDT',
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
                before: {
                    type: 'number',
                    description: 'Return transfers before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return transfers after given timestamp'
                },
                order: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: 'Sort order (asc/desc)'
                },
                withUsername: {
                    type: 'boolean',
                    description: 'Integrates username in assets for all addresses present in the transfers'
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
        name: 'get-nft-transfers-count',
        description: 'Returns the total number of transfers for a specific NonFungibleESDT or SemiFungibleESDT',
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
                before: {
                    type: 'number',
                    description: 'Return transfers before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return transfers after given timestamp'
                }
            },
            required: ['identifier']
        }
    },
    /* {
        name: 'process-nfts',
        description: 'Trigger NFT media/metadata reprocessing for collection owners',
        inputSchema: {
            type: 'object',
            properties: {
                collection: {
                    type: 'string',
                    description: 'Collection identifier for which to trigger reprocessing'
                },
                identifier: {
                    type: 'string',
                    description: 'NFT identifier to process'
                },
                forceRefreshMedia: {
                    type: 'boolean',
                    description: 'Force refresh media files'
                },
                forceRefreshMetadata: {
                    type: 'boolean',
                    description: 'Force refresh metadata'
                },
                forceRefreshThumbnail: {
                    type: 'boolean',
                    description: 'Force refresh thumbnail'
                },
                skipRefreshThumbnail: {
                    type: 'boolean',
                    description: 'Skip refreshing thumbnail'
                },
                uploadAsset: {
                    type: 'boolean',
                    description: 'Upload asset'
                }
            },
            required: ['collection', 'identifier', 'forceRefreshMedia', 'forceRefreshMetadata', 'forceRefreshThumbnail', 'skipRefreshThumbnail', 'uploadAsset']
        }
    }, */
];

export async function handleGetNfts(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.search !== undefined) queryParams.append('search', params.search);
        if (params.identifiers !== undefined) queryParams.append('identifiers', params.identifiers.join(','));
        if (params.type !== undefined) queryParams.append('type', params.type.join(','));
        if (params.subType !== undefined) queryParams.append('subType', params.subType.join(','));
        if (params.collection !== undefined) queryParams.append('collection', params.collection);
        if (params.collections !== undefined) queryParams.append('collections', params.collections.join(','));
        if (params.name !== undefined) queryParams.append('name', params.name);
        if (params.tags !== undefined) queryParams.append('tags', params.tags.join(','));
        if (params.creator !== undefined) queryParams.append('creator', params.creator);
        if (params.isWhitelistedStorage !== undefined) queryParams.append('isWhitelistedStorage', params.isWhitelistedStorage.toString());
        if (params.hasUris !== undefined) queryParams.append('hasUris', params.hasUris.toString());
        if (params.isNsfw !== undefined) queryParams.append('isNsfw', params.isNsfw.toString());
        if (params.isScam !== undefined) queryParams.append('isScam', params.isScam.toString());
        if (params.scamType !== undefined) queryParams.append('scamType', params.scamType);
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());
        if (params.withOwner !== undefined) queryParams.append('withOwner', params.withOwner.toString());
        if (params.withSupply !== undefined) queryParams.append('withSupply', params.withSupply.toString());
        if (params.withScamInfo !== undefined) queryParams.append('withScamInfo', params.withScamInfo.toString());
        if (params.computeScamInfo !== undefined) queryParams.append('computeScamInfo', params.computeScamInfo.toString());
        if (params.sort !== undefined) queryParams.append('sort', params.sort);
        if (params.order !== undefined) queryParams.append('order', params.order);
        if (params.withRoles !== undefined) queryParams.append('withRoles', params.withRoles.toString());
        if (params.withRarities !== undefined) queryParams.append('withRarities', params.withRarities.toString());
        if (params.rarityAlgorithm !== undefined) queryParams.append('rarityAlgorithm', params.rarityAlgorithm);
        if (params.includeRarities !== undefined) queryParams.append('includeRarities', params.includeRarities.join(','));

        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_NFT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/nfts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<Nft[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(nft => {
                const filteredNft: Partial<Nft> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in nft) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredNft as any)[field] = nft[field as keyof Nft];
                    }
                });
                return filteredNft as Nft;
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
            `Failed to get NFTs: ${errorMessage}`
        );
    }
}

export async function handleGetNftsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.search !== undefined) queryParams.append('search', params.search);
        if (params.identifiers !== undefined) queryParams.append('identifiers', params.identifiers.join(','));
        if (params.type !== undefined) queryParams.append('type', params.type.join(','));
        if (params.subType !== undefined) queryParams.append('subType', params.subType.join(','));
        if (params.collection !== undefined) queryParams.append('collection', params.collection);
        if (params.collections !== undefined) queryParams.append('collections', params.collections.join(','));
        if (params.name !== undefined) queryParams.append('name', params.name);
        if (params.tags !== undefined) queryParams.append('tags', params.tags.join(','));
        if (params.creator !== undefined) queryParams.append('creator', params.creator);
        if (params.isWhitelistedStorage !== undefined) queryParams.append('isWhitelistedStorage', params.isWhitelistedStorage.toString());
        if (params.hasUris !== undefined) queryParams.append('hasUris', params.hasUris.toString());
        if (params.isNsfw !== undefined) queryParams.append('isNsfw', params.isNsfw.toString());
        if (params.isScam !== undefined) queryParams.append('isScam', params.isScam.toString());
        if (params.scamType !== undefined) queryParams.append('scamType', params.scamType);
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());

        const url = `/nfts/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get NFTs count: ${errorMessage}`
        );
    }
}

export async function handleGetNft(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'NFT identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.withOwner !== undefined) queryParams.append('withOwner', params.withOwner.toString());
        if (params.withSupply !== undefined) queryParams.append('withSupply', params.withSupply.toString());
        if (params.withScamInfo !== undefined) queryParams.append('withScamInfo', params.withScamInfo.toString());

        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_NFT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/nfts/${params.identifier}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<Nft>(url);

        // Filter out the ranks property from assets if it exists
        if (response.assets && 'ranks' in response.assets) {
            // Create a new assets object without the ranks property
            const { ranks, ...assetsWithoutRanks } = response.assets as any;
            response.assets = assetsWithoutRanks;
        }

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredNft: Partial<Nft> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredNft as any)[field] = response[field as keyof Nft];
                }
            });
            filteredResponse = filteredNft as Nft;
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
            `Failed to get NFT: ${errorMessage}`
        );
    }
}

export async function handleGetNftAccounts(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'NFT identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());

        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_NFT_ACCOUNT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/nfts/${params.identifier}/accounts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<NftAccount[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(account => {
                const filteredAccount: Partial<NftAccount> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in account) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredAccount as any)[field] = account[field as keyof NftAccount];
                    }
                });
                return filteredAccount as NftAccount;
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
            `Failed to get NFT accounts: ${errorMessage}`
        );
    }
}

export async function handleGetNftAccountsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'NFT identifier is required');
        }

        const url = `/nfts/${params.identifier}/accounts/count`;
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
            `Failed to get NFT accounts count: ${errorMessage}`
        );
    }
}

export async function handleGetNftSupply(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'NFT identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_NFT_SUPPLY_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/nfts/${params.identifier}/supply${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<NftSupply>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredSupply: Partial<NftSupply> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredSupply as any)[field] = response[field as keyof NftSupply];
                }
            });
            filteredResponse = filteredSupply as NftSupply;
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
            `Failed to get NFT supply: ${errorMessage}`
        );
    }
}

export async function handleGetNftTransactions(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'NFT identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.sender !== undefined) queryParams.append('sender', params.sender);
        if (params.receiver !== undefined) queryParams.append('receiver', Array.isArray(params.receiver) ? params.receiver.join(',') : params.receiver);
        if (params.senderShard !== undefined) queryParams.append('senderShard', params.senderShard.toString());
        if (params.receiverShard !== undefined) queryParams.append('receiverShard', params.receiverShard.toString());
        if (params.miniBlockHash !== undefined) queryParams.append('miniBlockHash', params.miniBlockHash);
        if (params.hashes !== undefined) queryParams.append('hashes', Array.isArray(params.hashes) ? params.hashes.join(',') : params.hashes);
        if (params.status !== undefined) queryParams.append('status', params.status);
        if (params.function !== undefined) queryParams.append('function', Array.isArray(params.function) ? params.function.join(',') : params.function);
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());
        if (params.order !== undefined) queryParams.append('order', params.order);
        if (params.withScResults !== undefined) queryParams.append('withScResults', params.withScResults.toString());
        if (params.withOperations !== undefined) queryParams.append('withOperations', params.withOperations.toString());
        if (params.withLogs !== undefined) queryParams.append('withLogs', params.withLogs.toString());
        if (params.withScamInfo !== undefined) queryParams.append('withScamInfo', params.withScamInfo.toString());
        if (params.withUsername !== undefined) queryParams.append('withUsername', params.withUsername.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_NFT_TRANSACTION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/nfts/${params.identifier}/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get NFT transactions: ${errorMessage}`
        );
    }
}

export async function handleGetNftTransactionsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'NFT identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.sender !== undefined) queryParams.append('sender', params.sender);
        if (params.receiver !== undefined) queryParams.append('receiver', Array.isArray(params.receiver) ? params.receiver.join(',') : params.receiver);
        if (params.senderShard !== undefined) queryParams.append('senderShard', params.senderShard.toString());
        if (params.receiverShard !== undefined) queryParams.append('receiverShard', params.receiverShard.toString());
        if (params.miniBlockHash !== undefined) queryParams.append('miniBlockHash', params.miniBlockHash);
        if (params.hashes !== undefined) queryParams.append('hashes', Array.isArray(params.hashes) ? params.hashes.join(',') : params.hashes);
        if (params.status !== undefined) queryParams.append('status', params.status);
        if (params.function !== undefined) queryParams.append('function', Array.isArray(params.function) ? params.function.join(',') : params.function);
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());

        const url = `/nfts/${params.identifier}/transactions/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get NFT transactions count: ${errorMessage}`
        );
    }
}

export async function handleGetNftTransfers(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'NFT identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.sender !== undefined) queryParams.append('sender', params.sender);
        if (params.receiver !== undefined) queryParams.append('receiver', params.receiver);
        if (params.senderShard !== undefined) queryParams.append('senderShard', params.senderShard.toString());
        if (params.receiverShard !== undefined) queryParams.append('receiverShard', params.receiverShard.toString());
        if (params.miniBlockHash !== undefined) queryParams.append('miniBlockHash', params.miniBlockHash);
        if (params.hashes !== undefined) queryParams.append('hashes', params.hashes.join(','));
        if (params.status !== undefined) queryParams.append('status', params.status);
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());
        if (params.order !== undefined) queryParams.append('order', params.order);
        if (params.withUsername !== undefined) queryParams.append('withUsername', params.withUsername.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_NFT_TRANSFER_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/nfts/${params.identifier}/transfers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<Transaction[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(transfer => {
                const filteredTransfer: Partial<Transaction> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in transfer) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredTransfer as any)[field] = transfer[field as keyof Transaction];
                    }
                });
                return filteredTransfer as Transaction;
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
            `Failed to get NFT transfers: ${errorMessage}`
        );
    }
}

export async function handleGetNftTransfersCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'NFT identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.sender !== undefined) queryParams.append('sender', params.sender);
        if (params.receiver !== undefined) queryParams.append('receiver', params.receiver);
        if (params.senderShard !== undefined) queryParams.append('senderShard', params.senderShard.toString());
        if (params.receiverShard !== undefined) queryParams.append('receiverShard', params.receiverShard.toString());
        if (params.miniBlockHash !== undefined) queryParams.append('miniBlockHash', params.miniBlockHash);
        if (params.hashes !== undefined) queryParams.append('hashes', params.hashes.join(','));
        if (params.status !== undefined) queryParams.append('status', params.status);
        if (params.before !== undefined) queryParams.append('before', params.before.toString());
        if (params.after !== undefined) queryParams.append('after', params.after.toString());

        const url = `/nfts/${params.identifier}/transfers/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get NFT transfers count: ${errorMessage}`
        );
    }
}

/**
 * Process NFTs by triggering media/metadata reprocessing
 * @param params The processing parameters
 * @returns Response with status of the processing request
 */
export async function handleProcessNfts(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        // Validate required parameters
        if (!params.collection) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'NFT identifier is required');
        }
        if (params.forceRefreshMedia === undefined) {
            throw new McpError(ErrorCode.InvalidParams, 'forceRefreshMedia parameter is required');
        }
        if (params.forceRefreshMetadata === undefined) {
            throw new McpError(ErrorCode.InvalidParams, 'forceRefreshMetadata parameter is required');
        }
        if (params.forceRefreshThumbnail === undefined) {
            throw new McpError(ErrorCode.InvalidParams, 'forceRefreshThumbnail parameter is required');
        }
        if (params.skipRefreshThumbnail === undefined) {
            throw new McpError(ErrorCode.InvalidParams, 'skipRefreshThumbnail parameter is required');
        }
        if (params.uploadAsset === undefined) {
            throw new McpError(ErrorCode.InvalidParams, 'uploadAsset parameter is required');
        }

        const requestBody: ProcessNftRequest = {
            collection: params.collection,
            identifier: params.identifier,
            forceRefreshMedia: params.forceRefreshMedia,
            forceRefreshMetadata: params.forceRefreshMetadata,
            forceRefreshThumbnail: params.forceRefreshThumbnail,
            skipRefreshThumbnail: params.skipRefreshThumbnail,
            uploadAsset: params.uploadAsset
        };

        const url = '/nfts/process';
        await mxApiClient.post(url, requestBody);

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ 
                        success: true, 
                        message: 'NFT media/metadata reprocessing has been triggered' 
                    }, null, 2)
                }
            ]
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to process NFTs: ${errorMessage}`
        );
    }
}
