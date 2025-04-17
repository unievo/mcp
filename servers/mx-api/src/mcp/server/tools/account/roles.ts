import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../../api-client.js';

// Default fields configuration
const DEFAULT_COLLECTION_ROLE_FIELDS = ['collection', 'type', 'subType', 'name', 'ticker', 'owner', 'timestamp', 'canCreate', 'canBurn', 'canAddQuantity', 'canUpdateAttributes', 'canAddUri', 'canTransferRole', 'canFreeze', 'canWipe', 'canPause', 'canTransferNftCreateRole', 'canChangeOwner', 'canUpgrade', 'canAddSpecialRoles', 'decimals'];
const DEFAULT_TOKEN_ROLE_FIELDS = ['identifier', 'name', 'owner', 'type', 'subType', 'ticker', 'timestamp', 'decimals', 'isPaused', 'canUpgrade', 'canMint', 'canBurn', 'canChangeOwner', 'canPause', 'canFreeze', 'canWipe', 'canAddSpecialRoles', 'canTransferNftCreateRole', 'canCreateMultiShard'];

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

interface CollectionRole {
    collection: string;
    type: string;
    subType?: string;
    name: string;
    ticker: string;
    owner: string;
    timestamp: number;
    canFreeze: boolean;
    canWipe: boolean;
    canPause: boolean;
    canTransferNftCreateRole: boolean;
    canChangeOwner: boolean;
    canUpgrade: boolean;
    canAddSpecialRoles: boolean;
    decimals?: number;
    assets?: TokenAssets;
    scamInfo?: ScamInfo;
    canCreate: boolean;
    canBurn: boolean;
    canAddQuantity: boolean;
    canUpdateAttributes: boolean;
    canAddUri: boolean;
    canTransferRole?: boolean;
    roles: string[];
}

interface TokenRole {
    identifier: string;
    name: string;
    owner: string;
    type: string;
    subType?: string;
    ticker?: string;
    timestamp: number;
    decimals: number;
    isPaused: boolean;
    canUpgrade: boolean;
    canMint: boolean;
    canBurn: boolean;
    canChangeOwner: boolean;
    canPause: boolean;
    canFreeze: boolean;
    canWipe: boolean;
    canAddSpecialRoles: boolean;
    canTransferNftCreateRole: boolean;
    canCreateMultiShard: boolean;
    assets?: TokenAssets;
    scamInfo?: ScamInfo;
    roles: string[];
}

export const accountRolesTools = [
    {
        name: 'get_account_collections_with_roles',
        description: 'Returns NFT/SFT/MetaESDT collections where the account is owner or has some special roles assigned to it',
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
        name: 'get_collections_with_roles_count',
        description: 'Returns the total number of NFT/SFT/MetaESDT collections where the account is owner or has some special roles assigned to it',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                search: {
                    type: 'string',
                    description: 'Search query'
                },
                type: {
                    type: 'string',
                    description: 'Collection type'
                },
                subType: {
                    type: 'string',
                    description: 'Collection sub-type'
                },
                owner: {
                    type: 'string',
                    description: 'Collection owner'
                },
                canCreate: {
                    type: 'boolean',
                    description: 'Can create'
                },
                canBurn: {
                    type: 'boolean',
                    description: 'Can burn'
                },
                canAddQuantity: {
                    type: 'boolean',
                    description: 'Can add quantity'
                },
                canUpdateAttributes: {
                    type: 'boolean',
                    description: 'Can update attributes'
                },
                canAddUri: {
                    type: 'boolean',
                    description: 'Can add URI'
                },
                canTransferRole: {
                    type: 'boolean',
                    description: 'Can transfer role'
                },
                excludeMetaESDT: {
                    type: 'boolean',
                    description: 'Exclude MetaESDT'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'get_account_collection_with_roles',
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
    },
    {
        name: 'get_account_tokens_with_roles',
        description: 'Returns fungible token roles where the account is owner or has some special roles assigned to it',
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
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                },
                search: {
                    type: 'string',
                    description: 'Search query'
                },
                owner: {
                    type: 'string',
                    description: 'Token owner'
                },
                canMint: {
                    type: 'boolean',
                    description: 'Can mint'
                },
                canBurn: {
                    type: 'boolean',
                    description: 'Can burn'
                },
                includeMetaESDT: {
                    type: 'boolean',
                    description: 'Include MetaESDT'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'get_tokens_with_roles_count',
        description: 'Returns the total number of fungible token roles where the account is owner or has some special roles assigned to it',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                search: {
                    type: 'string',
                    description: 'Search query'
                },
                owner: {
                    type: 'string',
                    description: 'Token owner'
                },
                canMint: {
                    type: 'boolean',
                    description: 'Can mint'
                },
                canBurn: {
                    type: 'boolean',
                    description: 'Can burn'
                },
                includeMetaESDT: {
                    type: 'boolean',
                    description: 'Include MetaESDT'
                }
            },
            required: ['address']
        }
    },
    {
        name: 'get_token_with_roles',
        description: 'Returns details about fungible token roles where the account is owner or has some special roles assigned to it',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
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
            required: ['address', 'identifier']
        }
    }
];

