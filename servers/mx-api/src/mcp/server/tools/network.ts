import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { mxApiClient } from '../../api-client.js';

// Default fields configuration
const DEFAULT_NETWORK_CONSTANTS_FIELDS = ['all'];
const DEFAULT_NETWORK_ECONOMICS_FIELDS = ['all'];
const DEFAULT_NETWORK_STATS_FIELDS = ['all'];
const DEFAULT_ABOUT_FIELDS = ['all'];
const DEFAULT_DAPP_CONFIG_FIELDS = ['all'];
const DEFAULT_USERNAME_DETAILS_FIELDS = ['all'];

interface NetworkConstants {
    chainId: string;
    gasPerDataByte: number;
    minGasLimit: number;
    minGasPrice: number;
    minTransactionVersion: number;
}

interface NetworkEconomics {
    totalSupply: number;
    circulatingSupply: number;
    staked: number;
    price: number;
    marketCap: number;
    apr: number;
    topUpApr: number;
    baseApr: number;
    tokenMarketCap: number | null;
}

interface NetworkStats {
    accounts: number;
    blocks: number;
    epoch: number;
    refreshRate: number;
    roundsPassed: number;
    roundsPerEpoch: number;
    shards: number;
    transactions: number;
    scResults: number;
}

interface FeatureConfigs {
    updateCollectionExtraDetails: boolean;
    marketplace: boolean;
    exchange: boolean;
    dataApi: boolean;
}

interface About {
    appVersion: string | null;
    pluginsVersion?: string | null;
    network: string;
    cluster: string;
    version: string;
    indexerVersion: string;
    gatewayVersion: string;
    scamEngineVersion?: string | null;
    features: FeatureConfigs | null;
}

interface DappConfig {
    id: string;
    name: string;
    egldLabel: string;
    decimals: string;
    egldDenomination: string;
    gasPerDataByte: string;
    apiTimeout: string;
    walletConnectDeepLink: string;
    walletConnectBridgeAddresses: string[];
    walletAddress: string;
    apiAddress: string;
    explorerAddress: string;
    chainId: string;
}

interface WebsocketConfig {
    url: string;
}

interface Amount {
    // Empty object as per the schema
}

interface AccountUsername {
    address: string;
    nonce: number | null;
    balance: string;
    rootHash: string;
    txCount: number | null;
    scrCount: number | null;
    username: string;
    shard: number | null;
    developerReward: string;
}

export const networkTools = [
    {
        name: 'get-network-constants',
        description: 'Returns network-specific constants that can be used to automatically configure dapps',
        inputSchema: {
            type: 'object',
            properties: {
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
        },
    },
    {
        name: 'get-network-economics',
        description: 'Returns economics information',
        inputSchema: {
            type: 'object',
            properties: {
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
        },
    },
    {
        name: 'get-network-stats',
        description: 'Returns network statistics',
        inputSchema: {
            type: 'object',
            properties: {
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
        },
    },
    {
        name: 'get-about',
        description: 'Returns information about network and API',
        inputSchema: {
            type: 'object',
            properties: {
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
        },
    },
    {
        name: 'get-dapp-config',
        description: 'Returns configuration used in dapps',
        inputSchema: {
            type: 'object',
            properties: {
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
        },
    },
    {
        name: 'get-websocket-config',
        description: 'Returns config used for accessing websocket on the same cluster',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'get-username-details',
        description: 'Returns account details for a given username',
        inputSchema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    description: 'The username to get details for'
                },
                withGuardianInfo: {
                    type: 'boolean',
                    description: 'Include guardian information'
                },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Fields to retrieve. Use "all" for all.'
                }
            },
            required: ['username']
        },
    },
];

export async function handleGetNetworkConstants(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params?.fields || DEFAULT_NETWORK_CONSTANTS_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/constants${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const constants = await mxApiClient.get<NetworkConstants>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = constants;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredConstants: Partial<NetworkConstants> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in constants) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredConstants as any)[field] = constants[field as keyof NetworkConstants];
                }
            });
            filteredResponse = filteredConstants as NetworkConstants;
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(filteredResponse, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get network constants: ${errorMessage}`
        );
    }
}

export async function handleGetNetworkEconomics(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params?.fields || DEFAULT_NETWORK_ECONOMICS_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/economics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const economics = await mxApiClient.get<NetworkEconomics>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = economics;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredEconomics: Partial<NetworkEconomics> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in economics) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredEconomics as any)[field] = economics[field as keyof NetworkEconomics];
                }
            });
            filteredResponse = filteredEconomics as NetworkEconomics;
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(filteredResponse, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get network economics: ${errorMessage}`
        );
    }
}

