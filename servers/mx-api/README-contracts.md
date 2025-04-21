# MultiversX API Contracts MCP Server

This Model Context Protocol (MCP) server provides tools for interacting with the MultiversX blockchain API, specifically focused on smart contract-related operations.

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
    "mx-api-contracts": {
      "command": "npx",
      "args": [
        "-y",
        "@unievo/mcp-mx-api-contracts"
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
    "mx-api-contracts": {
      "command": "node",
      "args": [
        "{full/path/to/mcp/server}/build/mx-api-contracts.js"
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

// Using get_application tool
{
  "name": "get_application",
  "arguments": {
    "address": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "fields": ["contract", "owner", "balance"]
  }
}

// Using get_account_deploys tool
{
  "name": "get_account_deploys",
  "arguments": {
    "address": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "fields": ["all"]
  }
}
```

## Tools

### Network Tool

1. `set_network`
   - Description: Set the MultiversX network to use (mainnet/testnet/devnet)
   - Parameters:
     - `network`: String enum ("mainnet" | "testnet" | "devnet")

### Application Tools

1. `get_applications`
   - Description: Returns all smart contracts available on blockchain. By default it returns 25 smart contracts
   - Parameters:
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `before`: Before timestamp
     - `after`: After timestamp
     - `withTxCount`: Include transaction count
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

2. `get_applications_count`
   - Description: Returns total number of smart contracts
   - Parameters:
     - `before`: Before timestamp
     - `after`: After timestamp

3. `get_application`
   - Description: Returns details of a smart contract
   - Parameters:
     - `address`: The address of the smart contract (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Smart contract details including contract address, deployer, owner, codeHash, timestamp, etc.

### Account Contract Tools

1. `get_account_deploys`
   - Description: Returns deploys details for a given account
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Deploy details including address, deployTxHash, timestamp, etc.

2. `get_account_deploys_count`
   - Description: Returns total number of deploys for a given address
   - Parameters:
     - `address`: Account address (required)
   - Returns: Count of deploys for the specified account

3. `get_account_sc_results`
   - Description: Returns smart contract results where the account is sender or receiver
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Smart contract results including hash, receiver, function, status, etc.

4. `get_account_sc_results_count`
   - Description: Returns number of smart contract results where the account is sender or receiver
   - Parameters:
     - `address`: Account address (required)
   - Returns: Count of smart contract results for the specified account

5. `get_account_sc_result`
   - Description: Returns details of a smart contract result where the account is sender or receiver
   - Parameters:
     - `address`: Account address (required)
     - `scHash`: Smart contract result hash (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Detailed information about a specific smart contract result

### Account Upgrades Tools

1. `get_account_upgrades`
   - Description: Returns all upgrades details for a specific contract address
   - Parameters:
     - `address`: Contract address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Contract upgrade information including txHash, codeHash, upgrader, timestamp, etc.

### Account Verification Tools

1. `get_account_verification`
   - Description: Returns contract verification details
   - Parameters:
     - `address`: Contract address (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Verification details including codeHash, status, source code information, verification status, etc.
