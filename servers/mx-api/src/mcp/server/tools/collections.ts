import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../api-client.js';

// Default fields configuration
const DEFAULT_COLLECTION_FIELDS = ['collection', 'type', 'subType', 'name', 'ticker', 'owner', 'timestamp', 'isVerified', 'holderCount', 'nftCount'];
const DEFAULT_COLLECTION_NFT_FIELDS = ['identifier', 'collection', 'type', 'subType', 'name', 'creator', 'owner', 'tags', 'supply', 'decimals', 'balance', 'timestamp', 'url'];
const DEFAULT_COLLECTION_TRANSACTION_FIELDS = ['txHash', 'sender', 'receiver', 'value', 'status', 'timestamp'];
const DEFAULT_COLLECTION_TRANSFER_FIELDS = ['txHash', 'sender', 'receiver', 'type', 'status', 'timestamp'];

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
    preferredRankAlgorithm?: string;
    priceSource?: number;
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
    type: string;
    info: string;
}

interface CollectionTraitAttribute {
    name: string;
    occurrenceCount: number;
    occurrencePercentage: number;
}

interface CollectionTrait {
    name: string;
    occurrenceCount: number;
    occurrencePercentage: number;
    attributes: CollectionTraitAttribute[];
}

interface CollectionAuctionStats {
    activeAuctions: number;
    endedAuctions: number;
    maxPrice: string;
    minPrice: string;
    saleAverage: string;
    volumeTraded: string;
}

interface NftRarity {
    rank?: number;
    score: number;
}

interface NftRarities {
    statistical?: NftRarity;
    trait?: NftRarity;
    jaccardDistances?: NftRarity;
    openRarity?: NftRarity;
    custom?: NftRarity;
}

interface Collection {
    collection: string;
    type: string;
    subType: string | null;
    name: string;
    ticker: string;
    owner: string | null;
    timestamp: number;
    canFreeze: boolean;
    canWipe: boolean;
    canPause: boolean;
    canTransferNftCreateRole: boolean;
    canChangeOwner: boolean;
    canUpgrade: boolean;
    canAddSpecialRoles: boolean;
    decimals: number | null;
    assets?: TokenAssets;
    scamInfo?: ScamInfo;
    traits?: CollectionTrait[];
    auctionStats?: CollectionAuctionStats;
    isVerified?: boolean;
    holderCount?: number;
    nftCount?: number;
}

interface NftMedia {
    url: string;
    originalUrl: string;
    thumbnailUrl: string;
    fileType: string;
    fileSize: number;
    contentType?: string;
    width?: number;
    height?: number;
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
    tags?: string[];
    attributes?: {
        trait_type: string;
        value: string;
    }[];
}

interface UnlockMileStoneModel {
    remainingEpochs: number;
    percent: number;
}

interface CollectionNft {
    identifier: string;
    collection: string;
    nonce: number;
    type: string;
    name: string;
    creator: string;
    royalties: number;
    attributes: string;
    balance: string;
    supply: string;
    uris: string[];
    timestamp: number;
    tags: string[];
    media?: NftMedia;
    metadata?: NftMetadata;
    isWhitelistedStorage?: boolean;
    url?: string;
    thumbnailUrl?: string;
    owner?: string;
    decimals?: number;
    assets?: TokenAssets;
    ticker?: string;
    scamInfo?: ScamInfo;
    score?: number;
    rank?: number;
    rarities?: NftRarities;
    isNsfw?: boolean;
    unlockSchedule?: UnlockMileStoneModel[];
    unlockEpoch?: number;
}

interface CollectionRoles {
    address: string | null;
    canCreate: boolean;
    canBurn: boolean;
    canAddQuantity: boolean;
    canUpdateAttributes: boolean;
    canAddUri: boolean;
    canTransfer: boolean;
    roles: string[];
}

interface TransactionAction {
    category: string;
    name: string;
    description: string;
    arguments: {
        [key: string]: string;
    };
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
    action?: TransactionAction;
    senderUsername?: string;
    receiverUsername?: string;
}

interface Transfer {
    txHash: string;
    blockHash: string;
    timestamp: number;
    value: string;
    sender: string;
    receiver: string;
    senderShard: number;
    receiverShard: number;
    type: string;
    status: string;
    action?: TransactionAction;
    function?: string;
    originalTxHash?: string;
}

