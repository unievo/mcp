import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../api-client.js';

// Default fields configuration
const DEFAULT_ACCOUNT_FIELDS = ['address', 'balance', 'nonce','shard'];
const DEFAULT_ACCOUNT_DETAILS_FIELDS = ['address', 'balance', 'nonce', 'shard', 'timestamp', 'txCount', 'scrCount'];

interface ScamInfo {
    type: string;
    info: string;
}

interface AccountAssets {
    name?: string;
    description?: string;
    tags?: string[];
    website?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
    ledgerSignature?: string;
    lockedAccounts?: string;
    extraTokens?: string[];
    social?: {
        email?: string;
        blog?: string;
        twitter?: string;
        whitepaper?: string;
        coinmarketcap?: string;
        coingecko?: string;
    };
}

interface Account {
    // Required fields according to schema
    address: string;
    balance: string;
    nonce: number;
    timestamp: number;
    shard: number;
    txCount: number;
    scrCount: number;
    
    // Optional fields
    ownerAddress?: string;
    assets?: AccountAssets;
    deployedAt?: number;
    deployTxHash?: string;
    ownerAssets?: AccountAssets;
    isVerified?: boolean;
    transfersLast24h?: number;
    isSmartContract?: boolean;
}

interface AccountDetailed extends Account {
    // Required fields according to schema
    rootHash: string;
    developerReward: string;
    
    // Optional fields
    code?: string;
    codeHash?: string;
    username?: string;
    isUpgradeable?: boolean;
    isReadable?: boolean;
    isPayable?: boolean;
    isPayableBySmartContract?: boolean;
    scamInfo?: ScamInfo;
    nftCollections?: boolean;
    nfts?: boolean;
    activeGuardianActivationEpoch?: number;
    activeGuardianAddress?: string;
    activeGuardianServiceUid?: string;
    pendingGuardianActivationEpoch?: number;
    pendingGuardianAddress?: string;
    pendingGuardianServiceUid?: string;
    isGuarded?: boolean;
}

interface AccountsResponse {
    accounts: Account[];
}

interface AccountsCountResponse {
    count: number;
}

export const accountsTools = [
    {
        name: 'get_accounts',
        description: 'Returns all accounts available on blockchain. By default it returns 25 accounts',
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
                ownerAddress: {
                    type: 'string',
                    description: 'Search by owner address'
                },
                name: {
                    type: 'string',
                    description: 'Filter accounts by assets name'
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filter accounts by assets tags'
                },
                sort: {
                    type: 'string',
                    enum: ['balance', 'timestamp', 'transfersLast24h'],
                    description: 'Sort criteria'
                },
                order: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: 'Sort order'
                },
                isSmartContract: {
                    type: 'boolean',
                    description: 'Filter accounts by whether they are smart contract or not'
                },
                withOwnerAssets: {
                    type: 'boolean',
                    description: 'Return a list accounts with owner assets'
                },
                withDeployInfo: {
                    type: 'boolean',
                    description: 'Include deployedAt and deployTxHash fields in the result'
                },
                withTxCount: {
                    type: 'boolean',
                    description: 'Include txCount field in the result'
                },
                withScrCount: {
                    type: 'boolean',
                    description: 'Include scrCount field in the result'
                },
                excludeTags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Exclude specific tags from result'
                },
                hasAssets: {
                    type: 'boolean',
                    description: 'Returns a list of accounts that have assets'
                },
                search: {
                    type: 'string',
                    description: 'Search by account address'
                },
                addresses: {
                    type: 'string',
                    description: 'A comma-separated list of addresses to filter by'
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
        name: 'get_accounts_count',
        description: 'Returns total number of accounts available on blockchain',
        inputSchema: {
            type: 'object',
            properties: {
                ownerAddress: {
                    type: 'string',
                    description: 'Search by owner address'
                },
                isSmartContract: {
                    type: 'boolean',
                    description: 'Return total smart contracts count'
                },
                name: {
                    type: 'string',
                    description: 'Filter accounts by assets name'
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filter accounts by assets tags'
                },
                excludeTags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Exclude specific tags from result'
                },
                hasAssets: {
                    type: 'boolean',
                    description: 'Returns a list of accounts that have assets'
                },
                search: {
                    type: 'string',
                    description: 'Search by account address, assets name'
                }
            }
        }
    },
    {
        name: 'get_account_details',
        description: 'Returns account details for a given address',
        inputSchema: {
            type: 'object',
            properties: {
                address: {
                    type: 'string',
                    description: 'Account address'
                },
                withGuardianInfo: {
                    type: 'boolean',
                    description: 'Returns guardian data for a given address'
                },
                withTxCount: {
                    type: 'boolean',
                    description: 'Returns the count of the transactions for a given address'
                },
                withScrCount: {
                    type: 'boolean',
                    description: 'Returns the sc results count for a given address'
                },
                withTimestamp: {
                    type: 'boolean',
                    description: 'Returns the timestamp of the last activity for a given address'
                },
                withAssets: {
                    type: 'boolean',
                    description: 'Returns the assets for a given address'
                },
                timestamp: {
                    type: 'number',
                    description: 'Retrieve entry from timestamp'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['address']
        }
    }
];

export async function handleGetAccounts(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.from !== undefined) queryParams.append('from', params.from.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.ownerAddress) queryParams.append('ownerAddress', params.ownerAddress);
        if (params.name) queryParams.append('name', params.name);
        if (params.tags) queryParams.append('tags', params.tags.join(','));
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.order) queryParams.append('order', params.order);
        if (params.isSmartContract !== undefined) queryParams.append('isSmartContract', params.isSmartContract.toString());
        if (params.withOwnerAssets !== undefined) queryParams.append('withOwnerAssets', params.withOwnerAssets.toString());
        if (params.withDeployInfo !== undefined) queryParams.append('withDeployInfo', params.withDeployInfo.toString());
        if (params.withTxCount !== undefined) queryParams.append('withTxCount', params.withTxCount.toString());
        if (params.withScrCount !== undefined) queryParams.append('withScrCount', params.withScrCount.toString());
        if (params.excludeTags) queryParams.append('excludeTags', params.excludeTags.join(','));
        if (params.hasAssets !== undefined) queryParams.append('hasAssets', params.hasAssets.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.addresses) queryParams.append('addresses', params.addresses);
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_ACCOUNT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<AccountsResponse>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = response;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all') && response.accounts) {
            filteredResponse = {
                ...response,
                accounts: response.accounts.map(account => {
                    const filteredAccount: Partial<Account> = {};
                    fieldsToRetrieve.forEach((field: string) => {
                        if (field in account) {
                            // Type assertion to ensure TypeScript knows we're accessing a valid key
                            (filteredAccount as any)[field] = account[field as keyof Account];
                        }
                    });
                    return filteredAccount as Account;
                })
            };
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
            `Failed to get accounts: ${errorMessage}`
        );
    }
}

