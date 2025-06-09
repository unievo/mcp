import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { setConfig, networkConfigs } from '../config.js';
import { handleGetAbout } from './server/tools/network.js';

/**
 * Tool definition for get-network
 */
export const getNetworkTool = {
    name: 'get-network',
    description: 'Get the current MultiversX network configuration',
    inputSchema: {
        type: 'object',
        properties: {},
        required: [],
    },
};

/**
 * Tool definition for set-network
 */
export const setNetworkTool = {
    name: 'set-network',
    description: `Set the MultiversX network (${Object.keys(networkConfigs).join('/')})`,
    inputSchema: {
        type: 'object',
        properties: {
            network: {
                type: 'string',
                enum: Object.keys(networkConfigs),
                description: 'Network type',
            },
        },
        required: ['network'],
    },
};

/**
 * Handle the set-network tool call
 * @param args Tool arguments
 * @returns Response with confirmation message
 */
export async function handleSetNetwork(args: any): Promise<{ content: { type: string; text: string }[] }> {
    if (!args?.network || !Object.keys(networkConfigs).includes(args.network)) {
        throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid network. Must be one of: ${Object.keys(networkConfigs).join(', ')}`
        );
    }

    const network = args.network as keyof typeof networkConfigs;
    setConfig({ network });

    return {
        content: [
            {
                type: 'text',
                text: `Network set to ${args.network}`,
            },
        ],
    };
}

/**
* Handle the get-network tool call
 * @returns Response with current network information
 */
export async function handleGetNetwork(): Promise<{ content: { type: string; text: string }[] }> {
    // Call handleGetAbout with only the 'network' field
    return handleGetAbout({ fields: ['network'] });
}

/**
 * Handle network-related tool calls
 * @param toolName Name of the tool being called
 * @param args Tool arguments
 * @returns Response if tool is handled, undefined otherwise
 */
export async function handleNetworkConfigToolCall(toolName: string, args: any): Promise<{ content: { type: string; text: string }[] } | undefined> {
    if (toolName === 'get-network') {
        return handleGetNetwork();
    }
    
    if (toolName === 'set-network') {
        return handleSetNetwork(args);
    }
    
    return undefined;
}
