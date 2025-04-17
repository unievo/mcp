# MultiversX API Collections MCP Server

This is a Model Context Protocol (MCP) server that provides tools for interacting with the MultiversX blockchain API, specifically focused on NFT collections and NFTs.

## Installation

The server can be used in any MCP client (AI agents, Chatbots, Coding agents, etc.)

For MCP clients that support MCP file configuration, add the following section under the `mcpServers` section:

## Using remote source with NPX

The easiest way to use the server is with the published NPM package and NPX.
The package will automatically be up to date with the latest version.

```json
{
  "mcpServers": {
    "mx-api-collections": {
      "command": "npx",
      "args": [
        "-y",
        "@unievo/mcp-mx-api-collections"
      ]
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

```bash
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
    "mx-api-collections": {
      "command": "node",
      "args": [
        "full/path/to/mcp/server/build/mx-api-collections.js"
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

// Using get_collections tool
{
  "name": "get_collections",
  "arguments": {
    "size": 10,
    "fields": ["collection", "name", "type", "ticker"]
  }
}

// Using get_collection tool
{
  "name": "get_collection",
  "arguments": {
    "collection": "MEDAL-ae074f",
    "fields": ["all"]
  }
}

// Using get_nft tool
{
  "name": "get_nft",
  "arguments": {
    "identifier": "MEDAL-ae074f-01",
    "withOwner": true,
    "fields": ["all"]
  }
}
```

## Tools

### Network Tools

1. `set_network`
   - Description: Set the MultiversX network to use (mainnet/testnet/devnet)
   - Parameters:
     - `network`: String enum ("mainnet" | "testnet" | "devnet")

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

2. `get_collections_count`
   - Description: Returns non-fungible/semi-fungible/meta-esdt collection count
   - Parameters:
     - `search`: Search by collection identifier
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

3. `get_collection`
   - Description: Returns non-fungible/semi-fungible/meta-esdt collection details
   - Parameters:
     - `collection`: Collection identifier (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

4. `get_collection_nfts`
   - Description: Returns non-fungible/semi-fungible/meta-esdt tokens that belong to a collection
   - Parameters:
     - `collection`: Collection identifier (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `search`: Search by collection identifier
     - `identifiers`: Search by token identifiers, comma-separated
     - `name`: Get all nfts by name
     - `tags`: Filter by one or more comma-separated tags
     - `creator`: Return all NFTs associated with a given creator
     - `isWhitelistedStorage`: Return all NFTs that are whitelisted in storage
     - `hasUris`: Return all NFTs that have one or more uris
     - `nonceBefore`: Return all NFTs with given nonce before the given number
     - `nonceAfter`: Return all NFTs with given nonce after the given number
     - `traits`: Filter NFTs by traits. Key-value format (key1:value1;key2:value2)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

5. `get_collection_nfts_count`
   - Description: Returns non-fungible/semi-fungible/meta-esdt token count that belong to a collection
   - Parameters:
     - `collection`: Collection identifier (required)

6. `get_collection_ranks`
   - Description: Returns NFT ranks in case the custom ranking preferred algorithm was set
   - Parameters:
     - `collection`: Collection identifier (required)

7. `get_collection_transactions`
   - Description: Returns a list of transactions for a specific collection
   - Parameters:
     - `collection`: Collection identifier (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `sender`: Address of the transaction sender
     - `receiver`: Search by multiple receiver addresses, comma-separated
     - `senderShard`: Filter by sender shard
     - `receiverShard`: Filter by receiver shard
     - `miniBlockHash`: Filter by miniblock hash
     - `hashes`: Filter by a comma-separated list of transaction hashes
     - `status`: Filter by a specific transaction status (success/pending/invalid/fail)
     - `function`: Filter transactions by function name
     - `before`: Before timestamp
     - `after`: After timestamp
     - `round`: Filter by round number
     - `order`: Sort order (asc/desc)
     - `withScResults`: Return scResults for transactions
     - `withOperations`: Return operations for transactions
     - `withLogs`: Return logs for transactions
     - `withScamInfo`: Returns scam information
     - `withUsername`: Integrates username in assets for all addresses present in the transactions
     - `withRelayedScresults`: If set to true, will include smart contract results that resemble relayed transactions
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

8. `get_collection_transfers`
   - Description: Returns a list of transfers for a specific collection
   - Parameters:
     - `collection`: Collection identifier (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `sender`: Address of the transfer sender
     - `receiver`: Search by multiple receiver addresses, comma-separated
     - `senderShard`: Filter by sender shard
     - `receiverShard`: Filter by receiver shard
     - `miniBlockHash`: Filter by miniblock hash
     - `hashes`: Filter by a comma-separated list of transaction hashes
     - `status`: Filter by a specific transaction status (success/pending/invalid/fail)
     - `function`: Filter transfers by function name
     - `before`: Before timestamp
     - `after`: After timestamp
     - `round`: Filter by round number
     - `order`: Sort order (asc/desc)
     - `withScamInfo`: Returns scam information
     - `withUsername`: Integrates username in assets for all addresses present in the transfers
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

9. `get_collection_transactions_count`
   - Description: Returns the total number of transactions for a specific collection
   - Parameters:
     - `collection`: Collection identifier (required)

10. `get_collection_transfers_count`
    - Description: Returns the total number of transfers for a specific collection
    - Parameters:
      - `collection`: Collection identifier (required)

11. `get_collection_accounts`
    - Description: Returns a list of addresses and balances for a specific collection
    - Parameters:
      - `identifier`: Collection identifier (required)
      - `from`: Number of items to skip for the result set
      - `size`: Number of items to retrieve

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
     - `search`: Search by collection identifier
     - `type`: Filter by type (NonFungibleESDT/SemiFungibleESDT/MetaESDT)
     - `subType`: Filter by type (NonFungibleESDTv2/DynamicNonFungibleESDT/DynamicSemiFungibleESDT)
     - `excludeMetaESDT`: Exclude collections of type "MetaESDT" in the response

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

2. `get_nfts_count`
   - Description: Returns the total number of Non-Fungible / Semi-Fungible / MetaESDT tokens
   - Parameters:
     - Similar filtering options as `get_nfts`

3. `get_nft`
   - Description: Returns the details of a Non-Fungible / Semi-Fungible / MetaESDT token
   - Parameters:
     - `identifier`: Token identifier (required)
     - `withOwner`: Return owner of the NFT
     - `withSupply`: Return supply of the NFT
     - `withScamInfo`: Return scam info for the NFT
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

4. `get_nft_accounts`
   - Description: Returns a list of addresses that hold a specific Non-Fungible / Semi-Fungible / MetaESDT token
   - Parameters:
     - `identifier`: Token identifier (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

5. `get_nft_accounts_count`
   - Description: Returns the total number of addresses that hold a specific Non-Fungible / Semi-Fungible / MetaESDT token
   - Parameters:
     - `identifier`: Token identifier (required)

6. `get_nft_supply`
   - Description: Returns the supply of a specific Non-Fungible / Semi-Fungible / MetaESDT token
   - Parameters:
     - `identifier`: Token identifier (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

7. `get_nft_transactions`
   - Description: Returns a list of transactions for a NonFungibleESDT or SemiFungibleESDT
   - Parameters:
     - `identifier`: Token identifier (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `sender`: Address of the transaction sender
     - `receiver`: Address of the transaction receiver
     - `senderShard`: Filter by sender shard
     - `receiverShard`: Filter by receiver shard
     - `miniBlockHash`: Filter by miniblock hash
     - `hashes`: Filter by a comma-separated list of transaction hashes
     - `status`: Filter by transaction status
     - `function`: Filter transactions by function name
     - `before`: Return transactions before given timestamp
     - `after`: Return transactions after given timestamp
     - `order`: Sort order (asc/desc)
     - `withScResults`: Return smart contract results for transactions
     - `withOperations`: Return operations for transactions
     - `withLogs`: Return logs for transactions
     - `withScamInfo`: Return scam info for transactions
     - `withUsername`: Integrates username in assets for all addresses present in the transactions
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

8. `get_nft_transactions_count`
   - Description: Returns the total number of transactions for a specific NonFungibleESDT or SemiFungibleESDT
   - Parameters:
     - `identifier`: Token identifier (required)
     - Similar filtering options as `get_nft_transactions`

9. `get_nft_transfers`
   - Description: Returns a list of transfers for a NonFungibleESDT or SemiFungibleESDT
   - Parameters:
     - `identifier`: Token identifier (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `sender`: Address of the transfer sender
     - `receiver`: Address of the transfer receiver
     - `senderShard`: Filter by sender shard
     - `receiverShard`: Filter by receiver shard
     - `miniBlockHash`: Filter by miniblock hash
     - `hashes`: Filter by a comma-separated list of transaction hashes
     - `status`: Filter by transfer status
     - `before`: Return transfers before given timestamp
     - `after`: Return transfers after given timestamp
     - `order`: Sort order (asc/desc)
     - `withUsername`: Integrates username in assets for all addresses present in the transfers
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields

10. `get_nft_transfers_count`
    - Description: Returns the total number of transfers for a specific NonFungibleESDT or SemiFungibleESDT
    - Parameters:
      - `identifier`: Token identifier (required)
      - Similar filtering options as `get_nft_transfers`

11. `process_nfts`
    - Description: Trigger NFT media/metadata reprocessing for collection owners
    - Parameters:
      - `collection`: Collection identifier for which to trigger reprocessing (required)
      - `identifier`: NFT identifier to process (required)
      - `forceRefreshMedia`: Force refresh media files (required)
      - `forceRefreshMetadata`: Force refresh metadata (required)
      - `forceRefreshThumbnail`: Force refresh thumbnail (required)
      - `skipRefreshThumbnail`: Skip refreshing thumbnail (required)
      - `uploadAsset`: Upload asset (required)
