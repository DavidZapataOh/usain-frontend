import { YellowClient } from '@usain/sdk';
import { SDKError } from '@usain/sdk';
export class ChannelService {
    yellowClient;
    constructor() {
        const config = {
            apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000',
            wsUrl: process.env.WS_URL || 'ws://localhost:4000',
            envioHyperSyncUrl: process.env.ENVIO_HYPERSYNC_URL || 'https://base-sepolia.hypersync.xyz',
            envioGqlUri: process.env.ENVIO_GQL_URI || 'https://indexer.bigdevenergy.link/xxxxx/v1/graphql',
            litNetwork: process.env.LIT_NETWORK || 'datil-test',
            vincentPkpPublicKey: process.env.VINCENT_PKP_PUBLIC_KEY || '0x...',
            yellowRpcUrl: process.env.YELLOW_RPC_URL || 'https://sepolia.base.org',
            yellowNetwork: process.env.YELLOW_NETWORK || 'nitrolite',
            networks: [
                {
                    chainId: 84532,
                    name: 'base-sepolia',
                    rpcUrl: 'https://sepolia.base.org',
                    blockExplorer: 'https://sepolia.basescan.org',
                    settlementHubAddress: process.env.SETTLEMENT_HUB_ADDRESS || '0x0000000000000000000000000000000000000000',
                },
                {
                    chainId: 421614,
                    name: 'arbitrum-sepolia',
                    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
                    blockExplorer: 'https://sepolia.arbiscan.io',
                    settlementHubAddress: process.env.SETTLEMENT_HUB_ADDRESS || '0x0000000000000000000000000000000000000000',
                },
            ],
        };
        this.yellowClient = new YellowClient(config);
    }
    async getChannelStatus() {
        try {
            return await this.yellowClient.getChannelStatus();
        }
        catch (error) {
            throw new SDKError(`Failed to get channel status: ${error.message}`, 'CHANNEL_STATUS_ERROR', 500, { error: error.message });
        }
    }
    async openChannel(params) {
        try {
            return await this.yellowClient.openChannel(params);
        }
        catch (error) {
            throw new SDKError(`Failed to open channel: ${error.message}`, 'CHANNEL_OPEN_ERROR', 500, { params, error: error.message });
        }
    }
    async closeChannel(channelId) {
        try {
            const activeChannelId = channelId || (await this.yellowClient.getChannelStatus()).channelId;
            if (!activeChannelId) {
                throw new SDKError('No active channel to close', 'NO_ACTIVE_CHANNEL');
            }
            return await this.yellowClient.closeChannel(activeChannelId);
        }
        catch (error) {
            throw new SDKError(`Failed to close channel: ${error.message}`, 'CHANNEL_CLOSE_ERROR', 500, { channelId, error: error.message });
        }
    }
    async requestSettlement(channelId) {
        try {
            const activeChannelId = channelId || (await this.yellowClient.getChannelStatus()).channelId;
            if (!activeChannelId) {
                throw new SDKError('No active channel to settle', 'NO_ACTIVE_CHANNEL');
            }
            return await this.yellowClient.requestSettlement(activeChannelId);
        }
        catch (error) {
            throw new SDKError(`Failed to request settlement: ${error.message}`, 'SETTLEMENT_ERROR', 500, { channelId, error: error.message });
        }
    }
    async getChannelHistory(channelId) {
        try {
            const activeChannelId = channelId || (await this.yellowClient.getChannelStatus()).channelId;
            if (!activeChannelId) {
                return [];
            }
            return await this.yellowClient.getChannelHistory(activeChannelId);
        }
        catch (error) {
            throw new SDKError(`Failed to get channel history: ${error.message}`, 'CHANNEL_HISTORY_ERROR', 500, { channelId, error: error.message });
        }
    }
    async estimateSettlementGas(channelId) {
        try {
            const activeChannelId = channelId || (await this.yellowClient.getChannelStatus()).channelId;
            if (!activeChannelId) {
                throw new SDKError('No active channel to estimate', 'NO_ACTIVE_CHANNEL');
            }
            return await this.yellowClient.estimateSettlementGas(activeChannelId);
        }
        catch (error) {
            throw new SDKError(`Failed to estimate settlement gas: ${error.message}`, 'GAS_ESTIMATE_ERROR', 500, { channelId, error: error.message });
        }
    }
    async getNetworkStatus() {
        try {
            return await this.yellowClient.getNetworkStatus();
        }
        catch (error) {
            throw new SDKError(`Failed to get network status: ${error.message}`, 'NETWORK_STATUS_ERROR', 500, { error: error.message });
        }
    }
}
//# sourceMappingURL=ChannelService.js.map