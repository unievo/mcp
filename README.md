# Model Context Protocol (MCP) Library

Model Context Protocol (MCP) library that provides resources and tools for AI agents (Chatbots, Coding agents, etc.) to understand and interact with domains specific tools and knowledge.

## [MultiversX](https://multiversx.com/) - the EGLD Network

### 1. API Service MCP Servers - [mx-api](servers/mx-api)

These servers allow AI agents to read from and interact with the MultiversX blockchain API.

There are multiple MultiversX API MCP servers, each focused on a specific domain:

- [Accounts](servers/mx-api/README-accounts.md) : Focus on account-related operations
- [Collections](servers/mx-api/README-collections.md) : Focus on NFT/SFT collections
- [Contracts](servers/mx-api/README-contracts.md) : Focus on smart contracts
- [Network](servers/mx-api/README-network.md) : Focus on network-related information
- [Tokens](servers/mx-api/README-tokens.md) : Focus on fungible tokens
- [Transactions](servers/mx-api/README-transactions.md) : Focus on blockchain transactions and transfers
- [Roles](servers/mx-api/README-roles.md) : Focus on account roles for collections and tokens

An Index MCP server contains all tools from the specialized servers:

- [Index](servers/mx-api/README-index.md) : Includes all tools

An Essentials MCP server provides a reduced version of the full index server, for essential tools across multiple domains:

- [Essentials](servers/mx-api/README-essentials.md) : Includes essential tools across multiple domains

There is also the posibility to construct custom MCP servers with any combination of tools.
