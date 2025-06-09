export const networkConfigs = {
    devnet: {
        apiUrl: 'https://devnet-api.multiversx.com',
    },
    testnet: {
        apiUrl: 'https://testnet-api.multiversx.com',
    },
    mainnet: {
        apiUrl: 'https://api.multiversx.com',
    },
    vibeox: {
        apiUrl: 'https://vibeox-api.multiversx.com',
    },
} as const;

export const defaultNetwork: keyof typeof networkConfigs = 
    (process.env.DEFAULT_NETWORK || 'devnet') as keyof typeof networkConfigs;

export type NetworkConfig = {
    network: keyof typeof networkConfigs;
    apiUrl: string;
};

export const defaultConfig: NetworkConfig = {
    network: defaultNetwork,
    apiUrl: networkConfigs[defaultNetwork].apiUrl
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
