import { YellowClient } from '@usain/sdk';
import { 
  ChannelStatus,
  ClientConfig,
  SDKError 
} from '@usain/sdk';

export class ChannelService {
  private yellowClient: YellowClient;

  constructor() {
    const config: ClientConfig = {
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

  async getChannelStatus(): Promise<ChannelStatus> {
    try {
      return await this.yellowClient.getChannelStatus();
    } catch (error) {
      throw new SDKError(
        `Failed to get channel status: ${(error as Error).message}`,
        'CHANNEL_STATUS_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  async openChannel(params: {
    participants: string[];
    initialDeposits?: Array<{ token: string; amount: string }>;
  }): Promise<{ channelId: string; status: string }> {
    try {
      return await this.yellowClient.openChannel(params);
    } catch (error) {
      throw new SDKError(
        `Failed to open channel: ${(error as Error).message}`,
        'CHANNEL_OPEN_ERROR',
        500,
        { params, error: (error as Error).message }
      );
    }
  }

  async closeChannel(channelId?: string): Promise<{ channelId: string; status: string }> {
    try {
      const activeChannelId = channelId || (await this.yellowClient.getChannelStatus()).channelId;
      
      if (!activeChannelId) {
        throw new SDKError('No active channel to close', 'NO_ACTIVE_CHANNEL');
      }

      return await this.yellowClient.closeChannel(activeChannelId);
    } catch (error) {
      throw new SDKError(
        `Failed to close channel: ${(error as Error).message}`,
        'CHANNEL_CLOSE_ERROR',
        500,
        { channelId, error: (error as Error).message }
      );
    }
  }

  async requestSettlement(channelId?: string): Promise<{
    txHash: string;
    status: string;
    settlementData: any;
  }> {
    try {
      const activeChannelId = channelId || (await this.yellowClient.getChannelStatus()).channelId;
      
      if (!activeChannelId) {
        throw new SDKError('No active channel to settle', 'NO_ACTIVE_CHANNEL');
      }

      return await this.yellowClient.requestSettlement(activeChannelId);
    } catch (error) {
      throw new SDKError(
        `Failed to request settlement: ${(error as Error).message}`,
        'SETTLEMENT_ERROR',
        500,
        { channelId, error: (error as Error).message }
      );
    }
  }

  async getChannelHistory(channelId?: string): Promise<Array<{
    type: 'deposit' | 'withdrawal' | 'transfer' | 'settlement';
    amount: string;
    token: string;
    timestamp: number;
    txHash?: string;
  }>> {
    try {
      const activeChannelId = channelId || (await this.yellowClient.getChannelStatus()).channelId;
      
      if (!activeChannelId) {
        return [];
      }

      return await this.yellowClient.getChannelHistory(activeChannelId);
    } catch (error) {
      throw new SDKError(
        `Failed to get channel history: ${(error as Error).message}`,
        'CHANNEL_HISTORY_ERROR',
        500,
        { channelId, error: (error as Error).message }
      );
    }
  }

  async estimateSettlementGas(channelId?: string): Promise<{
    gasEstimate: string;
    gasPrice: string;
    totalCost: string;
  }> {
    try {
      const activeChannelId = channelId || (await this.yellowClient.getChannelStatus()).channelId;
      
      if (!activeChannelId) {
        throw new SDKError('No active channel to estimate', 'NO_ACTIVE_CHANNEL');
      }

      return await this.yellowClient.estimateSettlementGas(activeChannelId);
    } catch (error) {
      throw new SDKError(
        `Failed to estimate settlement gas: ${(error as Error).message}`,
        'GAS_ESTIMATE_ERROR',
        500,
        { channelId, error: (error as Error).message }
      );
    }
  }

  async getNetworkStatus(): Promise<{
    network: string;
    blockNumber: number;
    gasPrice: string;
    channelCount: number;
  }> {
    try {
      return await this.yellowClient.getNetworkStatus();
    } catch (error) {
      throw new SDKError(
        `Failed to get network status: ${(error as Error).message}`,
        'NETWORK_STATUS_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }
}


