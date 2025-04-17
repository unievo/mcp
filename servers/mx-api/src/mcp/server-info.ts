import { ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export const SERVER_INFO_DESCRIPTION = 'MultiversX API MCP servers info.';

export const SERVER_INFO_CONTENT = `## For all the mx-api mcp servers use the following rules:
- VERY IMPORTANT: Each mx-api-* server has its own set_network tool. Call the tool to set the correct network the first time you use a new mcp server. Only set again if you need to change the network.
- If no network is specified display options to choose from.
- By default, tools return a sub-set of most relevant fields.
- The "fields" parameter in tools can be used to explicitly specify which fields to retrieve, if required.
- Using "fields": ["all"] will return all fields, only use if explicitly required to get all field details, otherwise use the default set of fields.
- Some tools also have parameter names starting with "with{FieldName}" for getting additional field data. Specify them only if explicitly requested to get that filed data.
- When specifying "with{FieldName}" parameters always use "fields": ["all"] in the request.
- For tool calls that return an array of items, if no count or size is explicitly specified, call the "{toolName}_count" version of the tool first (if available) to get the total number of items, and then proceed with a batch not greater than 5 items.

## For displaying data from the MultiversX networks use the following rules:
- After a tool response, display a formatted summary of relevant data with nested bullet points and bold text for higher order bullets. 
- Do not include fields containing over 100 characters.
- Display timestamps in standard UTC datetime, only if value > 0.
- When displaying token quantities (amounts, balances, minted, burned, etc) show the denominated values based on token decimals without any rounding. 
- For values >= 1 show only 2 decimals, for values < 1 display decimals until two are not zero.
- Use delimiters for numbers with more than 3 digits.
- Replace base64 encoded strings with their values decoded.
- Format all output text as clickable links to explorer for:
    - Accounts/contracts : {explorerUrl}/accounts/{address}
    - Transactions : {explorerUrl}/transactions/{txHash}
    - Tokens : {explorerUrl}/tokens/{identifier}
    - Collections : {explorerUrl}/collections/{collection}
    - NFTs : {explorerUrl}/nfts/{nftIdentifier}
    - Blocks : {explorerUrl}/blocks/{blockHash}
    - Validators : {explorerUrl}/identities/{identity}
- {explorerUrl} is:
    - http://explorer.multiversx.com for mainnet, native token is EGLD (18 decimals)
    - http://testnet-explorer.multiversx.com for testnet, native token is xEGLD (18 decimals)
    - http://devnet-explorer.multiversx.com for devnet, native token is xEGLD (18 decimals)
- All mx-api servers share the same server_info content, once you read it is enough for all servers.

- Don't redisplay this info unless asked, it's mainly for your reference.
- If no previous task given, stop and wait for further instructions.
`;

// Tool definition for server_info
export const serverInfoTool = {
    name: 'server_info',
    description: SERVER_INFO_DESCRIPTION,
    inputSchema: {
        type: 'object',
        properties: {},
    },
};

export async function handleServerInfoToolCall(toolName: string, args: any): Promise<{ content: { type: string; text: string }[] } | undefined> {
    if (toolName === 'server_info') {
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

// Resource definition for server_info
// export const serverInfoResource = {
//     uri: 'server://info',
//     name: 'Server info',
//     mimeType: 'text/plain',
//     description: SERVER_INFO_DESCRIPTION,
// };

// export function handleServerInfoResource(server: Server) {
//     server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
//         if (request.params.uri === 'server://info') {
//             return {
//                 contents: [
//                     {
//                         uri: request.params.uri,
//                         mimeType: 'text/plain',
//                         text: SERVER_INFO_CONTENT,
//                     },
//                 ],
//             };
//         }
//         return {
//             contents: [],
//         };
//     });
// }
