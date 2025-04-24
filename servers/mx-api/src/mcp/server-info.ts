import { ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export const SERVER_INFO_DESCRIPTION = 'Get the MultiversX API MCP servers info and usage guide.';

export const SERVER_INFO_CONTENT = 
`## For all connected mx-api-* mcp servers ALWAYS follow these rules:
- Always use only connected mx-api-* mcp servers. If no connected servers are available that provide the necessary tools, do not try to install any servers and ask the user to install and connect the necessary mx-api-* mcp servers.
- Each mx-api-* server has its own get_network and set_network tool. If the current network is not specified and not known, ALWAYS ask the user to confirm the correct network before continuing, using an array of options "use/switch". When the network is known, if a different network is required, use the set_network tool for first time use on each new mx-api-* mcp server, to set the correct network. Only set again on the same server if network change is needed.
- Always use set_network for each new mx-api-* mcp server you call.
- Always call the set_network tool again on any previously used servers to set it to the one you used before a task was interrupted.
- If no network is specified display options to choose from.
- By default, tools return a sub-set of most relevant fields.
- The "fields" parameter in tools can be used to explicitly specify which fields to retrieve, if required.
- Using "fields": ["all"] will return all fields, only use if explicitly required to get all field details, otherwise use the default set of fields.
- Some tools also have parameter names starting with "with{FieldName}" for getting additional field data. Specify them only if explicitly requested to get a specific "with" parameter or specify all for all parameters data.
- When specifying "with{FieldName}" parameters always use "fields": ["all"] in the request.
- For tool calls that return an array of items, if no count or size is explicitly specified, call the "{toolName}_count" version of the tool first (if available) to get the total number of items, and then proceed with a batch not greater than 5 items.

## For displaying data from the MultiversX networks use the following rules:
- After a tool response, display all the data formatted with bold numbered points for top level and nested bullet points for details.
- Do not include fields containing over 300 characters.
- Display timestamps in standard UTC datetime only if value > 0.
- When displaying token values (stake, amounts, balances, minted, burned, etc.) always show the denominated values without any rounding, if token decimals are known. 
- For values >= 1 show only 2 decimals, for values < 1 display decimals until two are not zero.
- Use delimiters for numbers with more than 3 digits.
- Replace base64 encoded strings with their values decoded.
- Format all output text as embedded links to explorer for:
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
- All mx-api-* servers share the same server_info content, once you read it is enough for all servers.

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
