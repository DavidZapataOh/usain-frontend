import { KPIs, RecentFill, ClientConfig } from '../types.js';
export declare class EnvioClient {
    private hyperSyncUrl;
    private gqlUri;
    constructor(config: ClientConfig);
    private graphqlQuery;
    getHistoricalKPIs(timeframe?: '24h' | '7d' | '30d'): Promise<KPIs>;
    getRecentFills(limit?: number): Promise<RecentFill[]>;
    getPoolData(poolAddress: string): Promise<{
        address: string;
        token0: string;
        token1: string;
        reserve0: string;
        reserve1: string;
        fee: number;
    }>;
    getTokenPrice(tokenAddress: string): Promise<{
        address: string;
        priceUSD: string;
        symbol: string;
        decimals: number;
    }>;
    private hyperSyncRequest;
    getPoolQuote(params: {
        fromToken: string;
        toToken: string;
        amount: string;
        poolAddress?: string;
    }): Promise<{
        price: string;
        fee: string;
        route: string[];
        etaMs: number;
        slippage: string;
    }>;
    getOptimalRoute(params: {
        fromToken: string;
        toToken: string;
        amount: string;
    }): Promise<{
        route: string[];
        pools: string[];
        fees: string[];
        totalFee: string;
        estimatedGas: string;
    }>;
    getPoolLiquidity(poolAddress: string): Promise<{
        poolAddress: string;
        liquidityUSD: string;
        volume24h: string;
        fees24h: string;
        apr: string;
    }>;
    getUniswapQuote(params: {
        fromToken: string;
        toToken: string;
        amount: string;
    }): Promise<{
        price: string;
        fee: string;
        etaMs: number;
        gasEstimate: string;
    }>;
    calculateSavings(params: {
        fromToken: string;
        toToken: string;
        amount: string;
    }): Promise<{
        usainPrice: string;
        uniswapPrice: string;
        savingsUSD: string;
        timeSavedMs: number;
        gasSaved: string;
    }>;
    subscribeToPoolUpdates(poolAddress: string, onUpdate: (data: any) => void): Promise<() => void>;
    getSupportedTokens(): Promise<Array<{
        address: string;
        symbol: string;
        name: string;
        decimals: number;
        priceUSD: string;
    }>>;
    getNetworkStatus(): Promise<{
        network: string;
        blockNumber: number;
        gasPrice: string;
        lastUpdate: number;
    }>;
}
//# sourceMappingURL=envio.d.ts.map