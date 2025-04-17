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
        case 'get_accounts':
            return handleGetAccounts(params);
        case 'get_accounts_count':
            return handleGetAccountsCount(params);
        case 'get_account_details':
            return handleGetAccountDetails(params);

        // Account collection tools
        case 'get_account_collections':
            return handleGetAccountCollections(params);
        case 'get_account_collections_count':
            return handleGetAccountCollectionsCount(params);
        case 'get_account_collection':
            return handleGetAccountCollection(params);

        // Account contract tools
        case 'get_account_contracts':
            return handleGetAccountContracts(params);
        case 'get_account_contracts_count':
            return handleGetAccountContractsCount(params);
        case 'get_account_deploys':
            return handleGetAccountDeploys(params);
        case 'get_account_deploys_count':
            return handleGetAccountDeploysCount(params);
        case 'get_account_sc_result':
            return handleGetAccountScResult(params);
        case 'get_account_sc_results':
            return handleGetAccountScResults(params);
        case 'get_account_sc_results_count':
            return handleGetAccountScResultsCount(params);

        // Account deferred tools
        case 'get_account_deferred':
            return handleGetAccountDeferred(params);

        // Account delegation tools
        case 'get_account_delegation':
            return handleGetAccountDelegation(params);
        case 'get_account_delegation_legacy':
            return handleGetAccountDelegationLegacy(params);

        // Account ESDT history tools
        case 'get_account_esdt_history':
            return handleGetAccountEsdtHistory(params);
        case 'get_account_esdt_history_count':
            return handleGetAccountEsdtHistoryCount(params);

        // Account history tools
        case 'get_account_history':
            return handleGetAccountHistory(params);
        case 'get_account_history_count':
            return handleGetAccountHistoryCount(params);
        case 'get_account_token_history':
            return handleGetAccountTokenHistory(params);
        case 'get_account_token_history_count':
            return handleGetAccountTokenHistoryCount(params);

        // Account keys tools
        case 'get_account_keys':
            return handleGetAccountKeys(params);
        case 'get_account_keys_count':
            return handleGetAccountKeysCount(params);

        // Account NFTs tools
        case 'get_account_nfts':
            return handleGetAccountNfts(params);
        case 'get_account_nfts_count':
            return handleGetAccountNftsCount(params);
        case 'get_account_nft':
            return handleGetAccountNft(params);

        // Account roles tools
        case 'get_account_collections_with_roles':
            return handleGetAccountCollectionsWithRoles(params);
        case 'get_collections_with_roles_count':
            return handleGetCollectionsWithRolesCount(params);
        case 'get_account_collection_with_roles':
            return handleGetAccountCollectionWithRoles(params);
        case 'get_account_tokens_with_roles':
            return handleGetAccountTokensWithRoles(params);
        case 'get_tokens_with_roles_count':
            return handleGetTokensWithRolesCount(params);
        case 'get_token_with_roles':
            return handleGetTokenWithRoles(params);

        // Account stake tools
        case 'get_account_stake':
            return handleGetAccountStake(params);

        // Account tokens tools
        case 'get_account_tokens':
            return handleGetAccountTokens(params);
        case 'get_account_tokens_count':
            return handleGetAccountTokensCount(params);
        case 'get_account_token':
            return handleGetAccountToken(params);

        // Account transactions tools
        case 'get_account_transactions':
            return handleGetAccountTransactions(params);
        case 'get_account_transactions_count':
            return handleGetAccountTransactionsCount(params);

        // Account transfers tools
        case 'get_account_transfers':
            return handleGetAccountTransfers(params);
        case 'get_account_transfers_count':
            return handleGetAccountTransfersCount(params);

        // Account upgrades tools
        case 'get_account_upgrades':
            return handleGetAccountUpgrades(params);

        // Account verification tools
        case 'get_account_verification':
            return handleGetAccountVerification(params);

        // Account waiting list tools
        case 'get_account_waiting_list':
            return handleGetAccountWaitingList(params);

        // Collection tools
        case 'get_collections':
            return handleGetCollections(params);
        case 'get_collections_count':
            return handleGetCollectionsCount(params);
        case 'get_collection':
            return handleGetCollection(params);
        case 'get_collection_accounts':
            return handleGetCollectionAccounts(params);
        case 'get_collection_nfts':
            return handleGetCollectionNfts(params);
        case 'get_collection_nfts_count':
            return handleGetCollectionNftsCount(params);
        case 'get_collection_ranks':
            return handleGetCollectionRanks(params);
        case 'get_collection_transactions':
            return handleGetCollectionTransactions(params);
        case 'get_collection_transactions_count':
            return handleGetCollectionTransactionsCount(params);
        case 'get_collection_transfers':
            return handleGetCollectionTransfers(params);
        case 'get_collection_transfers_count':
            return handleGetCollectionTransfersCount(params);

        // Identity tools
        case 'get_identities':
            return handleGetIdentities(params);
        case 'get_identity':
            return handleGetIdentity(params);
        case 'get_identity_avatar':
            return handleGetIdentityAvatar(params);

        // Network tools
        case 'get_network_constants':
            return handleGetNetworkConstants(params);
        case 'get_network_economics':
            return handleGetNetworkEconomics(params);
        case 'get_network_stats':
            return handleGetNetworkStats(params);
        case 'get_about':
            return handleGetAbout(params);
        case 'get_dapp_config':
            return handleGetDappConfig(params);
        case 'get_websocket_config':
            return handleGetWebsocketConfig();
        case 'get_username_details':
            return handleGetUsernameDetails(params);

        // NFT tools
        case 'get_nfts':
            return handleGetNfts(params);
        case 'get_nfts_count':
            return handleGetNftsCount(params);
        case 'get_nft':
            return handleGetNft(params);
        case 'get_nft_accounts':
            return handleGetNftAccounts(params);
        case 'get_nft_accounts_count':
            return handleGetNftAccountsCount(params);
        case 'get_nft_supply':
            return handleGetNftSupply(params);
        case 'get_nft_transactions':
            return handleGetNftTransactions(params);
        case 'get_nft_transactions_count':
            return handleGetNftTransactionsCount(params);
        case 'get_nft_transfers':
            return handleGetNftTransfers(params);
        case 'get_nft_transfers_count':
            return handleGetNftTransfersCount(params);
        case 'process_nfts':
            return handleProcessNfts(params);

        // Application tools
        case 'get_applications':
            return handleGetApplications(params);
        case 'get_applications_count':
            return handleGetApplicationsCount(params);
        case 'get_application':
            return handleGetApplication(params);

        // Token tools
        case 'get_tokens':
            return handleGetTokens(params);
        case 'get_tokens_count':
            return handleGetTokensCount(params);
        case 'get_token':
            return handleGetToken(params);
        case 'get_token_supply':
            return handleGetTokenSupply(params);
        case 'get_token_accounts':
            return handleGetTokenAccounts(params);
        case 'get_token_accounts_count':
            return handleGetTokenAccountsCount(params);
        case 'get_token_transactions':
            return handleGetTokenTransactions(params);
        case 'get_token_transactions_count':
            return handleGetTokenTransactionsCount(params);
        case 'get_token_transfers':
            return handleGetTokenTransfers(params);
        case 'get_token_transfers_count':
            return handleGetTokenTransfersCount(params);
        case 'get_token_logo_png':
            return handleGetTokenLogoPng(params);
        case 'get_token_logo_svg':
            return handleGetTokenLogoSvg(params);

        // Transaction tools
        case 'get_transactions':
            return handleGetTransactions(params);
        case 'get_transactions_count':
            return handleGetTransactionsCount(params);
        case 'get_transaction':
            return handleGetTransaction(params);
        case 'send_transaction':
            return handleSendTransaction(params);
        case 'decode_transaction':
            return handleDecodeTransaction(params);

        // Transfer tools
        case 'get_transfers':
            return handleGetTransfers(params);
        case 'get_transfers_count':
            return handleGetTransfersCount(params);

        default:
            throw new McpError(ErrorCode.InvalidParams, `Unknown tool: ${toolName}`);
    }
}
