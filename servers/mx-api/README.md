# MultiversX API MCP Servers

These are Model Context Protocol (MCP) servers that provide tools for AI agents to read from and interact with the MultiversX blockchain API.

## Overview

There are multiple MultiversX API MCP servers, each focused on a specific domain:

- [Accounts](README-accounts.md): Focus on account-related operations
- [Collections](README-collections.md): Focus on NFT/SFT collections
- [Contracts](README-contracts.md): Focus on smart contracts
- [Network](README-network.md): Focus on network-related information
- [Tokens](README-tokens.md): Focus on fungible tokens
- [Transactions](README-transactions.md): Focus on blockchain transactions and transfers
- [Roles](README-roles.md): Focus on account roles for collections and tokens

There is an Index MCP server that contains all tools from the specialized servers.

- [Index](README-index.md): Includes all tools

There is also an Essentials MCP server that provides a reduced version of the full index server for essential tools across multiple domains:

- [Essentials](README-essentials.md): Includes essential tools across multiple domains

## Installation

The servers can be used in any MCP client (AI agents, Chatbots, Coding agents, etc.)

For MCP clients that support MCP file configuration, server configuration is added under the `mcpServers` section.

## Using remote source with NPX

The easiest way to install the servers is with the published NPM packages:

- Accounts: [@unievo/mcp-mx-api-accounts](https://www.npmjs.com/package/@unievo/mcp-mx-api-accounts)
- Collections: [@unievo/mcp-mx-api-collections](https://www.npmjs.com/package/@unievo/mcp-mx-api-collections)
- Contracts: [@unievo/mcp-mx-api-contracts](https://www.npmjs.com/package/@unievo/mcp-mx-api-contracts)
- Network: [@unievo/mcp-mx-api-network](https://www.npmjs.com/package/@unievo/mcp-mx-api-network)
- Tokens: [@unievo/mcp-mx-api-tokens](https://www.npmjs.com/package/@unievo/mcp-mx-api-tokens)
- Transactions: [@unievo/mcp-mx-api-transactions](https://www.npmjs.com/package/@unievo/mcp-mx-api-transactions)
- Roles: [@unievo/mcp-mx-api-roles](https://www.npmjs.com/package/@unievo/mcp-mx-api-roles)
- Index: [@unievo/mcp-mx-api-index](https://www.npmjs.com/package/@unievo/mcp-mx-api-index)
- Essentials: [@unievo/mcp-mx-api-essentials](https://www.npmjs.com/package/@unievo/mcp-mx-api-essentials)

Add the following section to your MCP client configuration file under the `mcpServers` section.

Example:

```json
{
  "mcpServers": {
    "mx-api-network": {
      "command": "npx",
      "args": [
        "-y",
        "@unievo/mcp-mx-api-network"
      ]
    }
  }
}
```

The package will be automatically updated with the latest version on each use.

## Using local installation with Node

### Clone the MCP server repository

```bash
git clone https://github.com/unievo/mcp.git
```

### Install dependencies

Navigate to the server directory and execute:

Example:

```bash
cd /mx-api
npm install
```

### Build the server

```bash
npm run build
```

### MCP client configuration file

Add the server section to your MCP client configuration file under the `mcpServers` section.

Example:

```json
{
  "mcpServers": {
    "mx-api-network": {
      "command": "node",
      "args": [
        "{full/path/to/mcp/server}/build/mx-api-network.js"
      ]
    }
  }
}
```

## Usage

> [!NOTE]
>
> All mx-api servers include the following tool:
>
>- `server_info`: Returns information about recommended usage of mx-api servers for AI agents. The response of this tool is the same for all servers. instruct the agent to call this tool on any mx-api server to obtain the context information.

### Fields Parameter

Most MultiversX API endpoints support a `fields` parameter that allows specifying which fields to include in the API response. This helps reduce response size and improve context window token usage.

A selection of most relevant fields are implemented by default for each tool if no fields are explicitly specified. You can also specify the special value "all" for the `fields` parameter to retrieve all available fields.
