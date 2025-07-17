# MultiversX API Index MCP Server

This Model Context Protocol (MCP) server provides all the tools for interacting with the MultiversX blockchain API.

>[!NOTE]
>Using the Index server has the advantage of having all the tools always active in the current context, but the disadvantage of having the more token usage when communicating with AI models, as each request includes all tool definitions. Use it for cases when you don't know what specific tools will be needed, or when access to all available tools is always required. Otherwise, use the specialized servers that can be enabled or disabled as needed in the MCP client, to have only the necessary tools active in the context.

## Overview

The MultiversX API Index server provides access to all available tools. 

[Specialized](README.md) servers are also available.

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
    "mx-api-index": {
      "command": "npx",
      "args": [
        "-y",
        "@unievo/mcp-mx-api-index"
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
    "mx-api-index": {
      "command": "node",
      "args": [
        "{full/path/to/mcp/server}/build/mx-api-index.js"
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

// Using get-account-details tool
{
  "name": "get-account-details",
  "arguments": {
    "address": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "fields": ["all"]
  }
}

// Using get-collection tool
{
  "name": "get-collection",
  "arguments": {
    "collection": "MEDAL-ae074f",
    "fields": ["collection", "name", "type", "owner"]
  }
}
```

## Tools

The Index server includes all available tools.

## Network Tools

- `set-network`: Set the MultiversX network to use
- `get-network-stats`: Get network statistics
- `get-network-economics`: Get network economics data
- `get-network-constants`: Get network constants
- `get-about`: Get information about the network and API
- `get-dapp-config`: Get dApp configuration
- `get-websocket-config`: Get websocket configuration
- `get-username-details`: Get account details for a username

## Account Tools

- `get-accounts`: Get all accounts available on blockchain. By default it returns 25 accounts
- `get-accounts-count`: Get the total number of accounts
- `get-account-details`: Get account details for a given address

### Account Collection Tools

- `get-account-collections`: Get a list of collections for a given account
- `get-account-collections-count`: Get the total number of collections for a given account
- `get-account-collection`: Get a specific collection for a given account

### Account Contract Tools

- `get-account-contracts`: Get a list of contracts for a given account
- `get-account-contracts-count`: Get the total number of contracts for a given account
- `get-account-deploys`: Get a list of deploys for a given account
- `get-account-deploys-count`: Get the total number of deploys for a given account
- `get-account-sc-result`: Get a specific smart contract result for a given account
- `get-account-sc-results`: Get smart contract results where the account is sender or receiver
- `get-account-sc-results-count`: Get smart contract results count where the account is sender or receiver
- `get-account-upgrades`: Get upgrades details for a specific contract address
- `get-account-verification`: Get verification information for a given contract

### Account Deferred Tools

- `get-account-deferred`: Get deferred payment information for a given account

### Account Delegation (Staking) Tools

- `get-account-delegation`: Get delegation (staking) information for a given account
- `get-account-delegation-legacy`: Get legacy delegation (staking) information for a given account

### Account ESDT History Tools

- `get-account-esdt-history`: Get ESDT token history for a given account
- `get-account-esdt-history-count`: Get the total number of ESDT token history entries for a given account

### Account History Tools

- `get-account-history`: Get EGLD history for a given account
- `get-account-history-count`: Get the total number of EGLD history entries for a given account
- `get-account-token-history`: Get token history for a given account
- `get-account-token-history-count`: Get the total number of token history entries for a given account

### Account NFTs Tools

- `get-account-nfts`: Get a list of NFTs for a given account
- `get-account-nfts-count`: Get the total number of NFTs for a given account
- `get-account-nft`: Get a specific NFT for a given account

### Account Roles Tools

- `get-account-collections-with-roles`: Get a list of collections with roles for a given account
- `get-collections-with-roles-count`: Get the total number of collections with roles for a given account
- `get-account-collection-with-roles`: Get a specific collection with roles for a given account
- `get-account-tokens-with-roles`: Get a list of tokens with roles for a given account
- `get-tokens-with-roles-count`: Get the total number of tokens with roles for a given account
- `get-token-with-roles`: Get a specific token with roles for a given account

### Account Tokens Tools

- `get-account-tokens`: Get a list of tokens for a given account
- `get-account-tokens-count`: Get the total number of tokens for a given account
- `get-account-token`: Get a specific token for a given account

### Account Transactions Tools

- `get-account-transactions`: Get a list of transactions for a given account
- `get-account-transactions-count`: Get the total number of transactions for a given account

### Account Transfers Tools

- `get-account-transfers`: Get a list of transfers for a given account
- `get-account-transfers-count`: Get the total number of transfers for a given account

### Account Provider Tools

- `get-account-keys`: Get node keys for a given account
- `get-account-keys-count`: Get the total number of node keys for a given account
- `get-account-stake`: Get stake information for a given account
- `get-account-waiting-list`: Get all nodes in the node queue where the account is owner

## Collection Tools

- `get-collections`: Get all collections
- `get-collections-count`: Get count of collections
- `get-collection`: Get details for a specific collection
- `get-collection-accounts`: Get accounts holding NFTs from a collection
- `get-collection-nfts`: Get NFTs in a collection
- `get-collection-nfts-count`: Get count of NFTs in a collection
- `get-collection-ranks`: Get ranks for NFTs in a collection
- `get-collection-transactions`: Get transactions for a collection
- `get-collection-transactions-count`: Get count of transactions for a collection
- `get-collection-transfers`: Get transfers for a collection
- `get-collection-transfers-count`: Get count of transfers for a collection

## NFT Tools

- `get-nfts`: Get all NFTs
- `get-nfts-count`: Get count of NFTs
- `get-nft`: Get details for a specific NFT
- `get-nft-accounts`: Get accounts holding an NFT
- `get-nft-accounts-count`: Get count of accounts holding an NFT
- `get-nft-supply`: Get supply metrics for an NFT
- `get-nft-transactions`: Get transactions for an NFT
- `get-nft-transactions-count`: Get count of transactions for an NFT
- `get-nft-transfers`: Get transfers for an NFT
- `get-nft-transfers-count`: Get count of transfers for an NFT
- `process-nfts`: Process NFTs based on criteria

## Smart Contract Tools

- `get-applications`: Get all applications (smart contracts)
- `get-applications-count`: Get count of applications (smart contracts)
- `get-application`: Get details for a specific application (smart contract)

## Token Tools

- `get-tokens`: Get all tokens
- `get-tokens-count`: Get count of tokens
- `get-token`: Get details for a specific token
- `get-token-supply`: Get supply metrics for a token
- `get-token-accounts`: Get accounts holding a token
- `get-token-accounts-count`: Get count of accounts holding a token
- `get-token-transactions`: Get transactions for a token
- `get-token-transactions-count`: Get count of transactions for a token
- `get-token-transfers`: Get transfers for a token
- `get-token-transfers-count`: Get count of transfers for a token
- `get-token-logo-png`: Get PNG logo for a token
- `get-token-logo-svg`: Get SVG logo for a token

## Transaction Tools

- `get-transactions`: Get all transactions
- `get-transactions-count`: Get count of transactions
- `get-transaction`: Get details for a specific transaction
- `send-transaction`: Send a transaction to the blockchain
- `decode-transaction`: Decode a transaction

## Transfer Tools

- `get-transfers`: Get all transfers
- `get-transfers-count`: Get count of transfers

## Validator Identity Tools

- `get-identities`: Get all validator identities
- `get-identity`: Get details for a specific validator identity
- `get-identity-avatar`: Get avatar for a validator identity
