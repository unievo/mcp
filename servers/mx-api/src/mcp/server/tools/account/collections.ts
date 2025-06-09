import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_COLLECTION_FIELDS = ['collection', 'name', 'type', 'count', 'nftCount', 'holderCount', 'timestamp'];
const DEFAULT_COLLECTION_DETAILS_FIELDS = ['collection', 'name', 'type', 'subType', 'count', 'nftCount', 'holderCount', 'owner', 'timestamp'];

interface ScamInfo {
    type: string;
    info: string;
}

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

interface NftCollectionAccount {
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
    count: number;
}

interface TokenRole {
    address: string;
    canCreate: boolean;
    canBurn: boolean;
    canAddQuantity: boolean;
    canUpdateAttributes: boolean;
    canAddUri: boolean;
    canTransferRole: boolean;
    roles: string[];
}

interface NftCollectionAccountDetailed extends NftCollectionAccount {
    roles?: TokenRole[];
}

export const accountCollectionTools = [
    {
        name: 'get-account-collections',
        description: 'Returns NFT/SFT/MetaESDT collections where the account owns one or more NFTs',
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
                search: {
                    type: 'string',
                    description: 'Search by collection identifier'
                },
                type: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filter by type (NonFungibleESDT/SemiFungibleESDT/MetaESDT)'
                },
                subType: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filter by type (NonFungibleESDTv2/DynamicNonFungibleESDT/DynamicSemiFungibleESDT)'
                },
                excludeMetaESDT: {
                    type: 'boolean',
                    description: 'Exclude collections of type "MetaESDT" in the response'
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
        name: 'get-account-collections-count',
        description: 'Returns the total number of NFT/SFT/MetaESDT collections where the account owns one or more NFTs',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                search: {
                    type: 'string',
                    description: 'Search by collection identifier'
                },
                type: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filter by type (NonFungibleESDT/SemiFungibleESDT/MetaESDT)'
                },
                subType: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filter by type (NonFungibleESDTv2/DynamicNonFungibleESDT/DynamicSemiFungibleESDT)'
                },
                excludeMetaESDT: {
                    type: 'boolean',
                    description: 'Exclude collections of type "MetaESDT" in the response'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'get-account-collection',
        description: 'Returns details about a specific NFT/SFT/MetaESDT collection from a given address',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
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
            required: ['address', 'collection']
        }
    }
];

export async function handleGetAccountCollections(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.type) queryParams.append('type', params.type.join(','));
        if (params.subType) queryParams.append('subType', params.subType.join(','));
        if (params.excludeMetaESDT !== undefined) queryParams.append('excludeMetaESDT', params.excludeMetaESDT.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_COLLECTION_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/collections${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<NftCollectionAccount[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(collection => {
                const filteredCollection: Partial<NftCollectionAccount> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in collection) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredCollection as any)[field] = collection[field as keyof NftCollectionAccount];
                    }
                });
                return filteredCollection as NftCollectionAccount;
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
            `Failed to get account collections: ${errorMessage}`
        );
    }
}

export async function handleGetAccountCollectionsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        // Add missing parameters according to the specification
        if (params.search) queryParams.append('search', params.search);
        if (params.type) queryParams.append('type', params.type.join(','));
        if (params.subType) queryParams.append('subType', params.subType.join(','));
        if (params.excludeMetaESDT !== undefined) queryParams.append('excludeMetaESDT', params.excludeMetaESDT.toString());

        const url = `/accounts/${params.address}/collections/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get account collections count: ${errorMessage}`
        );
    }
}

export async function handleGetAccountCollection(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }
        if (!params.collection) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_COLLECTION_DETAILS_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/collections/${params.collection}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<NftCollectionAccountDetailed>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredCollection: Partial<NftCollectionAccountDetailed> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredCollection as any)[field] = response[field as keyof NftCollectionAccountDetailed];
                }
            });
            filteredResponse = filteredCollection as NftCollectionAccountDetailed;
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
            `Failed to get account collection details: ${errorMessage}`
        );
    }
}
