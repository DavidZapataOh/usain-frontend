import { EnvioClient } from '@usain/sdk';
import { SDKError } from '@usain/sdk';
export class MetricsService {
    envioClient;
    recentFills = [];
    lastKPIs = null;
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
        this.envioClient = new EnvioClient(config);
        // Initialize with mock data
        this.initializeMockData();
    }
    async getKPIs() {
        try {
            // Get KPIs from Envio
            const envioKPIs = await this.envioClient.getHistoricalKPIs('24h');
            // Update cached KPIs
            this.lastKPIs = envioKPIs;
            return envioKPIs;
        }
        catch (error) {
            // Fallback to cached data or mock data
            if (this.lastKPIs) {
                return this.lastKPIs;
            }
            throw new SDKError(`Failed to get KPIs: ${error.message}`, 'KPIS_ERROR', 500, { error: error.message });
        }
    }
    async getRecentFills(limit = 10) {
        try {
            // Get recent fills from Envio
            const envioFills = await this.envioClient.getRecentFills(limit);
            // Update cached fills
            this.recentFills = envioFills;
            return envioFills;
        }
        catch (error) {
            // Fallback to cached data
            return this.recentFills.slice(0, limit);
        }
    }
    async getLiveMetrics() {
        try {
            const [kpis, recentFills] = await Promise.all([
                this.getKPIs(),
                this.getRecentFills(1),
            ]);
            return {
                kpis,
                lastFill: recentFills[0] || undefined,
            };
        }
        catch (error) {
            throw new SDKError(`Failed to get live metrics: ${error.message}`, 'LIVE_METRICS_ERROR', 500, { error: error.message });
        }
    }
    async addFill(fill) {
        try {
            // Add fill to recent fills
            this.recentFills.unshift(fill);
            // Keep only last 100 fills
            if (this.recentFills.length > 100) {
                this.recentFills = this.recentFills.slice(0, 100);
            }
            // Update KPIs
            await this.updateKPIsWithFill(fill);
        }
        catch (error) {
            console.error('Failed to add fill:', error);
        }
    }
    async updateKPIsWithFill(fill) {
        try {
            if (!this.lastKPIs) {
                this.lastKPIs = await this.getKPIs();
            }
            // Update KPIs with new fill data
            const newKPIs = {
                ...this.lastKPIs,
                totalFills: this.lastKPIs.totalFills + 1,
                volume24h: (parseFloat(this.lastKPIs.volume24h) + parseFloat(fill.amount)).toString(),
                latencyP50: this.calculatePercentileLatency(50),
                latencyP95: this.calculatePercentileLatency(95),
                successRate: this.calculateSuccessRate(),
            };
            this.lastKPIs = newKPIs;
        }
        catch (error) {
            console.error('Failed to update KPIs with fill:', error);
        }
    }
    calculatePercentileLatency(percentile) {
        if (this.recentFills.length === 0)
            return 0;
        const latencies = this.recentFills.map(fill => fill.latencyMs).sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * latencies.length) - 1;
        return latencies[index] || 0;
    }
    calculateSuccessRate() {
        if (this.recentFills.length === 0)
            return 100;
        const successfulFills = this.recentFills.filter(fill => fill.latencyMs > 0).length;
        return (successfulFills / this.recentFills.length) * 100;
    }
    initializeMockData() {
        // Initialize with mock data
        this.lastKPIs = {
            gasSavedUSD: '37.42',
            latencyP50: 180,
            latencyP95: 320,
            volume24h: '12845',
            users: '42',
            totalFills: 156,
            successRate: 98.5,
        };
        this.recentFills = [
            {
                pair: 'USDC-DAI',
                amount: '1000.00',
                price: '0.9994',
                savingsUSD: '2.50',
                ts: Date.now() - 300000, // 5 minutes ago
                latencyMs: 150,
            },
            {
                pair: 'USDT-USDC',
                amount: '500.00',
                price: '1.0001',
                savingsUSD: '1.25',
                ts: Date.now() - 600000, // 10 minutes ago
                latencyMs: 180,
            },
        ];
    }
    async getHistoricalKPIs(timeframe = '24h') {
        try {
            return await this.envioClient.getHistoricalKPIs(timeframe);
        }
        catch (error) {
            throw new SDKError(`Failed to get historical KPIs: ${error.message}`, 'HISTORICAL_KPIS_ERROR', 500, { timeframe, error: error.message });
        }
    }
    async getNetworkStatus() {
        try {
            return await this.envioClient.getNetworkStatus();
        }
        catch (error) {
            throw new SDKError(`Failed to get network status: ${error.message}`, 'NETWORK_STATUS_ERROR', 500, { error: error.message });
        }
    }
    // Method to be called by SSE endpoint
    async getMetricsForSSE() {
        return this.getLiveMetrics();
    }
}
//# sourceMappingURL=MetricsService.js.map