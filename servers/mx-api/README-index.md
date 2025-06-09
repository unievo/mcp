# MultiversX API Index MCP Server

This Model Context Protocol (MCP) server provides all the tools for interacting with the MultiversX blockchain API.

>[!NOTE]
>Using the Index server has the advantage of having all the tools always active in the current context, but the disadvantage of having the most token usage when communicating with AI models, as each request includes all tool definitions. Use it for cases when you don't know what specific tools will be needed, or when access to all available tools is always required. Otherwise, use the specialized servers that can be enabled or disabled as needed in the MCP client, to have only the necessary tools active in the context.

## Overview

The MultiversX API Index server provides access to all the tools and domains. There are also specialized servers for each domain:

- [Accounts](README-accounts.md): Account-related operations
- [Collections](README-collections.md): NFT/SFT collections
- [Contracts](README-contracts.md) : Smart contracts
- [Network](README-network.md): Network-related information
- [Roles](README-roles.md): Account roles for collections and tokens
- [Tokens](README-tokens.md): Fungible tokens
- [Transactions](README-transactions.md): Blockchain transactions and transfers

There is also an Essentials server that provides a reduced version of the full index server for multiple essential tools across multiple domains:

- [Essentials](README-essentials.md): Essential tools across multiple domains

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
// Using set_network tool
{
  "name": "set_network",
  "arguments": {
    "network": "mainnet"
  }
}

// Using get_account_details tool
{
  "name": "get_account_details",
  "arguments": {
    "address": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "fields": ["all"]
  }
}

