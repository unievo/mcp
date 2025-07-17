import { ErrorCode, McpError, ReadResourceRequest } from '@modelcontextprotocol/sdk/types.js';


export const allResources = [
    // Resources
    // {
    //     uri: 'resource://uri',
    //     name: 'Resource name',
    //     mimeType: 'text/plain',
    //     description: 'Resource description',
    // },
];


export function handleResourceRead(request: ReadResourceRequest) {
    return {}; // Remove this line and Implement resource read handlers

    // Resource read handlers
    switch (request.params.uri) {
        // case 'resource://uri':
        // return {
        //     contents: [
        //         {
        //             uri: request.params.uri,
        //             mimeType: 'text/plain',
        //             text: 'Resource content',
        //         },
        //     ],
        // };
        // default:
        //     throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${request.params.uri}`);
    }
}
