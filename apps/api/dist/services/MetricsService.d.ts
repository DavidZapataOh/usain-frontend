import { KPIs, RecentFill, LiveMetrics } from '@usain/sdk';
export declare class MetricsService {
    private envioClient;
    private recentFills;
    private lastKPIs;
    constructor();
    getKPIs(): Promise<KPIs>;
    getRecentFills(limit?: number): Promise<RecentFill[]>;
    getLiveMetrics(): Promise<LiveMetrics>;
    addFill(fill: RecentFill): Promise<void>;
    private updateKPIsWithFill;
    private calculatePercentileLatency;
    private calculateSuccessRate;
    private initializeMockData;
    getHistoricalKPIs(timeframe?: '24h' | '7d' | '30d'): Promise<KPIs>;
    getNetworkStatus(): Promise<{
        network: string;
        blockNumber: number;
        gasPrice: string;
        lastUpdate: number;
    }>;
    getMetricsForSSE(): Promise<LiveMetrics>;
}
//# sourceMappingURL=MetricsService.d.ts.map