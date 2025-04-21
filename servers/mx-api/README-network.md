# MultiversX API Network MCP Server

This Model Context Protocol (MCP) server provides tools for interacting with the MultiversX blockchain API, specifically focused on network operations.

## Installation

The server can be used with any MCP client (AI agents, Chatbots, Coding agents, etc.)

For MCP clients that support MCP file configuration, add the following section under the `mcpServers` section:

## Using remote source with NPX

The easiest way to use the server is with the published NPM package and NPX.
The package will automatically be up to date with the latest version.

> [!NOTE]
>
> You can set the default network by setting the `DEFAULT_NETWORK` environment variable.

```json
{
  "mcpServers": {
    "mx-api-network": {
      "command": "npx",
      "args": [
        "-y",
        "@unievo/mcp-mx-api-network"
      ],
      "env": {
        "DEFAULT_NETWORK": "devnet"
      }
    }
  }
}
```

## Using local installation with Node

### Clone the MCP server repository

```bash
git clone https://github.com/unievo/mcp.git
```

### Install dependencies

Navigate to the server directory and install dependencies:

```bash
cd mx-api/
npm install
```

### Build the server

```bash
npm run build
```

### Add the section to your MCP client configuration file

> [!NOTE]
>
> You can set the default network by setting the `DEFAULT_NETWORK` environment variable.

```json
{
  "mcpServers": {
    "mx-api-network": {
      "command": "node",
      "args": [
        "{full/path/to/mcp/server}/build/mx-api-network.js"
      ],
      "env": {
        "DEFAULT_NETWORK": "devnet"
      }
    }
  }
}
```

## Usage

> [!NOTE]
>
> All mx-api servers include the following tool:
>
>- `server_info`: Returns information about recommended usage of mx-api servers for AI agents. The response of this tool is the same for all servers, instruct the agent to call this tool on any mx-api server to obtain the context information.

### Fields Parameter

Most MultiversX API endpoints support a `fields` parameter that allows specifying which fields to include in the API response. This helps reduce response size and improve context window token usage.

A selection of most relevant fields are implemented by default for each tool if no fields are explicitly specified. You can also specify the special value "all" for the `fields` parameter to retrieve all available fields.

The server can be used with any MCP-compatible client. Example usage:

```typescript
// Using set_network tool
{
  "name": "set_network",
  "arguments": {
    "network": "mainnet"
  }
}

// Using get_network_stats tool
{
  "name": "get_network_stats",
  "arguments": {}
}
```

## Tools

### Network Tools

1. `set_network`
   - Description: Set the MultiversX network to use (mainnet/testnet/devnet)
   - Parameters:
     - `network`: String enum ("mainnet" | "testnet" | "devnet")

2. `get_network_stats`
   - Description: Get current network statistics
   - Parameters:
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields.
   - Returns: Network statistics including accounts, blocks, transactions, epoch, refresh rate, rounds passed, rounds per epoch, shards, etc.

3. `get_network_economics`
   - Description: Get network economics information
   - Parameters:
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields.
   - Returns: Economic metrics including total supply, circulating supply, staked amount, price, market cap, APR, etc.

4. `get_network_constants`
   - Description: Get network-specific constants that can be used to automatically configure dapps
   - Parameters:
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields.
   - Returns: Network configuration constants including chain ID, gas limits, min gas price, etc.

5. `get_about`
   - Description: Returns information about network and API
   - Parameters:
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields.
   - Returns: Information about app version, network, cluster, version, indexer version, gateway version, and features.

6. `get_dapp_config`
   - Description: Returns configuration used in dapps
   - Parameters:
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields.
   - Returns: Dapp configuration including ID, name, EGLD label, decimals, denomination, gas settings, API timeout, wallet connect settings, etc.

7. `get_websocket_config`
   - Description: Returns config used for accessing websocket on the same cluster
   - Returns: Websocket configuration including URL.

8. `get_username_details`
   - Description: Returns account details for a given username
   - Parameters:
     - `username`: String, the username to get details for (required)
     - `withGuardianInfo`: Boolean, include guardian information
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields.
   - Returns: Account details including address, nonce, balance, root hash, transaction count, username, shard, etc.
