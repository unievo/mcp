import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_NFT_FIELDS = ['identifier', 'balance', 'collection', 'timestamp', 'type', 'subType', 'name', 'tags', 'supply', 'decimals', 'url'];

interface TokenAssets {
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
    type: string;
    info: string;
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

interface NftMetadata {
    description: string;
    fileType: string;
    fileUri: string;
    fileName: string;
    attributes?: {
        trait_type: string;
        value: string;
    }[];
    error?: {
        code: string;
        message: string;
    };
    tags?: string[];
    creator?: string;
    royalties?: number;
    metadata?: string;
}

interface NftRarity {
    value: number;
    rank?: number;
}

interface NftRarities {
    statistical?: NftRarity;
    trait?: NftRarity;
    jaccard?: NftRarity;
    openrarity?: NftRarity;
    custom?: NftRarity;
}

interface UnlockMileStoneModel {
    name: string;
    description: string;
    epoch: number;
}

interface AccountNft {
    identifier: string;
    collection: string;
    hash: string;
    timestamp: number;
    attributes: string;
    nonce: number;
    type: string;
    subType: string;
    name: string;
    creator: string;
    royalties: number;
    uris: string[];
    url: string;
    media?: NftMedia;
    isWhitelistedStorage: boolean;
    thumbnailUrl: string;
    tags: string[];
    metadata?: NftMetadata;
    owner: string;
    balance: string;
    supply: string;
    decimals: number;
    assets?: TokenAssets;
    ticker: string;
    scamInfo?: ScamInfo;
    score?: number;
    rank?: number;
    rarities?: NftRarities;
    isNsfw: boolean;
    unlockSchedule?: UnlockMileStoneModel[];
    unlockEpoch?: number;
    price?: number;
    valueUsd?: number;
}

export const accountNftsTools = [
    {
        name: 'get-account-nfts',
        description: 'Returns a list of all available NFTs/SFTs/MetaESDTs owned by the provided address',
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
                identifiers: {
                    type: 'string',
                    description: 'Filter by identifier, comma-separated'
                },
                type: {
                    type: 'string',
                    description: 'Filter by type (NonFungibleESDT/SemiFungibleESDT/MetaESDT)'
                },
                subType: {
                    type: 'string',
                    description: 'Filter by sub-type (SemiFungibleESDT)'
                },
                collection: {
                    type: 'string',
                    description: 'Filter by collection'
                },
                collections: {
                    type: 'string',
                    description: 'Filter by collection, comma-separated'
                },
                name: {
                    type: 'string',
                    description: 'Filter by name'
                },
                tags: {
                    type: 'string',
                    description: 'Filter by tags, comma-separated'
                },
                creator: {
                    type: 'string',
                    description: 'Filter by creator'
                },
                hasUris: {
                    type: 'boolean',
                    description: 'Filter by presence of URIs'
                },
                includeFlagged: {
                    type: 'boolean',
                    description: 'Include flagged NFTs in the response'
                },
                withSupply: {
                    type: 'boolean',
                    description: 'Include supply information in the response'
                },
                source: {
                    type: 'string',
                    description: 'Filter by source'
                },
                excludeMetaESDT: {
                    type: 'boolean',
                    description: 'Exclude MetaESDTs from the response'
                },
                isScam: {
                    type: 'boolean',
                    description: 'Filter by scam status'
                },
                scamType: {
                    type: 'string',
                    description: 'Filter by scam type'
                },
                timestamp: {
                    type: 'number',
                    description: 'Filter by timestamp'
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
        name: 'get-account-nfts-count',
        description: 'Returns the total number of NFT/SFT tokens from a given address',
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
                    type: 'string',
                    description: 'Filter by type (NonFungibleESDT/SemiFungibleESDT/MetaESDT)'
                },
                name: {
                    type: 'string',
                    description: 'Filter by name'
                },
                collections: {
                    type: 'string',
                    description: 'Filter by collection, comma-separated'
                },
                tags: {
                    type: 'string',
                    description: 'Filter by tags, comma-separated'
                },
                creator: {
                    type: 'string',
                    description: 'Filter by creator'
                },
                hasUris: {
                    type: 'boolean',
                    description: 'Filter by presence of URIs'
                },
                includeFlagged: {
                    type: 'boolean',
                    description: 'Include flagged NFTs in the response'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'get-account-nft',
        description: 'Returns details about a specific NFT/SFT token for a given address',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                nft: {
                    type: 'string',
                    description: 'NFT identifier'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                },
                extract: {
                    type: 'string',
                    description: 'Extract a specific field from the response'
                },
                timestamp: {
                    type: 'number',
                    description: 'Filter by timestamp'
                }
            },
            required: ['address', 'nft']
        }
    }
];

