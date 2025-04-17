#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { setMxNetworkTool, handleSetNetworkToolCall } from './mcp/set-network.js';
import { serverInfoTool, handleServerInfoToolCall } from './mcp/server-info.js';
import { registerResourceHandlers } from './mcp/server/resources/index.js';
import { allTools, handleToolCalls } from './mcp/server/tools/index.js';

class MxMcpServer {
    private server: Server;

    constructor() {
        this.server = new Server(
            {
                name: 'mx-api-index',
                version: '1.0.0',
            },
            {
                capabilities: {
                    resources: {},
                    tools: {},
                },
            }
        );

        this.setupTools();
        this.setupResources();
        this.server.onerror = (error) => console.error('[MCP Error]', error);
    }

    private setupTools() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                serverInfoTool,
                setMxNetworkTool,
                ...allTools,
            ],
        }));


        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const serverInfoResponse = await handleServerInfoToolCall(request.params.name, request.params.arguments);
            if (serverInfoResponse) {
                return serverInfoResponse;
            }

            const setNetworkResponse = await handleSetNetworkToolCall(request.params.name, request.params.arguments);
            if (setNetworkResponse) {
                return setNetworkResponse;
            }
            
            return handleToolCalls(request.params.name, request.params.arguments);
        });
    }

    private setupResources() {
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
            resources: [
                // set resources
            ],
        }));

        registerResourceHandlers(this.server);
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('MultiversX API server running on stdio');
    }
}

const server = new MxMcpServer();
server.run().catch(console.error);
