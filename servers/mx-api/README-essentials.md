# MultiversX API Essentials MCP Server

This Model Context Protocol (MCP) server provides essential selected tools for interacting with the MultiversX blockchain API. It combines the most commonly used functionality for:

- [Accounts](README-accounts.md) (account details, account transactions, account tokens)
- [Collections](README-collections.md) (NFT/SFT collections)
- [Tokens](README-tokens.md) (fungible tokens)
- [Transactions](README-transactions.md) (transactions and transfers)

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
    "mx-api-essentials": {
      "command": "npx",
      "args": [
        "-y",
        "@unievo/mcp-mx-api-essentials"
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
    "mx-api-essentials": {
      "command": "node",
      "args": [
        "{full/path/to/mcp/server}/build/mx-api-essentials.js"
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

// Using get_accounts tool
{
  "name": "get_accounts",
  "arguments": {
    "size": 10,
    "fields": ["address", "balance", "nonce"]
  }
}

// Using get_account_tokens tool
{
  "name": "get_account_tokens",
  "arguments": {
    "address": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "fields": ["identifier", "name", "balance"]
  }
}

// Using get_nfts tool
{
  "name": "get_nfts",
  "arguments": {
    "collection": "MEDAL-ae074f",
    "size": 10,
    "fields": ["identifier", "name", "url"]
  }
}

// Using get_transactions tool
{
  "name": "get_transactions",
  "arguments": {
    "sender": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "size": 10,
    "fields": ["txHash", "sender", "receiver", "value", "status"]
  }
}
```

## Tools

### Network Tools

1. `set_network`
   - Description: Set the MultiversX network to use (mainnet/testnet/devnet)
   - Parameters:
     - `network`: String enum ("mainnet" | "testnet" | "devnet")

### Account Tools

1. `get_accounts`
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

2. `get_account_details`
   - Description: Returns account details for a given address
   - Parameters:
     - `address`: Account address (required)
     - `withGuardianInfo`: Include guardian information
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

### Account Token Tools

1. `get_account_tokens`
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
     - `mexPairType`: Token Mex Pair
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

2. `get_account_tokens_count`
   - Description: Returns the total number of tokens for a given address
   - Parameters:
     - `address`: Account address (required)
     - `type`: Token type ("FungibleESDT" | "MetaESDT")
     - `search`: Search by collection identifier
     - `name`: Search by token name
     - `identifier`: Search by token identifier
     - `identifiers`: A comma-separated list of identifiers to filter by
     - `includeMetaESDT`: Include MetaESDTs in response

3. `get_account_token`
   - Description: Returns details for a specific token for a given address
   - Parameters:
     - `address`: Account address (required)
     - `identifier`: Token identifier (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

### Account Transaction Tools

1. `get_account_transactions`
   - Description: Returns details of all transactions where the account is sender or receiver
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `sender`: Address of the transaction sender
     - `receiver`: Address of the transaction receiver or multiple receivers (comma-separated)
     - `token`: Identifier of the token
     - `senderShard`: Id of the shard the sender address is in
     - `receiverShard`: Id of the shard the receiver address is in
     - `miniBlockHash`: Filter by miniblock hash
     - `hashes`: Filter by a comma-separated list of transaction hashes
     - `status`: Status of the transaction (success/pending/invalid/fail)
     - `function`: Filter by function name or multiple function names (comma-separated)
     - `before`: Return transactions before given timestamp
     - `after`: Return transactions after given timestamp
     - `round`: Filter by round number
     - `order`: Sort order (asc/desc)
     - `withScResults`: Return smart contract results for transactions
     - `withOperations`: Return operations for transactions
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
     - `withLogs`: Return logs for transactions
     - `withScamInfo`: Returns scam information
     - `withUsername`: Integrates username in assets for all addresses present in the transactions
     - `withBlockInfo`: Include block information

2. `get_account_transactions_count`
   - Description: Returns the total number of transactions for a given address
   - Parameters:
     - `address`: Account address (required)
     - Similar filtering options as `get_account_transactions`

### Account Collection Tools

1. `get_account_collections`
   - Description: Returns NFT/SFT/MetaESDT collections where the account owns one or more NFTs
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `search`: Search by collection identifier
     - `type`: Filter by type (NonFungibleESDT/SemiFungibleESDT/MetaESDT)
     - `subType`: Filter by type (NonFungibleESDTv2/DynamicNonFungibleESDT/DynamicSemiFungibleESDT)
     - `excludeMetaESDT`: Exclude collections of type "MetaESDT" in the response
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

2. `get_account_collections_count`
   - Description: Returns the total number of NFT/SFT/MetaESDT collections where the account owns one or more NFTs
   - Parameters:
     - `address`: Account address (required)
     - Similar filtering options as `get_account_collections`

3. `get_account_collection`
   - Description: Returns details about a specific NFT/SFT/MetaESDT collection from a given address
   - Parameters:
     - `address`: Account address (required)
     - `collection`: Collection identifier (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

### Account NFT Tools

1. `get_account_nfts`
   - Description: Returns a list of all available NFTs/SFTs/MetaESDTs owned by the provided address
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `search`: Search by collection identifier
     - `identifiers`: Filter by identifier, comma-separated
     - `type`: Filter by type (NonFungibleESDT/SemiFungibleESDT/MetaESDT)
     - `subType`: Filter by sub-type (SemiFungibleESDT)
     - `collection`: Filter by collection
     - `collections`: Filter by collection, comma-separated
     - `name`: Filter by name
     - `tags`: Filter by tags, comma-separated
     - `creator`: Filter by creator
     - `hasUris`: Filter by presence of URIs
     - `includeFlagged`: Include flagged NFTs in the response
     - `withSupply`: Include supply information in the response
     - `source`: Filter by source
     - `excludeMetaESDT`: Exclude MetaESDTs from the response
     - `isScam`: Filter by scam status
     - `scamType`: Filter by scam type
     - `timestamp`: Filter by timestamp
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

2. `get_account_nfts_count`
   - Description: Returns the total number of NFTs/SFTs/MetaESDTs owned by the provided address
   - Parameters:
     - `address`: Account address (required)
     - Similar filtering options as `get_account_nfts`

3. `get_account_nft`
   - Description: Returns details about a specific NFT/SFT/MetaESDT owned by the provided address
   - Parameters:
     - `address`: Account address (required)
     - `identifier`: NFT identifier (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

### Collection Tools

1. `get_collections`
   - Description: Returns non-fungible/semi-fungible/meta-esdt collections
   - Parameters:
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `search`: Search by collection identifier
     - `identifiers`: Search by collection identifiers, comma-separated
     - `type`: Filter by type (NonFungibleESDT/SemiFungibleESDT/MetaESDT)
     - `subType`: Filter by type (NonFungibleESDTv2/DynamicNonFungibleESDT/DynamicSemiFungibleESDT)
     - `before`: Return all collections before given timestamp
     - `after`: Return all collections after given timestamp
     - `canCreate`: Filter by address with canCreate role
     - `canBurn`: Filter by address with canBurn role
     - `canAddQuantity`: Filter by address with canAddQuantity role
     - `canUpdateAttributes`: Filter by address with canUpdateAttributes role
     - `canAddUri`: Filter by address with canAddUri role
     - `canTransferRole`: Filter by address with canTransferRole role
     - `excludeMetaESDT`: Do not include collections of type "MetaESDT" in the response
     - `sort`: Sorting criteria ("timestamp" | "verifiedAndHolderCount")
     - `order`: Sorting order ("asc" | "desc")
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

2. `get_collection`
   - Description: Returns non-fungible/semi-fungible/meta-esdt collection details
   - Parameters:
     - `collection`: Collection identifier (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

### NFT Tools

1. `get_nfts`
   - Description: Returns a list of Non-Fungible / Semi-Fungible / MetaESDT tokens available on blockchain
   - Parameters:
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `search`: Search by collection identifier
     - `identifiers`: Search by token identifiers, comma-separated
     - `type`: Filter by type (NonFungibleESDT/SemiFungibleESDT)
     - `subType`: Filter by subType
     - `collection`: Get all tokens by token collection
     - `collections`: Get all tokens by token collections, comma-separated
     - `name`: Get all nfts by name
     - `tags`: Filter by one or more comma-separated tags
     - `creator`: Return all NFTs associated with a given creator
     - `isWhitelistedStorage`: Return all NFTs that are whitelisted in storage
     - `hasUris`: Return all NFTs that have one or more uris
     - `isNsfw`: Filter by NSFW status
     - `isScam`: Filter by scam status
     - `scamType`: Filter by scam type
     - `before`: Return all NFTs before given timestamp
     - `after`: Return all NFTs after given timestamp
     - `withOwner`: Return owner where type = NonFungibleESDT
     - `withSupply`: Return supply where type = SemiFungibleESDT
     - `withScamInfo`: Return scam info for the NFT
     - `computeScamInfo`: Compute scam info for the NFT
     - `sort`: Sort criteria
     - `order`: Sort order (asc/desc)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
     - `withRoles`: Returns roles for the NFT
     - `withRarities`: Returns rarities for the NFT
     - `rarityAlgorithm`: Rarity algorithm to use
     - `includeRarities`: Include specific rarities

2. `get_nft`
   - Description: Returns the details of a Non-Fungible / Semi-Fungible / MetaESDT token
   - Parameters:
     - `identifier`: Token identifier (required)
     - `withOwner`: Return owner of the NFT
     - `withSupply`: Return supply of the NFT
     - `withScamInfo`: Return scam info for the NFT
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

### Token Tools

1. `get_tokens`
   - Description: Returns all tokens available on the blockchain
   - Parameters:
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `type`: Token type ("FungibleESDT" | "NonFungibleESDT" | "SemiFungibleESDT" | "MetaESDT")
     - `search`: Search by collection identifier
     - `name`: Search by token name
     - `identifier`: Search by token identifier
     - `identifiers`: Search by multiple token identifiers, comma-separated
     - `sort`: Sorting criteria ("accounts" | "transactions" | "price" | "marketCap")
     - `order`: Sorting order ("asc" | "desc")
     - `includeMetaESDT`: Include MetaESDTs in response
     - `mexPairType`: Token Mex Pair
     - `priceSource`: Token Price Source ("dataApi" | "customUrl")
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

2. `get_token`
   - Description: Returns details for a specific token
   - Parameters:
     - `identifier`: Token identifier (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

### Transaction Tools

1. `get_transactions`
   - Description: Returns a list of transactions available on the blockchain
   - Parameters:
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `sender`: Address of the transaction sender
     - `receiver`: Search by multiple receiver addresses, comma-separated
     - `relayer`: Search by a relayer address
     - `token`: Identifier of the token
     - `senderShard`: Id of the shard the sender address belongs to
     - `receiverShard`: Id of the shard the receiver address belongs to
     - `miniBlockHash`: Filter by miniblock hash
     - `hashes`: Filter by a comma-separated list of transaction hashes
     - `status`: Filter by transaction status (success/pending/invalid/fail)
     - `function`: Filter by function name
     - `before`: Return transactions before given timestamp
     - `after`: Return transactions after given timestamp
     - `order`: Sort order (asc/desc)
     - `withScResults`: Return smart contract results for transactions
     - `withOperations`: Return operations for transactions
     - `withLogs`: Return logs for transactions
     - `withScamInfo`: Returns scam information
     - `withUsername`: Integrates username in assets for all addresses present in the transactions
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

2. `get_transaction`
   - Description: Returns transaction details for a given hash
   - Parameters:
     - `txHash`: Transaction hash (required)
     - `withResults`: Include transaction results
     - `withOperations`: Include transaction operations
     - `withLogs`: Include transaction logs
     - `withScamInfo`: Include scam information
     - `withUsername`: Integrates username in assets for all addresses present in the transaction
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

3. `send_transaction`
   - Description: Posts a signed transaction on the blockchain
   - Parameters:
     - Transaction details including chainId, data, gasLimit, gasPrice, nonce, receiver, sender, signature, value, version, etc.

4. `decode_transaction`
   - Description: Decodes the data field for a given transaction
   - Parameters:
     - `data`: Transaction data to decode (required)
     - `sender`: Sender address
     - `receiver`: Receiver address
