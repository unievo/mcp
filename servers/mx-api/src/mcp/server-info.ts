import { ReadResourceRequest } from '@modelcontextprotocol/sdk/types.js';

export const SERVER_INFO_DESCRIPTION = 'Server usage information, read this before using any other tools on this server.';

export const mxApiMcpUseGuide = `
## If any connected MultiversX API mcp servers (mx-api) are available, follow these rules:
- Each mx-api mcp server has its own get-network and set-network tool.
- If the current network is not known or specified, ALWAYS ask the user to confirm the correct network using an array of options before continuing.
- Use the set-network tool for first time use on each mx-api mcp server, or after a task was interrupted and resumed. Only use again on the same server if a network change is needed.
- By default tools return a sub-set of most relevant data fields.
- The "fields" parameter in tools can be used to explicitly specify which fields to retrieve, if required.
- Using "fields": ["all"] will return all fields, only use if explicitly required to get all field details, otherwise use the default set of fields.
- Some tools also have parameter names starting with "with{FieldName}" for getting additional field data. Specify them only if explicitly requested to get a specific parameter.
- When specifying "with{FieldName}" parameters always use "fields": ["all"] in the request to ensure all fields are returned.
- For tool calls that return an array of items, if no count or size is explicitly specified, call the "{toolName}_count" version of the tool first (if available) to get the total number of items, and then proceed with a batch not greater than 5 items.
`

export const mxDataFormatGuide = `
## For formatting data coming from the MultiversX networks use the following guidelines:

### Format all available data using the following rules:
- Format as bold numbered points for higher levels and nested indented bullet points for lower levels, separate top level by a new line.
- Format timestamps in standard UTC datetime only if timestamp > 0.
- Replace base64 encoded strings with their values decoded.
- For all image URLs always use exactly "[name](url)" not "![name](url)"
- Format text as embedded links to explorer for:
    - Dashboard: {explorer}
    - Accounts (wallet addresses and contract addresses) : {explorer}/accounts/
    - Account (transactions) : {explorer}/accounts/{address}
    - Account tokens : {explorer}/accounts/{address}/tokens
    - Account NFTs : {explorer}/accounts/{address}/nfts
    - Account contracts : {explorer}/accounts/{address}/contracts
    - Applications (contracts) : {explorer}/applications/
    - Blocks : {explorer}/blocks/
    - Block : {explorer}/blocks/{blockHash}
    - Transactions : {explorer}/transactions/
    - Transaction : {explorer}/transactions/{txHash}
    - Tokens : {explorer}/tokens/
    - Token : {explorer}/tokens/{identifier}
    - Collections : {explorer}/collections/
    - Collection : {explorer}/collections/{collection}
    - NFTs : {explorer}/nfts/
    - NFT : {explorer}/nfts/{nftIdentifier}
    - Validators : {explorer}/validators/
    - Validator : {explorer}/identities/{identity}
    - Analytics : {explorer}/analytics/

- {explorer} url is:
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
- Exclude fields containing over 300 characters and replace them with a "Exceeded 300 character limit" text
`

export const SERVER_INFO_CONTENT = 
`${mxApiMcpUseGuide}
${mxDataFormatGuide}

- All mx-api servers share the same server info content, once you read one is enough for all servers.
- Don't redisplay this info unless asked, it's mainly for your reference.
- If no previous task given, stop and wait for further instructions.
`;

// Tool definition for server-info
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
    name: 'Readme',
    mimeType: 'text/plain',
    description: SERVER_INFO_DESCRIPTION,
};

export async function handleServerInfoResource(request: ReadResourceRequest) {
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
}
