import { ChannelStatus } from '@usain/sdk';
export declare class ChannelService {
    private yellowClient;
    constructor();
    getChannelStatus(): Promise<ChannelStatus>;
    openChannel(params: {
        participants: string[];
        initialDeposits?: Array<{
            token: string;
            amount: string;
        }>;
    }): Promise<{
        channelId: string;
        status: string;
    }>;
    closeChannel(channelId?: string): Promise<{
        channelId: string;
        status: string;
    }>;
    requestSettlement(channelId?: string): Promise<{
        txHash: string;
        status: string;
        settlementData: any;
    }>;
    getChannelHistory(channelId?: string): Promise<Array<{
        type: 'deposit' | 'withdrawal' | 'transfer' | 'settlement';
        amount: string;
        token: string;
        timestamp: number;
        txHash?: string;
    }>>;
    estimateSettlementGas(channelId?: string): Promise<{
        gasEstimate: string;
        gasPrice: string;
        totalCost: string;
    }>;
    getNetworkStatus(): Promise<{
        network: string;
        blockNumber: number;
        gasPrice: string;
        channelCount: number;
    }>;
}
//# sourceMappingURL=ChannelService.d.ts.map