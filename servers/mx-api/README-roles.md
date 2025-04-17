# MultiversX API Roles MCP Server

This is a Model Context Protocol (MCP) server that provides tools for interacting with the MultiversX blockchain API, specifically focused on account roles for tokens and collections.

## Installation

The server can be used in any MCP client (AI agents, Chatbots, Coding agents, etc.)

For MCP clients that support MCP file configuration, add the following section under the `mcpServers` section:

## Using remote source with NPX

The easiest way to use the server is with the published NPM package and NPX.
The package will automatically be up to date with the latest version.

```json
{
  "mcpServers": {
    "mx-api-roles": {
      "command": "npx",
      "args": [
        "-y",
        "@unievo/mcp-mx-api-roles"
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
    "mx-api-roles": {
      "command": "node",
      "args": [
        "full/path/to/mcp/server/build/mx-api-roles.js"
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

// Using get_account_collections_with_roles tool
{
  "name": "get_account_collections_with_roles",
  "arguments": {
    "address": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "fields": ["collection", "name", "type", "canCreate", "canBurn"]
  }
}

// Using get_account_tokens_with_roles tool
{
  "name": "get_account_tokens_with_roles",
  "arguments": {
    "address": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "fields": ["identifier", "name", "canMint", "canBurn"]
  }
}

// Using get_token_with_roles tool
{
  "name": "get_token_with_roles",
  "arguments": {
    "address": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "identifier": "WEGLD-bd4d79",
    "fields": ["all"]
  }
}
```

## Understanding Roles

In the MultiversX ecosystem, tokens and collections can have various roles assigned to addresses:

### Collection Roles

- `canCreate`: Allows creating new NFTs in the collection
- `canBurn`: Allows burning NFTs from the collection
- `canAddQuantity`: Allows adding quantity to Semi-Fungible tokens
- `canUpdateAttributes`: Allows updating NFT attributes
- `canAddUri`: Allows adding URIs to NFTs
- `canTransferRole`: Allows transferring roles to other addresses

### Token Roles

- `canMint`: Allows minting new tokens
- `canBurn`: Allows burning tokens
- `canPause`: Allows pausing token operations
- `canFreeze`: Allows freezing tokens for specific addresses
- `canWipe`: Allows wiping tokens from addresses
- `canChangeOwner`: Allows changing the token owner
- `canUpgrade`: Allows upgrading the token properties
- `canAddSpecialRoles`: Allows adding special roles to addresses

These roles are essential for managing tokens and collections on the MultiversX blockchain, and this API allows querying which roles are assigned to specific addresses.

## Tools

### Network Tools

1. `set_network`
   - Description: Set the MultiversX network to use (mainnet/testnet/devnet)
   - Parameters:
     - `network`: String enum ("mainnet" | "testnet" | "devnet")

### Account Roles Tools

1. `get_account_collections_with_roles`
   - Description: Returns NFT/SFT/MetaESDT collections where the account is owner or has some special roles assigned to it
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `search`: Search query
     - `type`: Collection type
     - `subType`: Collection sub-type
     - `owner`: Collection owner
     - `canCreate`: Filter by canCreate role
     - `canBurn`: Filter by canBurn role
     - `canAddQuantity`: Filter by canAddQuantity role
     - `canUpdateAttributes`: Filter by canUpdateAttributes role
     - `canAddUri`: Filter by canAddUri role
     - `canTransferRole`: Filter by canTransferRole role
     - `excludeMetaESDT`: Exclude MetaESDT collections
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: List of collections with roles including details such as collection identifier, name, type, ticker, owner, and role flags

2. `get_collections_with_roles_count`
   - Description: Returns the total number of NFT/SFT/MetaESDT collections where the account is owner or has some special roles assigned to it
   - Parameters:
     - `address`: Account address (required)
     - `search`: Search query
     - `type`: Collection type
     - `subType`: Collection sub-type
     - `owner`: Collection owner
     - `canCreate`: Filter by canCreate role
     - `canBurn`: Filter by canBurn role
     - `canAddQuantity`: Filter by canAddQuantity role
     - `canUpdateAttributes`: Filter by canUpdateAttributes role
     - `canAddUri`: Filter by canAddUri role
     - `canTransferRole`: Filter by canTransferRole role
     - `excludeMetaESDT`: Exclude MetaESDT collections
   - Returns: Count of collections with roles

3. `get_account_collection_with_roles`
   - Description: Returns details about a specific NFT/SFT/MetaESDT collection from a given address
   - Parameters:
     - `address`: Account address (required)
     - `collection`: Collection identifier (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Detailed information about a specific collection with roles

4. `get_account_tokens_with_roles`
   - Description: Returns fungible token roles where the account is owner or has some special roles assigned to it
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `search`: Search query
     - `owner`: Token owner
     - `canMint`: Filter by canMint role
     - `canBurn`: Filter by canBurn role
     - `includeMetaESDT`: Include MetaESDT tokens
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: List of tokens with roles including details such as identifier, name, type, ticker, owner, and role flags

5. `get_tokens_with_roles_count`
   - Description: Returns the total number of fungible token roles where the account is owner or has some special roles assigned to it
   - Parameters:
     - `address`: Account address (required)
     - `search`: Search query
     - `owner`: Token owner
     - `canMint`: Filter by canMint role
     - `canBurn`: Filter by canBurn role
     - `includeMetaESDT`: Include MetaESDT tokens
   - Returns: Count of tokens with roles

6. `get_token_with_roles`
   - Description: Returns details about fungible token roles where the account is owner or has some special roles assigned to it
   - Parameters:
     - `address`: Account address (required)
     - `identifier`: Token identifier (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
   - Returns: Detailed information about a specific token with roles
