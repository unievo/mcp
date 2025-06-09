import { ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export const SERVER_INFO_DESCRIPTION = 'Read the MultiversX API MCP info and usage guide.';

export const mxApiMcpUseGuide = `
## For all MultiversX API mcp servers (having "mx-api" in the name) follow these rules:
- Each mx-api mcp server has its own get-network and set-network tool. If the current network is not specified, confirm the correct network before continuing.
- Use the set-network tool on first use on each mx-api mcp server instance, or after resuming a task, to ensure the correct network is used. Use again on the same server instance only if a network change is needed.
- If no network is known or specified by the user, display options to choose from.
- By default, tools return a sub-set of most relevant fields. The "fields" parameter in tools can be used to explicitly specify which fields to retrieve, if required.
- Using "fields": ["all"] will return all fields, only use if explicitly required to get all fields, otherwise use the default set of fields, to avoid unnecessary data transfer and token usage.
- Some tools also have parameter names starting with "with{FieldName}" for getting additional field data. Specify them only if explicitly requested to get a specific "with" parameter.
- When specifying "with{FieldName}" parameters always use "fields": ["all"] in the request.
- For tool calls that return an array of items, if no count or size is explicitly specified, call the "{toolName}-count" version of the tool first (if available) to get the total number of items, and then proceed with a batch not greater than 5 items.
`

export const mxDataFormatGuide = `
## For formatting data coming from the MultiversX networks follow these guidelines:
- The available networks are: mainnet, testnet, devnet, vibechain (vibeox).
- The native token is EGLD for mainnet, xEGLD for testnet and devnet, and VIBE for vibechain.
- The native tokens have 18 decimals.

### Format all available data using the following rules:
- Format as bold numbered points for higher levels and nested indented bullet points for lower levels, separate top level by a new line.
- Format timestamps in standard UTC datetime only if timestamp > 0.
- Replace base64 encoded strings with their values decoded.
- For all image URLs always use exactly "[name](url)" not "![name](url)"
- Format text as embedded links to explorer for:
    - Accounts/contracts : {explorerUrl}/accounts/{address}
    - Transactions : {explorerUrl}/transactions/{txHash}
    - Tokens : {explorerUrl}/tokens/{identifier}
    - Collections : {explorerUrl}/collections/{collection}
    - NFTs : {explorerUrl}/nfts/{nftIdentifier}
    - Blocks : {explorerUrl}/blocks/{blockHash}
    - Validator Identities : {explorerUrl}/identities/{identity}
- {explorerUrl} is:
    - http://explorer.multiversx.com for mainnet
    - http://testnet-explorer.multiversx.com for testnet
    - http://devnet-explorer.multiversx.com for devnet
    - http://vibeox-explorer.multiversx.com for vibechain

### Formatting numerical values
- Format all amounts as denominated values (divide by decimals) without any rounding
- Use delimiters for numbers with more than 3 digits (e.g. 1,234.00)
- For values >= 1 display only the first 2 decimals (e.g. 11.00, 12.34)
- For values < 1 include 2 non-zero decimals (e.g. 0.12, 0.034, 0.0056)

### General formatting
- Response must not include "\`\`\`markdown'" and "\`\`\`" syntax in the output
`

export const SERVER_INFO_CONTENT = 
`${mxApiMcpUseGuide}
${mxDataFormatGuide}

- All mx-api servers share the same server info content, once you read one is enough for all servers.
- Don't redisplay this info unless asked, it's mainly for your reference.
- If no previous task given, stop and wait for further instructions.
`;

// Tool definition for server_info
export const serverInfoTool = {
    name: 'server-info',
    description: SERVER_INFO_DESCRIPTION,
    inputSchema: {
        type: 'object',
        properties: {},
    },
};

export async function handleServerInfoToolCall(toolName: string, args: any): Promise<{ content: { type: string; text: string }[] } | undefined> {
    if (toolName === 'server-info') {
        return handleServerInfoTool();
    }
    
    return undefined;
}

export async function handleServerInfoTool(): Promise<{ content: { type: string; text: string }[] }> {
    return {
        content: [
            {
                type: 'text',
                text: SERVER_INFO_CONTENT,
            },
        ],
    };
}

// Resource definition for server-info
export const serverInfoResource = {
    uri: 'server://info',
    name: 'Server info',
    mimeType: 'text/plain',
    description: SERVER_INFO_DESCRIPTION,
};

export function handleServerInfoResource(server: Server) {
    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        if (request.params.uri === 'server://info') {
            return {
                contents: [
                    {
                        uri: request.params.uri,
                        mimeType: 'text/plain',
                        text: SERVER_INFO_CONTENT,
                    },
                ],
            };
        }
        return {
            contents: [],
        };
    });
}