export async function handleGetAccountCollectionsWithRoles(params: any): Promise<{ content: { type: string; text: string }[] }> {
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
        if (params.type) queryParams.append('type', params.type);
        if (params.subType) queryParams.append('subType', params.subType);
        if (params.owner) queryParams.append('owner', params.owner);
        if (params.canCreate !== undefined) queryParams.append('canCreate', params.canCreate.toString());
        if (params.canBurn !== undefined) queryParams.append('canBurn', params.canBurn.toString());
        if (params.canAddQuantity !== undefined) queryParams.append('canAddQuantity', params.canAddQuantity.toString());
        if (params.canUpdateAttributes !== undefined) queryParams.append('canUpdateAttributes', params.canUpdateAttributes.toString());
        if (params.canAddUri !== undefined) queryParams.append('canAddUri', params.canAddUri.toString());
        if (params.canTransferRole !== undefined) queryParams.append('canTransferRole', params.canTransferRole.toString());
        if (params.excludeMetaESDT !== undefined) queryParams.append('excludeMetaESDT', params.excludeMetaESDT.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_COLLECTION_ROLE_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/roles/collections${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<CollectionRole[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(collection => {
                const filteredCollection: Partial<CollectionRole> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in collection) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredCollection as any)[field] = collection[field as keyof CollectionRole];
                    }
                });
                return filteredCollection as CollectionRole;
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
            `Failed to get account collections with roles: ${errorMessage}`
        );
    }
}

export async function handleGetCollectionsWithRolesCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        // Filter parameters
        if (params.search) queryParams.append('search', params.search);
        if (params.type) queryParams.append('type', params.type);
        if (params.subType) queryParams.append('subType', params.subType);
        if (params.owner) queryParams.append('owner', params.owner);
        if (params.canCreate !== undefined) queryParams.append('canCreate', params.canCreate.toString());
        if (params.canBurn !== undefined) queryParams.append('canBurn', params.canBurn.toString());
        if (params.canAddQuantity !== undefined) queryParams.append('canAddQuantity', params.canAddQuantity.toString());
        if (params.canUpdateAttributes !== undefined) queryParams.append('canUpdateAttributes', params.canUpdateAttributes.toString());
        if (params.canAddUri !== undefined) queryParams.append('canAddUri', params.canAddUri.toString());
        if (params.canTransferRole !== undefined) queryParams.append('canTransferRole', params.canTransferRole.toString());
        if (params.excludeMetaESDT !== undefined) queryParams.append('excludeMetaESDT', params.excludeMetaESDT.toString());

        const url = `/accounts/${params.address}/roles/collections/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get collections with roles count: ${errorMessage}`
        );
    }
}

export async function handleGetAccountCollectionWithRoles(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }
        if (!params.collection) {
            throw new McpError(ErrorCode.InvalidParams, 'Collection identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_COLLECTION_ROLE_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/roles/collections/${params.collection}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<CollectionRole>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredCollection: Partial<CollectionRole> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredCollection as any)[field] = response[field as keyof CollectionRole];
                }
            });
            filteredResponse = filteredCollection as CollectionRole;
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
            `Failed to get account collection with roles: ${errorMessage}`
        );
    }
}

export async function handleGetAccountTokensWithRoles(params: any): Promise<{ content: { type: string; text: string }[] }> {
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
        if (params.owner) queryParams.append('owner', params.owner);
        if (params.canMint !== undefined) queryParams.append('canMint', params.canMint.toString());
        if (params.canBurn !== undefined) queryParams.append('canBurn', params.canBurn.toString());
        if (params.includeMetaESDT !== undefined) queryParams.append('includeMetaESDT', params.includeMetaESDT.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TOKEN_ROLE_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/roles/tokens${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<TokenRole[]>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            filteredResponse = response.map(token => {
                const filteredToken: Partial<TokenRole> = {};
                fieldsToRetrieve.forEach((field: string) => {
                    if (field in token) {
                        // Type assertion to ensure TypeScript knows we're accessing a valid key
                        (filteredToken as any)[field] = token[field as keyof TokenRole];
                    }
                });
                return filteredToken as TokenRole;
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
            `Failed to get account tokens with roles: ${errorMessage}`
        );
    }
}

export async function handleGetTokensWithRolesCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        // Filter parameters
        if (params.search) queryParams.append('search', params.search);
        if (params.owner) queryParams.append('owner', params.owner);
        if (params.canMint !== undefined) queryParams.append('canMint', params.canMint.toString());
        if (params.canBurn !== undefined) queryParams.append('canBurn', params.canBurn.toString());
        if (params.includeMetaESDT !== undefined) queryParams.append('includeMetaESDT', params.includeMetaESDT.toString());

        const url = `/accounts/${params.address}/roles/tokens/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
            `Failed to get tokens with roles count: ${errorMessage}`
        );
    }
}

export async function handleGetTokenWithRoles(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }
        if (!params.identifier) {
            throw new McpError(ErrorCode.InvalidParams, 'Token identifier is required');
        }

        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_TOKEN_ROLE_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}/roles/tokens/${params.identifier}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<TokenRole>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredToken: Partial<TokenRole> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in response) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredToken as any)[field] = response[field as keyof TokenRole];
                }
            });
            filteredResponse = filteredToken as TokenRole;
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
            `Failed to get token with roles: ${errorMessage}`
        );
    }
}
