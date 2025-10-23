import { ChannelStatus, ChannelUpdate, ClientConfig } from '../types.js';
export declare class YellowClient {
    private network;
    constructor(config: ClientConfig);
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
    closeChannel(channelId: string): Promise<{
        channelId: string;
        status: string;
    }>;
    getChannelStatus(channelId?: string): Promise<ChannelStatus>;
    updateChannelState(update: ChannelUpdate): Promise<{
        success: boolean;
        newState: any;
        signature: string;
    }>;
    requestSettlement(channelId: string): Promise<{
        txHash: string;
        status: string;
        settlementData: any;
    }>;
    private createChannel;
    private initializeChannelState;
    private closeChannelOnNetwork;
    private getActiveChannelId;
    private queryChannelState;
    private validateChannelUpdate;
    private applyStateUpdate;
    private signChannelUpdate;
    private prepareSettlementData;
    private submitSettlement;
    getChannelHistory(_channelId: string): Promise<Array<{
        type: 'deposit' | 'withdrawal' | 'transfer' | 'settlement';
        amount: string;
        token: string;
        timestamp: number;
        txHash?: string;
    }>>;
    getNetworkStatus(): Promise<{
        network: string;
        blockNumber: number;
        gasPrice: string;
        channelCount: number;
    }>;
    estimateSettlementGas(_channelId: string): Promise<{
        gasEstimate: string;
        gasPrice: string;
        totalCost: string;
    }>;
}
//# sourceMappingURL=yellow.d.ts.map