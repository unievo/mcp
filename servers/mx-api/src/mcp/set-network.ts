import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { setConfig, networkConfigs } from '../config.js';

/**
 * Tool definition for set_network
 */
export const setMxNetworkTool = {
    name: 'set_network',
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
 * Handle the set_network tool call
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
 * Handle network-related tool calls
 * @param toolName Name of the tool being called
 * @param args Tool arguments
 * @returns Response if tool is handled, undefined otherwise
 */
export async function handleSetNetworkToolCall(toolName: string, args: any): Promise<{ content: { type: string; text: string }[] } | undefined> {
    if (toolName === 'set_network') {
        return handleSetNetwork(args);
    }
    
    return undefined;
}
