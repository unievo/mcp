# MultiversX MCP Servers Library

Model Context Protocol (MCP) servers library for AI agents on the [MultiversX](https://multiversx.com/) networks.

## API MCP Servers - [mx-api](servers/mx-api)

These servers allow AI agents to read from and interact with the MultiversX blockchain API.

### Supported networks

- Mainnet - config value: mainnet
- Testnet - config value: testnet
- Devnet - config value: devnet
- Vibechain (VibeOX) - config value: vibeox
- Custom [configurable](/servers/mx-api/src/config.ts) network - config value: custom

An Index MCP server contains all tools from the specialized servers:

- [Index](servers/mx-api/README-index.md) : Includes all tools

An Essentials MCP server provides a reduced version of the full index server, for essential tools across multiple domains:

- [Essentials](servers/mx-api/README-essentials.md) : Includes essential tools across multiple domains

There are multiple MultiversX API MCP servers, each focused on a specific domain:

- [Accounts](servers/mx-api/README-accounts.md) : Account-related operations
- [Collections](servers/mx-api/README-collections.md) : NFT/SFT collections
- [Contracts](servers/mx-api/README-contracts.md) : Smart contracts
- [Network](servers/mx-api/README-network.md) : Network-related information
- [Roles](servers/mx-api/README-roles.md) : Account roles for collections and tokens
- [Tokens](servers/mx-api/README-tokens.md) : Fungible tokens
- [Transactions](servers/mx-api/README-transactions.md) : Blockchain transactions and transfers

There is also the posibility to construct custom MCP servers with any combination of tools.
