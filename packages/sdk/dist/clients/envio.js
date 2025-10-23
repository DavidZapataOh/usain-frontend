import { SDKError, NetworkError } from '../types.js';
export class EnvioClient {
    hyperSyncUrl;
    gqlUri;
    constructor(config) {
        this.hyperSyncUrl = config.envioHyperSyncUrl;
        this.gqlUri = config.envioGqlUri;
    }
    // ===== HYPERINDEX (GraphQL) CLIENT =====
    async graphqlQuery(query, variables) {
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
        const result = await response.json();
        if (result.errors) {
            throw new SDKError(`GraphQL errors: ${JSON.stringify(result.errors)}`, 'GRAPHQL_ERROR');
        }
        return result.data;
    }
    // ===== HYPERINDEX QUERIES =====
    async getHistoricalKPIs(timeframe = '24h') {
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
        const data = await this.graphqlQuery(query, { timeframe });
        return data.kpis;
    }
    async getRecentFills(limit = 10) {
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
        const data = await this.graphqlQuery(query, { limit });
        return data.fills;
    }
    async getPoolData(poolAddress) {
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
        const data = await this.graphqlQuery(query, { poolAddress });
        return data.pool;
    }
    async getTokenPrice(tokenAddress) {
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
        const data = await this.graphqlQuery(query, { tokenAddress });
        return data.token;
    }
    // ===== HYPERSYNC (HTTP) CLIENT =====
    async hyperSyncRequest(endpoint, params) {
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
        return response.json();
    }
    // ===== HYPERSYNC QUOTES =====
    async getPoolQuote(params) {
        return this.hyperSyncRequest('/quote', {
            fromToken: params.fromToken,
            toToken: params.toToken,
            amount: params.amount,
            poolAddress: params.poolAddress,
        });
    }
    async getOptimalRoute(params) {
        return this.hyperSyncRequest('/route', {
            fromToken: params.fromToken,
            toToken: params.toToken,
            amount: params.amount,
        });
    }
    async getPoolLiquidity(poolAddress) {
        return this.hyperSyncRequest(`/pools/${poolAddress}/liquidity`);
    }
    // ===== COMPARISON WITH UNISWAP =====
    async getUniswapQuote(params) {
        // This would integrate with Uniswap V3 API
        // For now, return mock data
        return {
            price: (parseFloat(params.amount) * 0.999).toString(),
            fee: '0.003',
            etaMs: 12000, // 12 seconds
            gasEstimate: '150000',
        };
    }
    async calculateSavings(params) {
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
    async subscribeToPoolUpdates(poolAddress, onUpdate) {
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
    async getSupportedTokens() {
        return this.hyperSyncRequest('/tokens/supported');
    }
    async getNetworkStatus() {
        return this.hyperSyncRequest('/network/status');
    }
}
//# sourceMappingURL=envio.js.map