import { QuoteRequest, Quote, SubmitIntentRequest, SubmitIntentResponse, ChannelStatus, Policy, CreatePolicyRequest, LiveMetrics, KPIs, ClientConfig, PaginationParams, PaginatedResponse } from '../types.js';
export declare class APIClient {
    private baseUrl;
    constructor(config: ClientConfig);
    private request;
    quote(params: QuoteRequest): Promise<Quote>;
    submitIntent(params: SubmitIntentRequest): Promise<SubmitIntentResponse>;
    getChannelStatus(): Promise<ChannelStatus>;
    openChannel(): Promise<{
        channelId: string;
        status: string;
    }>;
    closeChannel(): Promise<{
        channelId: string;
        status: string;
    }>;
    requestSettlement(): Promise<{
        txHash: string;
        status: string;
    }>;
    getPolicies(params?: PaginationParams): Promise<PaginatedResponse<Policy>>;
    createPolicy(data: CreatePolicyRequest): Promise<Policy>;
    updatePolicyStatus(policyId: string, action: 'pause' | 'resume' | 'revoke'): Promise<Policy>;
    getKPIs(): Promise<KPIs>;
    getRecentFills(limit?: number): Promise<any[]>;
    subscribeLiveMetrics(onMessage: (metrics: LiveMetrics) => void, onError?: (error: Error) => void): () => void;
    healthCheck(): Promise<{
        status: string;
        timestamp: number;
        dependencies: any;
    }>;
    getSupportedTokens(): Promise<any[]>;
    getNetworkStatus(): Promise<{
        network: string;
        blockNumber: number;
        gasPrice: string;
    }>;
}
//# sourceMappingURL=api.d.ts.map