import { 
  Quote, 
  KPIs, 
  RecentFill, 
  SDKError, 
  NetworkError,
  ClientConfig 
} from '../types.js';

export class EnvioClient {
  private hyperSyncUrl: string;
  private gqlUri: string;

  constructor(config: ClientConfig) {
    this.hyperSyncUrl = config.envioHyperSyncUrl;
    this.gqlUri = config.envioGqlUri;
  }

  // ===== HYPERINDEX (GraphQL) CLIENT =====

  private async graphqlQuery<T>(query: string, variables?: any): Promise<T> {
    const response = await fetch(this.gqlUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new NetworkError(`GraphQL request failed: ${response.status}`);
    }

    const result = await response.json() as any;
    
    if (result.errors) {
      throw new SDKError(`GraphQL errors: ${JSON.stringify(result.errors)}`, 'GRAPHQL_ERROR');
    }

    return result.data as T;
  }

  // ===== HYPERINDEX QUERIES =====

  async getHistoricalKPIs(timeframe: '24h' | '7d' | '30d' = '24h'): Promise<KPIs> {
    const query = `
      query GetKPIs($timeframe: String!) {
        kpis(timeframe: $timeframe) {
          gasSavedUSD
          latencyP50
          latencyP95
          volume24h
          users
          totalFills
          successRate
        }
      }
    `;

    const data = await this.graphqlQuery<{ kpis: KPIs }>(query, { timeframe });
    return data.kpis;
  }

  async getRecentFills(limit = 10): Promise<RecentFill[]> {
    const query = `
      query GetRecentFills($limit: Int!) {
        fills(first: $limit, orderBy: timestamp, orderDirection: desc) {
          pair
          amount
          price
          savingsUSD
          timestamp
          latencyMs
        }
      }
    `;

    const data = await this.graphqlQuery<{ fills: RecentFill[] }>(query, { limit });
    return data.fills;
  }

  async getPoolData(poolAddress: string): Promise<{
    address: string;
    token0: string;
    token1: string;
    reserve0: string;
    reserve1: string;
    fee: number;
  }> {
    const query = `
      query GetPoolData($poolAddress: String!) {
        pool(id: $poolAddress) {
          id
          token0
          token1
          reserve0
          reserve1
          fee
        }
      }
    `;

    const data = await this.graphqlQuery<{ pool: any }>(query, { poolAddress });
    return data.pool;
  }

  async getTokenPrice(tokenAddress: string): Promise<{
    address: string;
    priceUSD: string;
    symbol: string;
    decimals: number;
  }> {
    const query = `
      query GetTokenPrice($tokenAddress: String!) {
        token(id: $tokenAddress) {
          id
          priceUSD
          symbol
          decimals
        }
      }
    `;

    const data = await this.graphqlQuery<{ token: any }>(query, { tokenAddress });
    return data.token;
  }

  // ===== HYPERSYNC (HTTP) CLIENT =====

  private async hyperSyncRequest<T>(endpoint: string, params?: any): Promise<T> {
    const url = new URL(endpoint, this.hyperSyncUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new NetworkError(`HyperSync request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  // ===== HYPERSYNC QUOTES =====

  async getPoolQuote(params: {
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
  }> {
    return this.hyperSyncRequest('/quote', {
      fromToken: params.fromToken,
      toToken: params.toToken,
      amount: params.amount,
      poolAddress: params.poolAddress,
    });
  }

  async getOptimalRoute(params: {
    fromToken: string;
    toToken: string;
    amount: string;
  }): Promise<{
    route: string[];
    pools: string[];
    fees: string[];
    totalFee: string;
    estimatedGas: string;
  }> {
    return this.hyperSyncRequest('/route', {
      fromToken: params.fromToken,
      toToken: params.toToken,
      amount: params.amount,
    });
  }

  async getPoolLiquidity(poolAddress: string): Promise<{
    poolAddress: string;
    liquidityUSD: string;
    volume24h: string;
    fees24h: string;
    apr: string;
  }> {
    return this.hyperSyncRequest(`/pools/${poolAddress}/liquidity`);
  }

  // ===== COMPARISON WITH UNISWAP =====

  async getUniswapQuote(params: {
    fromToken: string;
    toToken: string;
    amount: string;
  }): Promise<{
    price: string;
    fee: string;
    etaMs: number;
    gasEstimate: string;
  }> {
    // This would integrate with Uniswap V3 API
    // For now, return mock data
    return {
      price: (parseFloat(params.amount) * 0.999).toString(),
      fee: '0.003',
      etaMs: 12000, // 12 seconds
      gasEstimate: '150000',
    };
  }

  async calculateSavings(params: {
    fromToken: string;
    toToken: string;
    amount: string;
  }): Promise<{
    usainPrice: string;
    uniswapPrice: string;
    savingsUSD: string;
    timeSavedMs: number;
    gasSaved: string;
  }> {
    const [usainQuote, uniswapQuote] = await Promise.all([
      this.getPoolQuote(params),
      this.getUniswapQuote(params),
    ]);

    const usainPrice = parseFloat(usainQuote.price);
    const uniswapPrice = parseFloat(uniswapQuote.price);
    const savingsUSD = (uniswapPrice - usainPrice).toFixed(2);
    const timeSavedMs = uniswapQuote.etaMs - usainQuote.etaMs;

    return {
      usainPrice: usainQuote.price,
      uniswapPrice: uniswapQuote.price,
      savingsUSD,
      timeSavedMs,
      gasSaved: '0', // State channels have zero gas
    };
  }

  // ===== REAL-TIME DATA =====

  async subscribeToPoolUpdates(
    poolAddress: string,
    onUpdate: (data: any) => void
  ): Promise<() => void> {
    // This would use WebSocket or SSE to get real-time pool updates
    // For now, return a mock subscription
    const interval = setInterval(() => {
      onUpdate({
        poolAddress,
        reserve0: (Math.random() * 1000000).toString(),
        reserve1: (Math.random() * 1000000).toString(),
        price: (Math.random() * 2).toString(),
        timestamp: Date.now(),
      });
    }, 2000);

    return () => clearInterval(interval);
  }

  // ===== UTILITY METHODS =====

  async getSupportedTokens(): Promise<Array<{
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    priceUSD: string;
  }>> {
    return this.hyperSyncRequest('/tokens/supported');
  }

  async getNetworkStatus(): Promise<{
    network: string;
    blockNumber: number;
    gasPrice: string;
    lastUpdate: number;
  }> {
    return this.hyperSyncRequest('/network/status');
  }
}
