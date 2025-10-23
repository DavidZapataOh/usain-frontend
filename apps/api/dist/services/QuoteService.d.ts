import { QuoteRequest, Quote } from '@usain/sdk';
export declare class QuoteService {
    private envioClient;
    constructor();
    getQuote(request: QuoteRequest): Promise<Quote>;
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
    getSupportedTokens(): Promise<Array<{
        address: string;
        symbol: string;
        name: string;
        decimals: number;
        priceUSD: string;
    }>>;
}
//# sourceMappingURL=QuoteService.d.ts.map