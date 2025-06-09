import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export * from './account/index.js';
export * from './collections.js';
export * from './network.js';
export * from './nfts.js';
export * from './tokens.js';
export * from './transactions.js';
export * from './transfers.js';

export const allTools = [
    ...accountsTools,
    ...accountCollectionTools,
    ...accountContractTools,
    ...accountDeferredTools,
    ...accountDelegationTools,
    ...accountEsdtHistoryTools,
    ...accountHistoryTools,
    ...accountKeysTools,
    ...accountNftsTools,
    ...accountRolesTools,
    ...accountStakeTools,
    ...accountTokensTools,
    ...accountTransactionsTools,
    ...accountTransfersTools,
    ...accountUpgradesTools,
    ...accountVerificationTools,
    ...accountWaitingListTools,
    ...applicationTools,
    ...collectionTools,
    ...identityTools,
    ...networkTools,
    ...nftTools,
    ...tokenTools,
    ...transactionTools,
    ...transferTools,
];

import { 
    accountsTools, 
    handleGetAccounts, 
    handleGetAccountsCount, 
    handleGetAccountDetails,
    accountCollectionTools,
    handleGetAccountCollections,
    handleGetAccountCollectionsCount,
    handleGetAccountCollection,
    accountContractTools,
    handleGetAccountDeploys,
    handleGetAccountDeploysCount,
    handleGetAccountScResult,
    handleGetAccountScResults,
    handleGetAccountScResultsCount,
    handleGetAccountContracts,
    handleGetAccountContractsCount,
    accountDeferredTools,
    handleGetAccountDeferred,
    accountDelegationTools,
    handleGetAccountDelegation,
    handleGetAccountDelegationLegacy,
    accountEsdtHistoryTools,
    handleGetAccountEsdtHistory,
    handleGetAccountEsdtHistoryCount,
    accountHistoryTools,
    handleGetAccountHistory,
    handleGetAccountHistoryCount,
    handleGetAccountTokenHistory,
    handleGetAccountTokenHistoryCount,
    accountKeysTools,
    handleGetAccountKeys,
    handleGetAccountKeysCount,
    accountNftsTools,
    handleGetAccountNfts,
    handleGetAccountNftsCount,
    handleGetAccountNft,
    accountRolesTools,
    handleGetAccountCollectionsWithRoles,
    handleGetCollectionsWithRolesCount,
    handleGetAccountCollectionWithRoles,
    handleGetAccountTokensWithRoles,
    handleGetTokensWithRolesCount,
    handleGetTokenWithRoles,
    accountStakeTools,
    handleGetAccountStake,
    accountTokensTools,
    handleGetAccountTokens,
    handleGetAccountTokensCount,
    handleGetAccountToken,
    accountTransactionsTools,
    handleGetAccountTransactions,
    handleGetAccountTransactionsCount,
    accountTransfersTools,
    handleGetAccountTransfers,
    handleGetAccountTransfersCount,
    accountUpgradesTools,
    handleGetAccountUpgrades,
    accountVerificationTools,
    handleGetAccountVerification,
    accountWaitingListTools,
    handleGetAccountWaitingList
} from './account/index.js';

import { 
    networkTools, 
    handleGetNetworkConstants, 
    handleGetNetworkEconomics, 
    handleGetNetworkStats, 
    handleGetAbout,
    handleGetDappConfig,
    handleGetWebsocketConfig,
    handleGetUsernameDetails
} from './network.js';

import { collectionTools, 
    handleGetCollections,
    handleGetCollectionsCount,  
    handleGetCollection,
    handleGetCollectionNfts,
    handleGetCollectionNftsCount,
    handleGetCollectionRanks,
    handleGetCollectionTransactions,
    handleGetCollectionTransactionsCount,
    handleGetCollectionTransfers,
    handleGetCollectionTransfersCount,
    handleGetCollectionAccounts
} from './collections.js';

import {
    identityTools,
    handleGetIdentities,
    handleGetIdentity,
    handleGetIdentityAvatar,
} from './identities.js';

import {
    nftTools,
    handleGetNfts,
    handleGetNftsCount,
    handleGetNft,
    handleGetNftAccounts,
    handleGetNftAccountsCount,
    handleGetNftSupply,
    handleGetNftTransactions,
    handleGetNftTransactionsCount,
    handleGetNftTransfers,
    handleGetNftTransfersCount,
    handleProcessNfts
} from './nfts.js';

import {
    applicationTools,
    handleGetApplications,
    handleGetApplicationsCount,
    handleGetApplication
} from './applications.js';