export async function handleGetAccountNfts(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        // Pagination parameters
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        
        // Filter parameters
        if (params.search) queryParams.append('search', params.search);
        if (params.identifiers) queryParams.append('identifiers', params.identifiers);
        if (params.type) queryParams.append('type', params.type);
        if (params.subType) queryParams.append('subType', params.subType);
        if (params.collection) queryParams.append('collection', params.collection);
        if (params.collections) queryParams.append('collections', params.collections);
        if (params.name) queryParams.append('name', params.name);
        if (params.tags) queryParams.append('tags', params.tags);
        if (params.creator) queryParams.append('creator', params.creator);
        if (params.hasUris !== undefined) queryParams.append('hasUris', params.hasUris.toString());
        if (params.includeFlagged !== undefined) queryParams.append('includeFlagged', params.includeFlagged.toString());
        if (params.withSupply !== undefined) queryParams.append('withSupply', params.withSupply.toString());
        if (params.source) queryParams.append('source', params.source);
        if (params.excludeMetaESDT !== undefined) queryParams.append('excludeMetaESDT', params.excludeMetaESDT.toString());
        if (params.isScam !== undefined) queryParams.append('isScam', params.isScam.toString());
        if (params.scamType) queryParams.append('scamType', params.scamType);
        if (params.timestamp !== undefined) queryParams.append('timestamp', params.timestamp.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_NFT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/nfts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<AccountNft[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map((nft) => {
                const filteredNft: Partial<AccountNft> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in nft) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredNft as any)[field] = nft[field as keyof AccountNft];
                    }
                });
                return filteredNft as AccountNft;
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
            `Failed to get account NFTs: ${errorMessage}`
        );
    }
}

export async function handleGetAccountNftsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        // Filter parameters
        if (params.identifiers) queryParams.append('identifiers', params.identifiers);
        if (params.search) queryParams.append('search', params.search);
        if (params.type) queryParams.append('type', params.type);
        if (params.subType) queryParams.append('subType', params.subType);
        if (params.collection) queryParams.append('collection', params.collection);
        if (params.collections) queryParams.append('collections', params.collections);
        if (params.name) queryParams.append('name', params.name);
        if (params.tags) queryParams.append('tags', params.tags);
        if (params.creator) queryParams.append('creator', params.creator);
        if (params.hasUris !== undefined) queryParams.append('hasUris', params.hasUris.toString());
        if (params.includeFlagged !== undefined) queryParams.append('includeFlagged', params.includeFlagged.toString());
        if (params.excludeMetaESDT !== undefined) queryParams.append('excludeMetaESDT', params.excludeMetaESDT.toString());
        if (params.isScam !== undefined) queryParams.append('isScam', params.isScam.toString());
        if (params.scamType) queryParams.append('scamType', params.scamType);
        if (params.timestamp !== undefined) queryParams.append('timestamp', params.timestamp.toString());

        const url = `/accounts/${params.address}/nfts/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get account NFTs count: ${errorMessage}`
        );
    }
}

export async function handleGetAccountNft(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }
        if (!params.nft) {
            throw new McpError(ErrorCode.InvalidParams, 'NFT identifier is required');
        }

        const queryParams = new URLSearchParams();

        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_NFT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        // Handle extract parameter
        if (params.extract) {
            queryParams.append('extract', params.extract);
        }

        // Handle timestamp parameter
        if (params.timestamp !== undefined) {
            queryParams.append('timestamp', params.timestamp.toString());
        }

        const url = `/accounts/${params.address}/nfts/${params.nft}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<AccountNft>(url);

        // If extract parameter is provided, return only that field
        if (params.extract && params.extract in response) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(response[params.extract as keyof AccountNft], null, 2)
                    }
                ]
            };
        }

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredNft: Partial<AccountNft> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredNft as any)[field] = response[field as keyof AccountNft];
                }
            });
            filteredResponse = filteredNft as AccountNft;
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
            `Failed to get account NFT details: ${errorMessage}`
        );
    }
}
