# MultiversX API Accounts MCP Server

This Model Context Protocol (MCP) server provides tools for interacting with the MultiversX blockchain API, specifically focused on account-related operations.

## Installation

The server can be used with any MCP client (AI agents, Chatbots, Coding agents, etc.)

### Configuration

The default configuration is [customizable](README-config.md).

For MCP clients that support MCP file configuration, add the following section under the `mcpServers` section:

## Using remote source with NPX

The easiest way to use the server is with the published NPM package and NPX.
The latest package version will be used automatically.

```json
{
  "mcpServers": {
    "mx-api-accounts": {
      "command": "npx",
      "args": [
        "-y",
        "@unievo/mcp-mx-api-accounts"
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
git clone https://github.com/unievo/mx-mcp.git
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

```json
{
  "mcpServers": {
    "mx-api-accounts": {
      "command": "node",
      "args": [
        "{full/path/to/mcp/server}/build/mx-api-accounts.js"
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
> All mx-api servers include the following:
>
>- `server-info` tool: Returns information about recommended usage of mx-api servers for AI agents. The response of this tool is the same for all servers, instruct the agent to call this tool on any mx-api server to obtain the context information.
>- `server://info` resource: Returns the same information.

### Fields Parameter

Most MultiversX API endpoints support a `fields` parameter that allows specifying which fields to include in the API response. This helps reduce response size and improve context window token usage.

A selection of most relevant fields are implemented by default for each tool if no fields are explicitly specified. You can also specify the special value "all" for the `fields` parameter to retrieve all available fields.

The server can be used with any MCP-compatible client. Example usage:

```typescript
// Using set-network tool
{
  "name": "set-network",
  "arguments": {
    "network": "mainnet"
  }
}

// Using get-accounts tool
{
  "name": "get-accounts",
  "arguments": {
    "size": 10,
    "fields": ["address", "balance", "nonce"]
  }
}

// Using get-account-details tool
{
  "name": "get-account-details",
  "arguments": {
    "address": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "fields": ["all"]
  }
}
```

## Tools

### Account Tools

1. `set-network`
   - Description: Set the MultiversX network to use
   - Parameters:
     - `network`: String

2. `get-accounts`
   - Description: Returns all accounts available on blockchain. By default it returns 25 accounts
   - Parameters:
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `ownerAddress`: Search by owner address
     - `name`: Filter accounts by assets name
     - `tags`: Filter accounts by assets tags
     - `sort`: Sort criteria ("balance" | "timestamp" | "transfersLast24h")
     - `order`: Sort order ("asc" | "desc")
     - `isSmartContract`: Filter accounts by whether they are smart contract or not
     - `withOwnerAssets`: Return a list accounts with owner assets
     - `withDeployInfo`: Include deployedAt and deployTxHash fields in the result
     - `withTxCount`: Include txCount field in the result
     - `withScrCount`: Include scrCount field in the result
     - `excludeTags`: Exclude specific tags from result
     - `hasAssets`: Returns a list of accounts that have assets
     - `search`: Search by account address
     - `addresses`: A comma-separated list of addresses to filter by
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

3. `get-accounts-count`
   - Description: Returns total number of accounts available on blockchain
   - Parameters:
     - `ownerAddress`: Search by owner address
     - `isSmartContract`: Return total smart contracts count
     - `name`: Filter accounts by assets name
     - `tags`: Filter accounts by assets tags
     - `excludeTags`: Exclude specific tags from result
     - `hasAssets`: Returns a list of accounts that have assets

4. `get-account-details`
   - Description: Returns account details for a given address
   - Parameters:
     - `address`: Account address (required)
     - `withGuardianInfo`: Include guardian information
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Detailed account information including address, balance, nonce, shard, etc.

### Account Deferred Tools

1. `get-account-deferred`
   - Description: Returns deferred payments for a given account
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Deferred payment information including deferredPayment and secondsLeft

### Account Delegation Tools

1. `get-account-delegation`
   - Description: Summarizes all delegation positions with staking providers, together with unDelegation positions
   - Parameters:
     - `address`: Account address (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Delegation information including address, contract, userActiveStake, claimableRewards, etc.

2. `get-account-delegation-legacy`
   - Description: Returns staking information related to the legacy delegation pool
   - Parameters:
     - `address`: Account address (required)
     - `timestamp`: Retrieve entry from timestamp
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Legacy delegation information including claimableRewards, userActiveStake, userWaitingStake, etc.

### Account ESDT History Tools

1. `get-account-esdt-history`
   - Description: Returns account esdts balance history
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `before`: Return entries before given timestamp
     - `after`: Return entries after given timestamp
     - `identifier`: Filter by multiple esdt identifiers, comma-separated
     - `token`: Filter by token identifier
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: ESDT history entries including token, balance, timestamp, etc.

2. `get-account-esdt-history-count`
   - Description: Returns total number of ESDT history entries for a given address
   - Parameters:
     - `address`: Account address (required)
     - `before`: Return entries before given timestamp
     - `after`: Return entries after given timestamp
     - `identifier`: Filter by multiple esdt identifiers, comma-separated
     - `token`: Filter by token identifier
   - Returns: Count of ESDT history entries

### Account History Tools

1. `get-account-history`
   - Description: Return account network token balance history
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `before`: Before timestamp
     - `after`: After timestamp
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Account history entries including balance, timestamp, etc.

2. `get-account-history-count`
   - Description: Return account network token balance history count
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `before`: Before timestamp
     - `after`: After timestamp
   - Returns: Count of account history entries

3. `get-account-token-history`
   - Description: Returns account network token balance history
   - Parameters:
     - `address`: Account address (required)
     - `tokenIdentifier`: Token identifier (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `before`: Before timestamp
     - `after`: After timestamp
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Token history entries including token, balance, timestamp, etc.

4. `get-account-token-history-count`
   - Description: Return account token balance history count
   - Parameters:
     - `address`: Account address (required)
     - `tokenIdentifier`: Token identifier (required)
     - `before`: Before timestamp
     - `after`: After timestamp
   - Returns: Count of token history entries