// Using get_collection tool
{
  "name": "get_collection",
  "arguments": {
    "collection": "MEDAL-ae074f",
    "fields": ["collection", "name", "type", "owner"]
  }
}
```

## Tools

The Index server includes all available tools.

## Network Tools

- `set_network`: Set the MultiversX network to use (mainnet/testnet/devnet)
- `get_network_stats`: Get network statistics
- `get_network_economics`: Get network economics data
- `get_network_constants`: Get network constants
- `get_about`: Get information about the network and API
- `get_dapp_config`: Get dApp configuration
- `get_websocket_config`: Get websocket configuration
- `get_username_details`: Get account details for a username

## Account Tools

- `get_accounts`: Get all accounts available on blockchain. By default it returns 25 accounts
- `get_accounts_count`: Get the total number of accounts
- `get_account_details`: Get account details for a given address

### Account Collection Tools

- `get_account_collections`: Get a list of collections for a given account
- `get_account_collections_count`: Get the total number of collections for a given account
- `get_account_collection`: Get a specific collection for a given account

### Account Contract Tools

- `get_account_contracts`: Get a list of contracts for a given account
- `get_account_contracts_count`: Get the total number of contracts for a given account
- `get_account_deploys`: Get a list of deploys for a given account
- `get_account_deploys_count`: Get the total number of deploys for a given account
- `get_account_sc_result`: Get a specific smart contract result for a given account
- `get_account_sc_results`: Get smart contract results where the account is sender or receiver
- `get_account_sc_results_count`: Get smart contract results count where the account is sender or receiver
- `get_account_upgrades`: Get upgrades details for a specific contract address
- `get_account_verification`: Get verification information for a given contract

### Account Deferred Tools

- `get_account_deferred`: Get deferred payment information for a given account

### Account Delegation (Staking) Tools

- `get_account_delegation`: Get delegation (staking) information for a given account
- `get_account_delegation_legacy`: Get legacy delegation (staking) information for a given account

### Account ESDT History Tools

- `get_account_esdt_history`: Get ESDT token history for a given account
- `get_account_esdt_history_count`: Get the total number of ESDT token history entries for a given account

### Account History Tools

- `get_account_history`: Get EGLD history for a given account
- `get_account_history_count`: Get the total number of EGLD history entries for a given account
- `get_account_token_history`: Get token history for a given account
- `get_account_token_history_count`: Get the total number of token history entries for a given account

### Account NFTs Tools

- `get_account_nfts`: Get a list of NFTs for a given account
- `get_account_nfts_count`: Get the total number of NFTs for a given account
- `get_account_nft`: Get a specific NFT for a given account

### Account Roles Tools

- `get_account_collections_with_roles`: Get a list of collections with roles for a given account
- `get_collections_with_roles_count`: Get the total number of collections with roles for a given account
- `get_account_collection_with_roles`: Get a specific collection with roles for a given account
- `get_account_tokens_with_roles`: Get a list of tokens with roles for a given account
- `get_tokens_with_roles_count`: Get the total number of tokens with roles for a given account
- `get_token_with_roles`: Get a specific token with roles for a given account

### Account Tokens Tools

- `get_account_tokens`: Get a list of tokens for a given account
- `get_account_tokens_count`: Get the total number of tokens for a given account
- `get_account_token`: Get a specific token for a given account

### Account Transactions Tools

- `get_account_transactions`: Get a list of transactions for a given account
- `get_account_transactions_count`: Get the total number of transactions for a given account

### Account Transfers Tools

- `get_account_transfers`: Get a list of transfers for a given account
- `get_account_transfers_count`: Get the total number of transfers for a given account

### Account Provider Tools

- `get_account_keys`: Get node keys for a given account
- `get_account_keys_count`: Get the total number of node keys for a given account
- `get_account_stake`: Get stake information for a given account
- `get_account_waiting_list`: Get all nodes in the node queue where the account is owner

## Collection Tools

- `get_collections`: Get all collections
- `get_collections_count`: Get count of collections
- `get_collection`: Get details for a specific collection
- `get_collection_accounts`: Get accounts holding NFTs from a collection
- `get_collection_nfts`: Get NFTs in a collection
- `get_collection_nfts_count`: Get count of NFTs in a collection
- `get_collection_ranks`: Get ranks for NFTs in a collection
- `get_collection_transactions`: Get transactions for a collection
- `get_collection_transactions_count`: Get count of transactions for a collection
- `get_collection_transfers`: Get transfers for a collection
- `get_collection_transfers_count`: Get count of transfers for a collection

## NFT Tools

- `get_nfts`: Get all NFTs
- `get_nfts_count`: Get count of NFTs
- `get_nft`: Get details for a specific NFT
- `get_nft_accounts`: Get accounts holding an NFT
- `get_nft_accounts_count`: Get count of accounts holding an NFT
- `get_nft_supply`: Get supply metrics for an NFT
- `get_nft_transactions`: Get transactions for an NFT
- `get_nft_transactions_count`: Get count of transactions for an NFT
- `get_nft_transfers`: Get transfers for an NFT
- `get_nft_transfers_count`: Get count of transfers for an NFT
- `process_nfts`: Process NFTs based on criteria

## Smart Contract Tools

- `get_applications`: Get all applications (smart contracts)
- `get_applications_count`: Get count of applications (smart contracts)
- `get_application`: Get details for a specific application (smart contract)

## Token Tools

- `get_tokens`: Get all tokens
- `get_tokens_count`: Get count of tokens
- `get_token`: Get details for a specific token
- `get_token_supply`: Get supply metrics for a token
- `get_token_accounts`: Get accounts holding a token
- `get_token_accounts_count`: Get count of accounts holding a token
- `get_token_transactions`: Get transactions for a token
- `get_token_transactions_count`: Get count of transactions for a token
- `get_token_transfers`: Get transfers for a token
- `get_token_transfers_count`: Get count of transfers for a token
- `get_token_logo_png`: Get PNG logo for a token
- `get_token_logo_svg`: Get SVG logo for a token

## Transaction Tools

- `get_transactions`: Get all transactions
- `get_transactions_count`: Get count of transactions
- `get_transaction`: Get details for a specific transaction
- `send_transaction`: Send a transaction to the blockchain
- `decode_transaction`: Decode a transaction

## Transfer Tools

- `get_transfers`: Get all transfers
- `get_transfers_count`: Get count of transfers

## Validator Identity Tools

- `get_identities`: Get all validator identities
- `get_identity`: Get details for a specific validator identity
- `get_identity_avatar`: Get avatar for a validator identity