export async function handleGetAccountsCount(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        // Add parameters to query string
        if (params?.ownerAddress) queryParams.append('ownerAddress', params.ownerAddress);
        if (params?.isSmartContract !== undefined) queryParams.append('isSmartContract', params.isSmartContract.toString());
        if (params?.name) queryParams.append('name', params.name);
        if (params?.tags) queryParams.append('tags', params.tags.join(','));
        if (params?.excludeTags) queryParams.append('excludeTags', params.excludeTags.join(','));
        if (params?.hasAssets !== undefined) queryParams.append('hasAssets', params.hasAssets.toString());
        if (params?.search) queryParams.append('search', params.search);

        const url = `/accounts/count${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<AccountsCountResponse>(url);
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
            `Failed to get accounts count: ${errorMessage}`
        );
    }
}

export async function handleGetAccountDetails(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.address) {
            throw new McpError(ErrorCode.InvalidParams, 'Address is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.withGuardianInfo !== undefined) queryParams.append('withGuardianInfo', params.withGuardianInfo.toString());
        if (params.withTxCount !== undefined) queryParams.append('withTxCount', params.withTxCount.toString());
        if (params.withScrCount !== undefined) queryParams.append('withScrCount', params.withScrCount.toString());
        if (params.withTimestamp !== undefined) queryParams.append('withTimestamp', params.withTimestamp.toString());
        if (params.withAssets !== undefined) queryParams.append('withAssets', params.withAssets.toString());
        if (params.timestamp !== undefined) queryParams.append('timestamp', params.timestamp.toString());

        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_ACCOUNT_DETAILS_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/accounts/${params.address}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await mxApiClient.get<AccountDetailed>(url);

        // Always remove the "code" field from the response (in case of smart contract full details)
        const { code, ...responseWithoutCode } = response;

        // If specific fields were requested, filter the response
        let filteredResponse = responseWithoutCode;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredAccount: Partial<AccountDetailed> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in responseWithoutCode) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredAccount as any)[field] = responseWithoutCode[field as keyof typeof responseWithoutCode];
                }
            });
            filteredResponse = filteredAccount as AccountDetailed;
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
            `Failed to get account details: ${errorMessage}`
        );
    }
}
