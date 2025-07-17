#!/usr/bin/env node
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    CallToolRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { setNetworkTool, handleNetworkConfigToolCall, getNetworkTool } from './mcp/network-config.js';
import { 
    handleToolCalls,
    accountRolesTools,
} from './mcp/server/tools/index.js';
import { allResources, handleResourceRead } from './mcp/server/resources/index.js';
import { handleServerInfoResource, handleServerInfoToolCall, serverInfoResource, serverInfoTool } from './mcp/server-info.js';

class MxMcpServer {
    private server: Server;

    constructor() {
        this.server = new Server(
            {
                name: 'mx-api-roles',
                version: '1.0.0',
            },
            {
                capabilities: {
                    resources: {},
                    tools: {},
                }
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
                getNetworkTool,
                setNetworkTool,
                ...accountRolesTools,
            ],
        }));


        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const serverInfoResponse = await handleServerInfoToolCall(request.params.name, request.params.arguments);
            if (serverInfoResponse) {
                return serverInfoResponse;
            }
            
            const networkConfigResponse = await handleNetworkConfigToolCall(request.params.name, request.params.arguments);
            if (networkConfigResponse) {
                return networkConfigResponse;
            }
            return handleToolCalls(request.params.name, request.params.arguments);
        });
    }

    private setupResources() {
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
            resources: [
                serverInfoResource,
                ...allResources,
            ],
        }));
    
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const serverInfoResponse = await handleServerInfoResource(request);
            if (serverInfoResponse) {
                return serverInfoResponse;
            }

            return handleResourceRead(request);
        });
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('MultiversX API Roles server running on stdio');
    }
}

const server = new MxMcpServer();
server.run().catch(console.error);
