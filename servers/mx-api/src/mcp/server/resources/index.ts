import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListResourcesRequestSchema } from '@modelcontextprotocol/sdk/types.js';


export const allResources = [
    // Add resources here
];

export function setupResources(server: Server) {
    server.setRequestHandler(ListResourcesRequestSchema, async () => ({
        resources: allResources,
    }));

    // Register individual resource handlers
    registerResourceHandlers(server);
}

// Function to register all individual resource handlers
export function registerResourceHandlers(server: Server) {
    // Add resource handlers here
}
