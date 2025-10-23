import { 
  createPublicClient, 
  createWalletClient, 
  http, 
  parseEther,
  formatEther,
  getContract,
  type Address,
  type Hash,
  type PublicClient,
  type WalletClient
} from 'viem';
import { sepolia } from 'viem/chains';
import { 
  USAINSettlementHubABI, 
  SETTLEMENT_HUB_ADDRESS,
  type SettleBatchParams,
  type OpenChannelParams,
  type BatchSettledEvent,
  type ChannelOpenedEvent,
  type ChannelClosedEvent
} from '../abis/USAINSettlementHub.js';

export interface ContractConfig {
  rpcUrl: string;
  chainId: number;
  contractAddress: string;
  privateKey?: string;
}

export class SettlementHubClient {
  private publicClient: PublicClient;
  private walletClient?: WalletClient;
  private contractAddress: Address;

  constructor(config: ContractConfig) {
    this.contractAddress = config.contractAddress as Address;
    
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(config.rpcUrl),
    });

    if (config.privateKey) {
      this.walletClient = createWalletClient({
        chain: sepolia,
        transport: http(config.rpcUrl),
        account: config.privateKey as Address,
      });
    }
  }

  // ===== READ FUNCTIONS =====

  async getChannelInfo(channelId: string) {
    try {
      const result = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: USAINSettlementHubABI,
        functionName: 'getChannelInfo',
        args: [channelId as `0x${string}`],
      });

      return {
        isOpen: result[0],
        participants: result[1],
        lastSettlementBlock: result[2],
        settlementCount: result[3],
      };
    } catch (error) {
      console.error('[SettlementHub] Failed to get channel info:', error);
      throw new Error(`Failed to get channel info: ${(error as Error).message}`);
    }
  }

  async isChannelOpen(channelId: string): Promise<boolean> {
    try {
      const result = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: USAINSettlementHubABI,
        functionName: 'isChannelOpen',
        args: [channelId as `0x${string}`],
      });

      return result;
    } catch (error) {
      console.error('[SettlementHub] Failed to check channel status:', error);
      throw new Error(`Failed to check channel status: ${(error as Error).message}`);
    }
  }

  // ===== WRITE FUNCTIONS =====

  async openChannel(params: OpenChannelParams): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not configured. Private key required for write operations.');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: USAINSettlementHubABI,
        functionName: 'openChannel',
        args: [
          params.channelId as `0x${string}`,
          params.participants as Address[]
        ],
      });

      console.log('[SettlementHub] Channel opened:', hash);
      return hash;
    } catch (error) {
      console.error('[SettlementHub] Failed to open channel:', error);
      throw new Error(`Failed to open channel: ${(error as Error).message}`);
    }
  }

  async closeChannel(channelId: string): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not configured. Private key required for write operations.');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: USAINSettlementHubABI,
        functionName: 'closeChannel',
        args: [channelId as `0x${string}`],
      });

      console.log('[SettlementHub] Channel closed:', hash);
      return hash;
    } catch (error) {
      console.error('[SettlementHub] Failed to close channel:', error);
      throw new Error(`Failed to close channel: ${(error as Error).message}`);
    }
  }

  async settleBatch(params: SettleBatchParams): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not configured. Private key required for write operations.');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: USAINSettlementHubABI,
        functionName: 'settleBatch',
        args: [
          params.channelId as `0x${string}`,
          params.tokens as Address[],
          params.from as Address[],
          params.to as Address[],
          params.amounts
        ],
      });

      console.log('[SettlementHub] Batch settled:', hash);
      return hash;
    } catch (error) {
      console.error('[SettlementHub] Failed to settle batch:', error);
      throw new Error(`Failed to settle batch: ${(error as Error).message}`);
    }
  }

  // ===== EVENT LISTENING =====

  async watchBatchSettledEvents(
    onEvent: (event: BatchSettledEvent) => void,
    onError?: (error: Error) => void
  ): Promise<() => void> {
    try {
      const unwatch = this.publicClient.watchContractEvent({
        address: this.contractAddress,
        abi: USAINSettlementHubABI,
        eventName: 'BatchSettled',
        onLogs: (logs) => {
          logs.forEach(log => {
            const event = {
              channelId: log.args.channelId,
              tokens: log.args.tokens,
              from: log.args.from,
              to: log.args.to,
              amounts: log.args.amounts,
              timestamp: log.args.timestamp,
            };
            onEvent(event);
          });
        },
        onError: (error) => {
          console.error('[SettlementHub] Event watch error:', error);
          onError?.(error as Error);
        },
      });

      return unwatch;
    } catch (error) {
      console.error('[SettlementHub] Failed to watch events:', error);
      throw new Error(`Failed to watch events: ${(error as Error).message}`);
    }
  }

  async watchChannelOpenedEvents(
    onEvent: (event: ChannelOpenedEvent) => void,
    onError?: (error: Error) => void
  ): Promise<() => void> {
    try {
      const unwatch = this.publicClient.watchContractEvent({
        address: this.contractAddress,
        abi: USAINSettlementHubABI,
        eventName: 'ChannelOpened',
        onLogs: (logs) => {
          logs.forEach(log => {
            const event = {
              channelId: log.args.channelId,
              participant: log.args.participant,
            };
            onEvent(event);
          });
        },
        onError: (error) => {
          console.error('[SettlementHub] Event watch error:', error);
          onError?.(error as Error);
        },
      });

      return unwatch;
    } catch (error) {
      console.error('[SettlementHub] Failed to watch events:', error);
      throw new Error(`Failed to watch events: ${(error as Error).message}`);
    }
  }

  // ===== UTILITY FUNCTIONS =====

  async getTransactionReceipt(hash: Hash) {
    try {
      return await this.publicClient.getTransactionReceipt({ hash });
    } catch (error) {
      console.error('[SettlementHub] Failed to get transaction receipt:', error);
      throw new Error(`Failed to get transaction receipt: ${(error as Error).message}`);
    }
  }

  async waitForTransactionReceipt(hash: Hash) {
    try {
      return await this.publicClient.waitForTransactionReceipt({ hash });
    } catch (error) {
      console.error('[SettlementHub] Failed to wait for transaction receipt:', error);
      throw new Error(`Failed to wait for transaction receipt: ${(error as Error).message}`);
    }
  }

  getContractAddress(): string {
    return this.contractAddress;
  }
}


