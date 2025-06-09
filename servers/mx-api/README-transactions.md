# MultiversX API Transactions MCP Server

This Model Context Protocol (MCP) server provides tools for interacting with the MultiversX blockchain API, specifically focused on transactions and transfers.

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
    "mx-api-transactions": {
      "command": "npx",
      "args": [
        "-y",
        "@unievo/mcp-mx-api-transactions"
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
    "mx-api-transactions": {
      "command": "node",
      "args": [
        "{full/path/to/mcp/server}/build/mx-api-transactions.js"
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

// Using get-transactions tool
{
  "name": "get-transactions",
  "arguments": {
    "from": 0,
    "size": 10,
    "fields": ["txHash", "sender", "receiver", "value", "status"]
  }
}

// Using get-account-transactions tool
{
  "name": "get-account-transactions",
  "arguments": {
    "address": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "from": 0,
    "size": 10,
    "fields": ["all"]
  }
}

// Using send-transaction tool
{
  "name": "send-transaction",
  "arguments": {
    "chainId": "1",
    "data": "dGVzdA==",
    "gasLimit": 70000,
    "gasPrice": 1000000000,
    "nonce": 5,
    "receiver": "erd1qqqqqqqqqqqqqpgqd77fnev2sthnczp2lnfx0y5jdycynjfhzzgq6p3rax",
    "sender": "erd1spyavw0956vq68xj8y4tenjpq2wd5a9p2c6j8gsz7ztyrnpxrruqzu66jx",
    "signature": "ed25519signature",
    "value": "0",
    "version": 1
  }
}
```

## Understanding Transactions and Transfers

In the MultiversX ecosystem, there are different types of transactions and transfers:

1. **Transactions**: These are operations initiated by user accounts. They can transfer value, call smart contracts, or perform other blockchain operations.

2. **Smart Contract Results**: These are transfers triggered by smart contracts as a result of executing a transaction.

3. **Transfers**: This is a more general term that includes both user-initiated transactions and smart contract results.

The API provides tools to query both types separately or together, allowing for flexible data retrieval based on your needs.

## Tools

### Network Tools

1. `set-network`
   - Description: Set the MultiversX network to use
   - Parameters:
     - `network`: String

### Transaction Tools

1. `get-transactions`
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
     - `hashes`: Array of strings, filter by transaction hashes
     - `status`: Status of the transaction ("success" | "pending" | "invalid" | "fail")
     - `function`: Array of strings, filter transactions by function name
     - `before`: Before timestamp
     - `after`: After timestamp
     - `round`: Round number
     - `order`: Sorting order ("asc" | "desc")
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
     - `withScResults`: Return results for transactions
     - `withOperations`: Return operations for transactions
     - `withLogs`: Return logs for transactions
     - `withScamInfo`: Returns scam information
     - `withUsername`: Integrates username in assets for all addresses present in the transactions
     - `withBlockInfo`: Returns sender / receiver block details
     - `isRelayed`: Returns relayed transactions details
     - `isScCall`: Returns sc call transactions details
     - `withActionTransferValue`: Returns value in USD and network token for transferred tokens within the action attribute
     - `withRelayedScresults`: If set to true, will include smart contract results that resemble relayed transactions
   - Returns: List of transactions matching the specified criteria

2. `get-transactions-count`
   - Description: Returns the total number of transactions
   - Parameters:
     - `sender`: Address of the transaction sender
     - `receiver`: Array of strings, search by multiple receiver addresses
     - `relayer`: Search by a relayer address
     - `token`: Identifier of the token
     - `senderShard`: Id of the shard the sender address belongs to
     - `receiverShard`: Id of the shard the receiver address belongs to
     - `miniBlockHash`: Filter by miniblock hash
     - `hashes`: Array of strings, filter by transaction hashes
     - `status`: Status of the transaction ("success" | "pending" | "invalid" | "fail")
     - `function`: Array of strings, filter transactions by function name
     - `before`: Before timestamp
     - `after`: After timestamp
     - `round`: Round number
     - `isRelayed`: Returns relayed transactions details
     - `isScCall`: Returns sc call transactions details
     - `withRelayedScresults`: If set to true, will include smart contract results that resemble relayed transactions
   - Returns: Count of transactions matching the specified criteria

3. `get-transaction`
   - Description: Returns the details of a transaction
   - Parameters:
     - `txHash`: Transaction hash (required)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
     - `withResults`: Include smart contract results
     - `withOperations`: Include operations
     - `withLogs`: Include logs
     - `withScamInfo`: Include scam info
     - `withUsername`: Include username
     - `withActionTransferValue`: Returns value in USD and network token for transferred tokens within the action attribute
   - Returns: Detailed information about a specific transaction

4. `send-transaction`
   - Description: Posts a signed transaction on the blockchain
   - Parameters:
     - `chainId`: Chain identifier (required)
     - `data`: Transaction data (base64 encoded) (required)
     - `gasLimit`: Gas limit for the transaction (required)
     - `gasPrice`: Gas price for the transaction (required)
     - `nonce`: Sender account nonce (required)
     - `receiver`: Transaction receiver address (required)
     - `sender`: Transaction sender address (required)
     - `signature`: Transaction signature (required)
     - `value`: Transaction value (required)
     - `version`: Transaction version (required)
     - `options`: Transaction options
     - `guardian`: Guardian address
     - `guardianSignature`: Guardian signature
   - Returns: Transaction hash and status information

5. `decode-transaction`
   - Description: Decodes transaction action, given a minimum set of transaction details
   - Parameters:
     - `data`: Transaction data (base64 encoded) (required)
     - `receiver`: Transaction receiver address (required)
     - `sender`: Transaction sender address (required)
     - `value`: Transaction value (required)
   - Returns: Decoded transaction action information

### Account Transaction Tools

1. `get-account-transactions`
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
     - `withBlockInfo`: Returns sender / receiver block details
     - `senderOrReceiver`: One address that current address interacted with
     - `isRelayed`: Returns isRelayed transactions details
     - `isScCall`: Returns sc call transactions details
     - `withActionTransferValue`: Returns value in USD and EGLD for transferred tokens within the action attribute
     - `withRelayedScresults`: If set to true, will include smart contract results that resemble relayed transactions
     - `computeScamInfo`: Compute scam information for transactions
   - Returns: List of transactions for the specified account

2. `get-account-transactions-count`
   - Description: Returns total number of transactions for a given address where the account is sender or receiver
   - Parameters:
     - `address`: Account address (required)
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
     - `senderOrReceiver`: One address that current address interacted with
     - `isRelayed`: Returns isRelayed transactions details
     - `isScCall`: Returns sc call transactions details
     - `withRelayedScresults`: If set to true, will include smart contract results that resemble relayed transactions
   - Returns: Count of transactions for the specified account

### Transfer Tools

1. `get-transfers`
   - Description: Returns both transfers triggered by a user account (type = Transaction), as well as transfers triggered by smart contracts (type = SmartContractResult)
   - Parameters:
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `receiver`: Array of strings, search by multiple receiver addresses
     - `sender`: Array of strings, search by multiple sender addresses
     - `token`: Identifier of the token
     - `function`: Array of strings, filter transfers by function name
     - `senderShard`: Id of the shard the sender address belongs to
     - `receiverShard`: Id of the shard the receiver address belongs to
     - `miniBlockHash`: Filter by miniblock hash
     - `hashes`: Array of strings, filter by transfer hashes
     - `status`: Status of the transaction ("success" | "pending" | "invalid" | "fail")
     - `before`: Before timestamp
     - `after`: After timestamp
     - `round`: Round number
     - `order`: Sort order (asc/desc)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
     - `relayer`: Filter by relayer address
     - `isRelayed`: Returns relayed transactions details
     - `isScCall`: Returns smart contract calls
     - `withScamInfo`: Returns scam information
     - `withUsername`: Integrates username in assets for all addresses present in the transfers
     - `withBlockInfo`: Returns sender / receiver block details
   - Returns: List of transfers matching the specified criteria

2. `get-transfers-count`
   - Description: Return total count of transfers triggered by a user account (type = Transaction), as well as transfers triggered by smart contracts (type = SmartContractResult)
   - Parameters:
     - `receiver`: Array of strings, search by multiple receiver addresses
     - `sender`: Array of strings, search by multiple sender addresses
     - `token`: Identifier of the token
     - `function`: Array of strings, filter transfers by function name
     - `senderShard`: Id of the shard the sender address belongs to
     - `receiverShard`: Id of the shard the receiver address belongs to
     - `miniBlockHash`: Filter by miniblock hash
     - `status`: Status of the transaction ("success" | "pending" | "invalid" | "fail")
     - `before`: Before timestamp
     - `after`: After timestamp
     - `round`: Round number
   - Returns: Count of transfers matching the specified criteria

### Account Transfer Tools

1. `get-account-transfers`
   - Description: Returns both transfers triggered by a user account (type = Transaction), as well as transfers triggered by smart contracts (type = SmartContractResult)
   - Parameters:
     - `address`: Account address (required)
     - `from`: Number of items to skip for the result set
     - `size`: Number of items to retrieve
     - `sender`: Address of the transfer sender or multiple senders (comma-separated)
     - `receiver`: Address of the transfer receiver or multiple receivers (comma-separated)
     - `token`: Identifier of the token
     - `senderShard`: Id of the shard the sender address belongs to
     - `receiverShard`: Id of the shard the receiver address belongs to
     - `miniBlockHash`: Filter by miniblock hash
     - `hashes`: Filter by a comma-separated list of transfer hashes
     - `status`: Status of the transaction (success/pending/invalid/fail)
     - `function`: Filter by function name or multiple function names (comma-separated)
     - `before`: Return transfers before given timestamp
     - `after`: Return transfers after given timestamp
     - `round`: Filter by round number
     - `order`: Sort order (asc/desc)
     - `fields`: Array of strings, fields to retrieve. Use "all" for all fields
     - `relayer`: Address of the relayer
     - `withScamInfo`: Returns scam information
     - `withUsername`: Integrates username in assets for all addresses present in the transactions
     - `withBlockInfo`: Returns sender / receiver block details
     - `senderOrReceiver`: One address that current address interacted with
   - Returns: List of transfers for the specified account

2. `get-account-transfers-count`
   - Description: Returns total number of transfers for a given address
   - Parameters:
     - `address`: Account address (required)
     - `sender`: Address of the transfer sender
     - `receiver`: Address of the transfer receiver
     - `token`: Identifier of the token
     - `senderShard`: Id of the shard the sender address belongs to
     - `receiverShard`: Id of the shard the receiver address belongs to
     - `miniBlockHash`: Filter by miniblock hash
     - `status`: Status of the transaction (success/pending/invalid/fail)
     - `function`: Filter by function name
     - `before`: Return transfers before given timestamp
     - `after`: Return transfers after given timestamp
     - `senderOrReceiver`: One address that current address interacted with
   - Returns: Count of transfers for the specified account