export async function handleGetNetworkStats(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params?.fields || DEFAULT_NETWORK_STATS_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const stats = await mxApiClient.get<NetworkStats>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = stats;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredStats: Partial<NetworkStats> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in stats) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredStats as any)[field] = stats[field as keyof NetworkStats];
                }
            });
            filteredResponse = filteredStats as NetworkStats;
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(filteredResponse, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get network stats: ${errorMessage}`
        );
    }
}

export async function handleGetAbout(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params?.fields || DEFAULT_ABOUT_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/about${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const about = await mxApiClient.get<About>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = about;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredAbout: Partial<About> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in about) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredAbout as any)[field] = about[field as keyof About];
                }
            });
            filteredResponse = filteredAbout as About;
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(filteredResponse, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get about information: ${errorMessage}`
        );
    }
}

export async function handleGetDappConfig(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const queryParams = new URLSearchParams();
        
        // Handle fields parameter
        const fieldsToRetrieve = params?.fields || DEFAULT_DAPP_CONFIG_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/dapp/config${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const dappConfig = await mxApiClient.get<DappConfig>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = dappConfig;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredDappConfig: Partial<DappConfig> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in dappConfig) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredDappConfig as any)[field] = dappConfig[field as keyof DappConfig];
                }
            });
            filteredResponse = filteredDappConfig as DappConfig;
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(filteredResponse, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get dapp config: ${errorMessage}`
        );
    }
}

export async function handleGetWebsocketConfig(): Promise<{ content: { type: string; text: string }[] }> {
    try {
        const websocketConfig = await mxApiClient.get<WebsocketConfig>('/websocket/config');
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(websocketConfig, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get websocket config: ${errorMessage}`
        );
    }
}

export async function handleGetUsernameDetails(params: any): Promise<{ content: { type: string; text: string }[] }> {
    try {
        if (!params.username) {
            throw new McpError(ErrorCode.InvalidParams, 'Username is required');
        }

        const queryParams = new URLSearchParams();
        
        if (params.withGuardianInfo !== undefined) queryParams.append('withGuardianInfo', params.withGuardianInfo.toString());
        
        // Handle fields parameter
        const fieldsToRetrieve = params.fields || DEFAULT_USERNAME_DETAILS_FIELDS;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            queryParams.append('fields', fieldsToRetrieve.join(','));
        }

        const url = `/usernames/${params.username}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const usernameDetails = await mxApiClient.get<AccountUsername>(url);

        // If specific fields were requested, filter the response
        let filteredResponse = usernameDetails;
        if (fieldsToRetrieve.length > 0 && !fieldsToRetrieve.includes('all')) {
            const filteredUsernameDetails: Partial<AccountUsername> = {};
            fieldsToRetrieve.forEach((field: string) => {
                if (field in usernameDetails) {
                    // Type assertion to ensure TypeScript knows we're accessing a valid key
                    (filteredUsernameDetails as any)[field] = usernameDetails[field as keyof AccountUsername];
                }
            });
            filteredResponse = filteredUsernameDetails as AccountUsername;
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(filteredResponse, null, 2),
                },
            ],
        };
    } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        throw new McpError(
            ErrorCode.InternalError,
            `Failed to get username details: ${errorMessage}`
        );
    }
}
