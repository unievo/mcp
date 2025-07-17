export const networkConfigs = {
    devnet: {
        apiUrl: process.env.DEVNET_API_URL || 'https://devnet-api.multiversx.com',
        apiKey: process.env.DEVNET_API_KEY,
        apiKeyHeader: process.env.DEVNET_API_KEY_HEADER,
    },
    testnet: {
        apiUrl: process.env.TESTNET_API_URL || 'https://testnet-api.multiversx.com',
        apiKey: process.env.TESTNET_API_KEY,
        apiKeyHeader: process.env.TESTNET_API_KEY_HEADER,
    },
    mainnet: {
        apiUrl: process.env.MAINNET_API_URL || 'https://api.multiversx.com',
        apiKey: process.env.MAINNET_API_KEY,
        apiKeyHeader: process.env.MAINNET_API_KEY_HEADER,
    },
    vibeox: {
        apiUrl: process.env.VIBEOX_API_URL || 'https://vibeox-api.multiversx.com',
        apiKey: process.env.VIBEOX_API_KEY,
        apiKeyHeader: process.env.VIBEOX_API_KEY_HEADER,
    },
    custom: {
        apiUrl: process.env.CUSTOM_API_URL || 'SET_CUSTOM_API_URL_IN_ENV',
        apiKey: process.env.CUSTOM_API_KEY,
        apiKeyHeader: process.env.CUSTOM_API_KEY_HEADER,
    },
} as const;

export const defaultNetwork: keyof typeof networkConfigs = 
    (process.env.DEFAULT_NETWORK || 'devnet') as keyof typeof networkConfigs;

export type NetworkConfig = {
    network: keyof typeof networkConfigs;
    apiUrl: string;
    apiKey?: string;
    apiKeyHeader?: string;
};

export const defaultConfig: NetworkConfig = {
    network: defaultNetwork,
    apiUrl: networkConfigs[defaultNetwork].apiUrl,
    apiKey: process.env.API_KEY,
    apiKeyHeader: process.env.API_KEY_HEADER,
};

let currentConfig: NetworkConfig = { ...defaultConfig };

export function setConfig(config: Partial<NetworkConfig>) {
    if (config.network) {
        const networkConfig = networkConfigs[config.network];
        currentConfig = {
            ...currentConfig,
            network: config.network,
            apiUrl: networkConfig.apiUrl
        };
    } else if (config.apiUrl) {
        currentConfig = {
            ...currentConfig,
            apiUrl: config.apiUrl
        };
    }
}

export function getConfig(): NetworkConfig {
    return currentConfig;
}