import {
    tokenTools,
    handleGetTokens,
    handleGetTokensCount,
    handleGetToken,
    handleGetTokenSupply,
    handleGetTokenAccounts,
    handleGetTokenAccountsCount,
    handleGetTokenTransactions,
    handleGetTokenTransactionsCount,
    handleGetTokenTransfers,
    handleGetTokenTransfersCount,
    handleGetTokenLogoPng,
    handleGetTokenLogoSvg
} from './tokens.js';

import {
    transactionTools,
    handleGetTransactions,
    handleGetTransactionsCount,
    handleGetTransaction,
    handleSendTransaction,
    handleDecodeTransaction
} from './transactions.js';

import {
    transferTools,
    handleGetTransfers,
    handleGetTransfersCount
} from './transfers.js';

export async function handleToolCalls(toolName: string, params: any): Promise<{ content: { type: string; text: string }[] }> {
    switch (toolName) {

        // Account tools
        case 'get-accounts':
            return handleGetAccounts(params);
        case 'get-accounts-count':
            return handleGetAccountsCount(params);
        case 'get-account-details':
            return handleGetAccountDetails(params);

        // Account collection tools
        case 'get-account-collections':
            return handleGetAccountCollections(params);
        case 'get-account-collections-count':
            return handleGetAccountCollectionsCount(params);
        case 'get-account-collection':
            return handleGetAccountCollection(params);

        // Account contract tools
        case 'get-account-contracts':
            return handleGetAccountContracts(params);
        case 'get-account-contracts-count':
            return handleGetAccountContractsCount(params);
        case 'get-account-deploys':
            return handleGetAccountDeploys(params);
        case 'get-account-deploys-count':
            return handleGetAccountDeploysCount(params);
        case 'get-account-sc-result':
            return handleGetAccountScResult(params);
        case 'get-account-sc-results':
            return handleGetAccountScResults(params);
        case 'get-account-sc-results-count':
            return handleGetAccountScResultsCount(params);

        // Account deferred tools
        case 'get-account-deferred':
            return handleGetAccountDeferred(params);

        // Account delegation tools
        case 'get-account-delegation':
            return handleGetAccountDelegation(params);
        case 'get-account-delegation-legacy':
            return handleGetAccountDelegationLegacy(params);

        // Account ESDT history tools
        case 'get-account-esdt-history':
            return handleGetAccountEsdtHistory(params);
        case 'get-account-esdt-history-count':
            return handleGetAccountEsdtHistoryCount(params);

        // Account history tools
        case 'get-account-history':
            return handleGetAccountHistory(params);
        case 'get-account-history-count':
            return handleGetAccountHistoryCount(params);
        case 'get-account-token-history':
            return handleGetAccountTokenHistory(params);
        case 'get-account-token-history-count':
            return handleGetAccountTokenHistoryCount(params);

        // Account keys tools
        case 'get-account-keys':
            return handleGetAccountKeys(params);
        case 'get-account-keys-count':
            return handleGetAccountKeysCount(params);

        // Account NFTs tools
        case 'get-account-nfts':
            return handleGetAccountNfts(params);
        case 'get-account-nfts-count':
            return handleGetAccountNftsCount(params);
        case 'get-account-nft':
            return handleGetAccountNft(params);

        // Account roles tools
        case 'get-account-collections-with-roles':
            return handleGetAccountCollectionsWithRoles(params);
        case 'get-collections-with-roles-count':
            return handleGetCollectionsWithRolesCount(params);
        case 'get-account-collection-with-roles':
            return handleGetAccountCollectionWithRoles(params);
        case 'get-account-tokens-with-roles':
            return handleGetAccountTokensWithRoles(params);
        case 'get-tokens-with-roles-count':
            return handleGetTokensWithRolesCount(params);
        case 'get-token-with-roles':
            return handleGetTokenWithRoles(params);

        // Account stake tools
        case 'get-account-stake':
            return handleGetAccountStake(params);

        // Account tokens tools
        case 'get-account-tokens':
            return handleGetAccountTokens(params);
        case 'get-account-tokens-count':
            return handleGetAccountTokensCount(params);
        case 'get-account-token':
            return handleGetAccountToken(params);

        // Account transactions tools
        case 'get-account-transactions':
            return handleGetAccountTransactions(params);
        case 'get-account-transactions-count':
            return handleGetAccountTransactionsCount(params);

        // Account transfers tools
        case 'get-account-transfers':
            return handleGetAccountTransfers(params);
        case 'get-account-transfers-count':
            return handleGetAccountTransfersCount(params);

        // Account upgrades tools
        case 'get-account-upgrades':
            return handleGetAccountUpgrades(params);

        // Account verification tools
        case 'get-account-verification':
            return handleGetAccountVerification(params);

        // Account waiting list tools
        case 'get-account-waiting-list':
            return handleGetAccountWaitingList(params);

        // Collection tools
        case 'get-collections':
            return handleGetCollections(params);
        case 'get-collections-count':
            return handleGetCollectionsCount(params);
        case 'get-collection':
            return handleGetCollection(params);
        case 'get-collection-accounts':
            return handleGetCollectionAccounts(params);
        case 'get-collection-nfts':
            return handleGetCollectionNfts(params);
        case 'get-collection-nfts-count':
            return handleGetCollectionNftsCount(params);
        case 'get-collection-ranks':
            return handleGetCollectionRanks(params);
        case 'get-collection-transactions':
            return handleGetCollectionTransactions(params);
        case 'get-collection-transactions-count':
            return handleGetCollectionTransactionsCount(params);
        case 'get-collection-transfers':
            return handleGetCollectionTransfers(params);
        case 'get-collection-transfers-count':
            return handleGetCollectionTransfersCount(params);

        // Identity tools
        case 'get-identities':
            return handleGetIdentities(params);
        case 'get-identity':
            return handleGetIdentity(params);
        case 'get-identity-avatar':
            return handleGetIdentityAvatar(params);

        // Network tools
        case 'get-network-constants':
            return handleGetNetworkConstants(params);
        case 'get-network-economics':
            return handleGetNetworkEconomics(params);
        case 'get-network-stats':
            return handleGetNetworkStats(params);
        case 'get-about':
            return handleGetAbout(params);
        case 'get-dapp-config':
            return handleGetDappConfig(params);
        case 'get-websocket-config':
            return handleGetWebsocketConfig();
        case 'get-username-details':
            return handleGetUsernameDetails(params);

        // NFT tools
        case 'get-nfts':
            return handleGetNfts(params);
        case 'get-nfts-count':
            return handleGetNftsCount(params);
        case 'get-nft':
            return handleGetNft(params);
        case 'get-nft-accounts':
            return handleGetNftAccounts(params);
        case 'get-nft-accounts-count':
            return handleGetNftAccountsCount(params);
        case 'get-nft-supply':
            return handleGetNftSupply(params);
        case 'get-nft-transactions':
            return handleGetNftTransactions(params);
        case 'get-nft-transactions-count':
            return handleGetNftTransactionsCount(params);
        case 'get-nft-transfers':
            return handleGetNftTransfers(params);
        case 'get-nft-transfers-count':
            return handleGetNftTransfersCount(params);
        case 'process-nfts':
            return handleProcessNfts(params);

        // Application tools
        case 'get-applications':
            return handleGetApplications(params);
        case 'get-applications-count':
            return handleGetApplicationsCount(params);
        case 'get-application':
            return handleGetApplication(params);

        // Token tools
        case 'get-tokens':
            return handleGetTokens(params);
        case 'get-tokens-count':
            return handleGetTokensCount(params);
        case 'get-token':
            return handleGetToken(params);
        case 'get-token-supply':
            return handleGetTokenSupply(params);
        case 'get-token-accounts':
            return handleGetTokenAccounts(params);
        case 'get-token-accounts-count':
            return handleGetTokenAccountsCount(params);
        case 'get-token-transactions':
            return handleGetTokenTransactions(params);
        case 'get-token-transactions-count':
            return handleGetTokenTransactionsCount(params);
        case 'get-token-transfers':
            return handleGetTokenTransfers(params);
        case 'get-token-transfers-count':
            return handleGetTokenTransfersCount(params);
        case 'get-token-logo-png':
            return handleGetTokenLogoPng(params);
        case 'get-token-logo-svg':
            return handleGetTokenLogoSvg(params);

        // Transaction tools
        case 'get-transactions':
            return handleGetTransactions(params);
        case 'get-transactions-count':
            return handleGetTransactionsCount(params);
        case 'get-transaction':
            return handleGetTransaction(params);
        case 'send-transaction':
            return handleSendTransaction(params);
        case 'decode-transaction':
            return handleDecodeTransaction(params);

        // Transfer tools
        case 'get-transfers':
            return handleGetTransfers(params);
        case 'get-transfers-count':
            return handleGetTransfersCount(params);

        default:
            throw new McpError(ErrorCode.InvalidParams, `Unknown tool: ${toolName}`);
    }
}