export const collectionTools = [
    {
        name: 'get-collections',
        description: 'Returns non-fungible/semi-fungible/meta-esdt collections',
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
                    description: 'Search by collection identifiers, comma-separated'
                },
                type: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by type (NonFungibleESDT/SemiFungibleESDT/MetaESDT)'
                },
                subType: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by type (NonFungibleESDTv2/DynamicNonFungibleESDT/DynamicSemiFungibleESDT)'
                },
                before: {
                    type: 'number',
                    description: 'Return all collections before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return all collections after given timestamp'
                },
                canCreate: {
                    type: 'string',
                    description: 'Filter by address with canCreate role'
                },
                canBurn: {
                    type: 'string',
                    description: 'Filter by address with canBurn role'
                },
                canAddQuantity: {
                    type: 'string',
                    description: 'Filter by address with canAddQuantity role'
                },
                canUpdateAttributes: {
                    type: 'string',
                    description: 'Filter by address with canUpdateAttributes role'
                },
                canAddUri: {
                    type: 'string',
                    description: 'Filter by address with canAddUri role'
                },
                canTransferRole: {
                    type: 'string',
                    description: 'Filter by address with canTransferRole role'
                },
                excludeMetaESDT: {
                    type: 'boolean',
                    description: 'Do not include collections of type "MetaESDT" in the response'
                },
                sort: {
                    type: 'string',
                    enum: ['timestamp', 'verifiedAndHolderCount'],
                    description: 'Sorting criteria (timestamp / verifiedAndHolderCount)'
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
                }
            }
        }
    },
    {
        name: 'get-collections-count',
        description: 'Returns non-fungible/semi-fungible/meta-esdt collection count',
        inputSchema: {
            type: 'object',
            properties: {
                search: {
                    type: 'string',
                    description: 'Search by collection identifier'
                },
                type: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by type (NonFungibleESDT/SemiFungibleESDT/MetaESDT)'
                },
                subType: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Filter by type (NonFungibleESDTv2/DynamicNonFungibleESDT/DynamicSemiFungibleESDT)'
                },
                before: {
                    type: 'number',
                    description: 'Return all collections before given timestamp'
                },
                after: {
                    type: 'number',
                    description: 'Return all collections after given timestamp'
                },
                canCreate: {
                    type: 'string',
                    description: 'Filter by address with canCreate role'
                },
                canBurn: {
                    type: 'string',
                    description: 'Filter by address with canBurn role'
                },
                canAddQuantity: {
                    type: 'string',
                    description: 'Filter by address with canAddQuantity role'
                },
                canUpdateAttributes: {
                    type: 'string',
                    description: 'Filter by address with canUpdateAttributes role'
                },
                canAddUri: {
                    type: 'string',
                    description: 'Filter by address with canAddUri role'
                },
                canTransferRole: {
                    type: 'string',
                    description: 'Filter by address with canTransferRole role'
                },
                excludeMetaESDT: {
                    type: 'boolean',
                    description: 'Do not include collections of type "MetaESDT" in the response'
                }
            }
        }
    },
    {
        name: 'get-collection',
        description: 'Returns non-fungible/semi-fungible/meta-esdt collection details',
        inputSchema: {
            type: 'object',
            properties: {
                collection: {
                    type: 'string',
                    description: 'Collection identifier'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['collection']
        }
    },
    {
        name: 'get-collection-nfts',
        description: 'Returns non-fungible/semi-fungible/meta-esdt tokens that belong to a collection',
        inputSchema: {
            type: 'object',
            properties: {
                collection: {
                    type: 'string',
                    description: 'Collection identifier'
                },
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
                nonceBefore: {
                    type: 'number',
                    description: 'Return all NFTs with given nonce before the given number'
                },
                nonceAfter: {
                    type: 'number',
                    description: 'Return all NFTs with given nonce after the given number'
                },
                traits: {
                    type: 'boolean',
                    description: 'Filter NFTs by traits. Key-value format (<key1>:<value1>;<key2>:<value2>)'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['collection']
        }
    },
    {
        name: 'get-collection-nfts-count',
        description: 'Returns non-fungible/semi-fungible/meta-esdt token count that belong to a collection',
        inputSchema: {
            type: 'object',
            properties: {
                collection: {
                    type: 'string',
                    description: 'Collection identifier'
                }
            },
            required: ['collection']
        }
    },
    {
        name: 'get-collection-ranks',
        description: 'Returns NFT ranks in case the custom ranking preferred algorithm was set',
        inputSchema: {
            type: 'object',
            properties: {
                collection: {
                    type: 'string',
                    description: 'Collection identifier'
                }
            },
            required: ['collection']
        }
    },
    {
        name: 'get-collection-transactions',
        description: 'Returns a list of transactions for a specific collection',
        inputSchema: {
            type: 'object',
            properties: {
                collection: {
                    type: 'string',
                    description: 'Collection identifier'
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
                    description: 'Search by multiple receiver addresses, comma-separated'
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
                    description: 'Filter by a specific transaction status (success/pending/invalid/fail)'
                },
                function: {
                    type: 'string',
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
                    description: 'Filter by round number'
                },
                order: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: 'Sort order (asc/desc)'
                },
                withScResults: {
                    type: 'boolean',
                    description: 'Return scResults for transactions'
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
                withRelayedScresults: {
                    type: 'boolean',
                    description: 'If set to true, will include smart contract results that resemble relayed transactions'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['collection']
        }
    },
    {
        name: 'get-collection-transfers',
        description: 'Returns a list of transfers for a specific collection',
        inputSchema: {
            type: 'object',
            properties: {
                collection: {
                    type: 'string',
                    description: 'Collection identifier'
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
                    description: 'Search by multiple receiver addresses, comma-separated'
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
                    description: 'Filter by a specific transaction status (success/pending/invalid/fail)'
                },
                function: {
                    type: 'string',
                    description: 'Filter transfers by function name'
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
                    description: 'Filter by round number'
                },
                order: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: 'Sort order (asc/desc)'
                },
                withScamInfo: {
                    type: 'boolean',
                    description: 'Returns scam information'
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
            required: ['collection']
        }
    },
    {
        name: 'get-collection-transactions-count',
        description: 'Returns the total number of transactions for a specific collection',
        inputSchema: {
            type: 'object',
            properties: {
                collection: {
                    type: 'string',
                    description: 'Collection identifier'
                }
            },
            required: ['collection']
        }
    },
    {
        name: 'get-collection-transfers-count',
        description: 'Returns the total number of transfers for a specific collection',
        inputSchema: {
            type: 'object',
            properties: {
                collection: {
                    type: 'string',
                    description: 'Collection identifier'
                }
            },
            required: ['collection']
        }
    },
    {
        name: 'get-collection-accounts',
        description: 'Returns a list of addresses and balances for a specific collection',
        inputSchema: {
            type: 'object',
            properties: {
                identifier: {
                    type: 'string',
                    description: 'Collection identifier'
                },
                from: {
                    type: 'number',
                    description: 'Number of items to skip for the result set'
                },
                size: {
                    type: 'number',
                    description: 'Number of items to retrieve'
                }
            },
            required: ['identifier']
        }
    }
];

export async function handleGetCollections(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (input.from !== undefined) queryParams.append('from', input.from.toString());
        if (input.size !== undefined) queryParams.append('size', input.size.toString());
        if (input.search !== undefined) queryParams.append('search', input.search);
        if (input.identifiers !== undefined) queryParams.append('identifiers', input.identifiers.join(','));
        if (input.type !== undefined) queryParams.append('type', Array.isArray(input.type) ? input.type.join(',') : input.type);
        if (input.subType !== undefined) queryParams.append('subType', Array.isArray(input.subType) ? input.subType.join(',') : input.subType);
        if (input.before !== undefined) queryParams.append('before', input.before.toString());
        if (input.after !== undefined) queryParams.append('after', input.after.toString());
        if (input.canCreate !== undefined) queryParams.append('canCreate', input.canCreate);
        if (input.canBurn !== undefined) queryParams.append('canBurn', input.canBurn);
        if (input.canAddQuantity !== undefined) queryParams.append('canAddQuantity', input.canAddQuantity);
        if (input.canUpdateAttributes !== undefined) queryParams.append('canUpdateAttributes', input.canUpdateAttributes);
        if (input.canAddUri !== undefined) queryParams.append('canAddUri', input.canAddUri);
        if (input.canTransferRole !== undefined) queryParams.append('canTransferRole', input.canTransferRole);
        if (input.excludeMetaESDT !== undefined) queryParams.append('excludeMetaESDT', input.excludeMetaESDT.toString());
        if (input.sort !== undefined) queryParams.append('sort', input.sort);
        if (input.order !== undefined) queryParams.append('order', input.order);

        // Handle fields parameter
        const fieldsToRetrieve = input.fields || DEFAULT_COLLECTION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/collections${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<Collection[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(collection => {
                const filteredCollection: Partial<Collection> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in collection) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredCollection as any)[field] = collection[field as keyof Collection];
                    }
                });
                return filteredCollection as Collection;
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
            `Failed to fetch collections: ${errorMessage}`
        );
    }
}

export async function handleGetCollectionsCount(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (input.search !== undefined) queryParams.append('search', input.search);
        if (input.type !== undefined) queryParams.append('type', Array.isArray(input.type) ? input.type.join(',') : input.type);
        if (input.subType !== undefined) queryParams.append('subType', Array.isArray(input.subType) ? input.subType.join(',') : input.subType);
        if (input.before !== undefined) queryParams.append('before', input.before.toString());
        if (input.after !== undefined) queryParams.append('after', input.after.toString());
        if (input.canCreate !== undefined) queryParams.append('canCreate', input.canCreate);
        if (input.canBurn !== undefined) queryParams.append('canBurn', input.canBurn);
        if (input.canAddQuantity !== undefined) queryParams.append('canAddQuantity', input.canAddQuantity);
        if (input.canUpdateAttributes !== undefined) queryParams.append('canUpdateAttributes', input.canUpdateAttributes);
        if (input.canAddUri !== undefined) queryParams.append('canAddUri', input.canAddUri);
        if (input.canTransferRole !== undefined) queryParams.append('canTransferRole', input.canTransferRole);
        if (input.excludeMetaESDT !== undefined) queryParams.append('excludeMetaESDT', input.excludeMetaESDT.toString());

        const url = `/collections/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<number>(url);

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
            `Failed to fetch collection count: ${errorMessage}`
        );
    }
}

export async function handleGetCollection(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!input.collection) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = input.fields || DEFAULT_COLLECTION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/collections/${input.collection}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<Collection>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredCollection: Partial<Collection> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredCollection as any)[field] = response[field as keyof Collection];
                }
            });
            filteredResponse = filteredCollection as Collection;
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
            `Failed to fetch collection details: ${errorMessage}`
        );
    }
}

export async function handleGetCollectionNfts(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!input.collection) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (input.from !== undefined) queryParams.append('from', input.from.toString());
        if (input.size !== undefined) queryParams.append('size', input.size.toString());
        if (input.search !== undefined) queryParams.append('search', input.search);
        if (input.identifiers !== undefined) queryParams.append('identifiers', input.identifiers.join(','));
        if (input.name !== undefined) queryParams.append('name', input.name);
        if (input.tags !== undefined) queryParams.append('tags', input.tags.join(','));
        if (input.creator !== undefined) queryParams.append('creator', input.creator);
        if (input.isWhitelistedStorage !== undefined) queryParams.append('isWhitelistedStorage', input.isWhitelistedStorage.toString());
        if (input.hasUris !== undefined) queryParams.append('hasUris', input.hasUris.toString());
        if (input.nonceBefore !== undefined) queryParams.append('nonceBefore', input.nonceBefore.toString());
        if (input.nonceAfter !== undefined) queryParams.append('nonceAfter', input.nonceAfter.toString());
        if (input.traits !== undefined) queryParams.append('traits', input.traits.toString());

        // Handle fields parameter
        const fieldsToRetrieve = input.fields || DEFAULT_COLLECTION_NFT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/collections/${input.collection}/nfts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<CollectionNft[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(nft => {
                const filteredNft: Partial<CollectionNft> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in nft) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredNft as any)[field] = nft[field as keyof CollectionNft];
                    }
                });
                return filteredNft as CollectionNft;
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
            `Failed to fetch collection NFTs: ${errorMessage}`
        );
    }
}

export async function handleGetCollectionNftsCount(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!input.collection) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }

        const url = `/collections/${input.collection}/nfts/count`;
        const response = await mxApiClient.get<number>(url);

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
            `Failed to fetch collection NFTs count: ${errorMessage}`
        );
    }
}

export async function handleGetCollectionRanks(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!input.collection) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }

        const url = `/collections/${input.collection}/ranks`;
        const response = await mxApiClient.get<any>(url);

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
            `Failed to fetch collection ranks: ${errorMessage}`
        );
    }
}

export async function handleGetCollectionTransactions(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!input.collection) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (input.from !== undefined) queryParams.append('from', input.from.toString());
        if (input.size !== undefined) queryParams.append('size', input.size.toString());
        if (input.sender !== undefined) queryParams.append('sender', input.sender);
        if (input.receiver !== undefined) queryParams.append('receiver', input.receiver);
        if (input.senderShard !== undefined) queryParams.append('senderShard', input.senderShard.toString());
        if (input.receiverShard !== undefined) queryParams.append('receiverShard', input.receiverShard.toString());
        if (input.miniBlockHash !== undefined) queryParams.append('miniBlockHash', input.miniBlockHash);
        if (input.hashes !== undefined) queryParams.append('hashes', input.hashes.join(','));
        if (input.status !== undefined) queryParams.append('status', input.status);
        if (input.function !== undefined) queryParams.append('function', input.function);
        if (input.before !== undefined) queryParams.append('before', input.before.toString());
        if (input.after !== undefined) queryParams.append('after', input.after.toString());
        if (input.round !== undefined) queryParams.append('round', input.round.toString());
        if (input.order !== undefined) queryParams.append('order', input.order);
        if (input.withScResults !== undefined) queryParams.append('withScResults', input.withScResults.toString());
        if (input.withOperations !== undefined) queryParams.append('withOperations', input.withOperations.toString());
        if (input.withLogs !== undefined) queryParams.append('withLogs', input.withLogs.toString());
        if (input.withScamInfo !== undefined) queryParams.append('withScamInfo', input.withScamInfo.toString());
        if (input.withUsername !== undefined) queryParams.append('withUsername', input.withUsername.toString());
        if (input.withRelayedScresults !== undefined) queryParams.append('withRelayedScresults', input.withRelayedScresults.toString());

        // Handle fields parameter
        const fieldsToRetrieve = input.fields || DEFAULT_COLLECTION_TRANSACTION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/collections/${input.collection}/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to fetch collection transactions: ${errorMessage}`
        );
    }
}

export async function handleGetCollectionTransfers(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!input.collection) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (input.from !== undefined) queryParams.append('from', input.from.toString());
        if (input.size !== undefined) queryParams.append('size', input.size.toString());
        if (input.sender !== undefined) queryParams.append('sender', input.sender);
        if (input.receiver !== undefined) queryParams.append('receiver', input.receiver);
        if (input.senderShard !== undefined) queryParams.append('senderShard', input.senderShard.toString());
        if (input.receiverShard !== undefined) queryParams.append('receiverShard', input.receiverShard.toString());
        if (input.miniBlockHash !== undefined) queryParams.append('miniBlockHash', input.miniBlockHash);
        if (input.hashes !== undefined) queryParams.append('hashes', input.hashes.join(','));
        if (input.status !== undefined) queryParams.append('status', input.status);
        if (input.function !== undefined) queryParams.append('function', input.function);
        if (input.before !== undefined) queryParams.append('before', input.before.toString());
        if (input.after !== undefined) queryParams.append('after', input.after.toString());
        if (input.round !== undefined) queryParams.append('round', input.round.toString());
        if (input.order !== undefined) queryParams.append('order', input.order);
        if (input.withScamInfo !== undefined) queryParams.append('withScamInfo', input.withScamInfo.toString());
        if (input.withUsername !== undefined) queryParams.append('withUsername', input.withUsername.toString());

        // Handle fields parameter
        const fieldsToRetrieve = input.fields || DEFAULT_COLLECTION_TRANSFER_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/collections/${input.collection}/transfers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to fetch collection transfers: ${errorMessage}`
        );
    }
}

export async function handleGetCollectionTransactionsCount(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!input.collection) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }

        const url = `/collections/${input.collection}/transactions/count`;
        const response = await mxApiClient.get<number>(url);

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
            `Failed to fetch collection transactions count: ${errorMessage}`
        );
    }
}

export async function handleGetCollectionTransfersCount(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!input.collection) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }

        const url = `/collections/${input.collection}/transfers/count`;
        const response = await mxApiClient.get<number>(url);

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
            `Failed to fetch collection transfers count: ${errorMessage}`
        );
    }
}

export async function handleGetCollectionAccounts(input: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!input.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        if (input.from !== undefined) queryParams.append('from', input.from.toString());
        if (input.size !== undefined) queryParams.append('size', input.size.toString());

        const url = `/collections/${input.identifier}/accounts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<any[]>(url);

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
            `Failed to fetch collection accounts: ${errorMessage}`
        );
    }
}
