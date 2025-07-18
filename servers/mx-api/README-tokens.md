# MultiversX API Tokens MCP Server

This Model Context Protocol (MCP) server provides tools for interacting with the MultiversX blockchain API, specifically focused on tokens and token-related operations.

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
    "mx-api-tokens": {
      "command": "npx",
      "args": [
        "-y",
        "@unievo/mcp-mx-api-tokens"
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
    "mx-api-tokens": {
      "command": "node",
      "args": [
        "{full/path/to/mcp/server}/build/mx-api-tokens.js"
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

// Using get-tokens tool
{
  "name": "get-tokens",
  "arguments": {
    "from": 0,
    "size": 10,
    "type": "FungibleESDT",
    "fields": ["identifier", "name", "ticker", "price"]
  }
}

// Using get-token tool
{
  "name": "get-token",
  "arguments": {
    "identifier": "WEGLD-bd4d79",
    "fields": ["all"]
  }
}

// Using get-account-tokens tool
{
  "name": "get-account-tokens",
  "arguments": {
    "address": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "fields": ["identifier", "name", "balance", "valueUsd"]
  }
}
```

## Understanding Token Types

In the MultiversX ecosystem, there are several token types:

1. **FungibleESDT (ESDT)**: Standard fungible tokens similar to ERC-20 tokens on Ethereum
2. **NonFungibleESDT (NFT)**: Non-fungible tokens similar to ERC-721 tokens on Ethereum
3. **SemiFungibleESDT (SFT)**: Semi-fungible tokens that combine properties of both fungible and non-fungible tokens
4. **MetaESDT**: Meta tokens that can be used to represent other tokens

Each token type has specific properties and use cases within the MultiversX blockchain ecosystem.

## Tools

### Network Tools

1. `set-network`
   - Description: Set the MultiversX network to use
   - Parameters:
     - `network`: String

### Token Tools

1. `get-tokens`
   - Description: Returns all tokens available on the blockchain
   - Parameters:
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `type`: Token type ("FungibleESDT" | "NonFungibleESDT" | "SemiFungibleESDT" | "MetaESDT")
     - `search`: Search by collection identifier
     - `name`: Search by token name
     - `identifier`: Search by token identifier
     - `identifiers`: Array of strings, search by multiple token identifiers
     - `sort`: Sorting criteria ("accounts" | "transactions" | "price" | "marketCap")
     - `order`: Sorting order ("asc" | "desc")
     - `includeMetaESDT`: Include MetaESDTs in response
     - `mexPairType`: Array of strings, token Mex Pair types
     - `priceSource`: Token Price Source ("dataApi" | "customUrl")
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: List of tokens with details such as identifier, name, ticker, price, supply, etc.

2. `get-tokens-count`
   - Description: Returns the total number of tokens
   - Parameters:
     - `type`: Token type ("FungibleESDT" | "NonFungibleESDT" | "SemiFungibleESDT" | "MetaESDT")
     - `search`: Search by collection identifier
     - `name`: Search by token name
     - `identifier`: Search by token identifier
   - Returns: Count of tokens matching the criteria

3. `get-token`
   - Description: Returns the details of a specific token
   - Parameters:
     - `identifier`: Token identifier (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Detailed information about a specific token

4. `get-token-supply`
   - Description: Returns supply metrics for a specific token
   - Parameters:
     - `identifier`: Token identifier (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Supply information including totalSupply, circulatingSupply, minted, burned, initialMinted

5. `get-token-accounts`
   - Description: Returns a list of accounts that hold a specific token
   - Parameters:
     - `identifier`: Token identifier (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: List of accounts holding the specified token

6. `get-token-accounts-count`
   - Description: Returns the number of accounts that hold a specific token
   - Parameters:
     - `identifier`: Token identifier (required)
   - Returns: Count of accounts holding the specified token

7. `get-token-transactions`
   - Description: Returns a list of transactions for a specific token
   - Parameters:
     - `identifier`: Token identifier (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `sender`: Address of the transaction sender
     - `receiver`: Address of the transaction receiver
     - `senderShard`: Filter by sender shard
     - `receiverShard`: Filter by receiver shard
     - `miniBlockHash`: Filter by miniblock hash
     - `hashes`: Array of strings, filter by transaction hashes
     - `status`: Filter by transaction status
     - `function`: Filter by function name
     - `before`: Filter by timestamp (transactions before the given timestamp)
     - `after`: Filter by timestamp (transactions after the given timestamp)
     - `order`: Sort order ("asc" | "desc")
     - `withScResults`: Include smart contract results in response
     - `withOperations`: Include operations in response
     - `withLogs`: Include logs in response
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: List of transactions for the specified token

8. `get-token-transactions-count`
   - Description: Returns the number of transactions for a specific token
   - Parameters:
     - `identifier`: Token identifier (required)
     - `sender`: Address of the transaction sender
     - `receiver`: Address of the transaction receiver
     - `senderShard`: Filter by sender shard
     - `receiverShard`: Filter by receiver shard
     - `miniBlockHash`: Filter by miniblock hash
     - `status`: Filter by transaction status
     - `search`: Search in transaction data
     - `function`: Filter by function name
     - `before`: Before timestamp
     - `after`: After timestamp
   - Returns: Count of transactions for the specified token

9. `get-token-transfers`
   - Description: Returns transfers for a specific token
   - Parameters:
     - `identifier`: Token identifier (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `sender`: Address of the transfer sender
     - `receiver`: Address of the transfer receiver
     - `senderShard`: Filter by sender shard
     - `receiverShard`: Filter by receiver shard
     - `miniBlockHash`: Filter by miniblock hash
     - `hashes`: Array of strings, filter by transaction hashes
     - `status`: Filter by transfer status
     - `function`: Filter by function name
     - `before`: Before timestamp
     - `after`: After timestamp
     - `order`: Sorting order ("asc" | "desc")
     - `search`: Search in transfer data
     - `withScResults`: Include smart contract results in response
     - `withLogs`: Include logs in response
     - `withOperation`: Include operation in response
     - `withBlockInfo`: Include block info in response
     - `withUsername`: Include username in response
     - `withScamInfo`: Include scam info in response
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: List of transfers for the specified token

10. `get-token-transfers-count`
    - Description: Returns the number of transfers for a specific token
    - Parameters:
      - `identifier`: Token identifier (required)
      - `sender`: Address of the transfer sender
      - `receiver`: Address of the transfer receiver
      - `senderShard`: Filter by sender shard
      - `receiverShard`: Filter by receiver shard
      - `miniBlockHash`: Filter by miniblock hash
      - `status`: Filter by transfer status
      - `search`: Search in transfer data
      - `function`: Filter by function name
      - `before`: Before timestamp
      - `after`: After timestamp
    - Returns: Count of transfers for the specified token

11. `get-token-logo-png`
    - Description: Returns the PNG logo for a specific token
    - Parameters:
      - `identifier`: Token identifier (required)
    - Returns: PNG logo for the specified token

12. `get-token-logo-svg`
    - Description: Returns the SVG logo for a specific token
    - Parameters:
      - `identifier`: Token identifier (required)
    - Returns: SVG logo for the specified token

### Account Token Tools

1. `get-account-tokens`
   - Description: Returns a list of all available fungible tokens for a given address, together with their balance
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `type`: Token type ("FungibleESDT" | "MetaESDT")
     - `subType`: Token sub type
     - `search`: Search by collection identifier
     - `name`: Search by token name
     - `identifier`: Search by token identifier
     - `identifiers`: A comma-separated list of identifiers to filter by
     - `includeMetaESDT`: Include MetaESDTs in response
     - `timestamp`: Retrieve entries from timestamp
     - `mexPairType`: Array of strings, token Mex Pair types
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: List of tokens for the specified account with balances

2. `get-account-tokens-count`
   - Description: Returns the total number of tokens for a given address
   - Parameters:
     - `address`: Account address (required)
     - `type`: Token type ("FungibleESDT" | "MetaESDT")
     - `search`: Search by collection identifier
     - `name`: Search by token name
     - `identifier`: Search by token identifier
     - `identifiers`: A comma-separated list of identifiers to filter by
     - `includeMetaESDT`: Include MetaESDTs in response
   - Returns: Count of tokens for the specified account

3. `get-account-token`
   - Description: Returns details about a specific fungible token from a given address
   - Parameters:
     - `address`: Account address (required)
     - `token`: Token identifier (required)
     - `timestamp`: Retrieve entries from timestamp
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Detailed information about a specific token for the specified account
