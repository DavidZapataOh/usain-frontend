import { EnvioClient } from '@usain/sdk';
import { 
  QuoteRequest, 
  Quote, 
  ClientConfig,
  SDKError 
} from '@usain/sdk';

export class QuoteService {
  private envioClient: EnvioClient;

  constructor() {
    const config: ClientConfig = {
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
  }

  async getQuote(request: QuoteRequest): Promise<Quote> {
    try {
      // Get quote from Envio HyperSync
      const envioQuote = await this.envioClient.getPoolQuote({
        fromToken: request.fromToken,
        toToken: request.toToken,
        amount: request.amount,
      });

      // Get Uniswap quote for comparison
      const uniswapQuote = await this.envioClient.getUniswapQuote({
        fromToken: request.fromToken,
        toToken: request.toToken,
        amount: request.amount,
      });

      // Calculate savings
      const savings = await this.envioClient.calculateSavings({
        fromToken: request.fromToken,
        toToken: request.toToken,
        amount: request.amount,
      });

      // Build route (simplified for now)
      const route = [request.fromToken, request.toToken];

      const quote: Quote = {
        price: envioQuote.price,
        fee: envioQuote.fee,
        route,
        etaMs: envioQuote.etaMs,
        savingsUSD: savings.savingsUSD,
        uniswapPrice: uniswapQuote.price,
        uniswapEtaMs: uniswapQuote.etaMs,
      };

      return quote;
    } catch (error) {
      throw new SDKError(
        `Failed to get quote: ${(error as Error).message}`,
        'QUOTE_ERROR',
        500,
        { request, error: (error as Error).message }
      );
    }
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
    try {
      return await this.envioClient.getOptimalRoute(params);
    } catch (error) {
      throw new SDKError(
        `Failed to get optimal route: ${(error as Error).message}`,
        'ROUTE_ERROR',
        500,
        { params, error: (error as Error).message }
      );
    }
  }

  async getPoolLiquidity(poolAddress: string): Promise<{
    poolAddress: string;
    liquidityUSD: string;
    volume24h: string;
    fees24h: string;
    apr: string;
  }> {
    try {
      return await this.envioClient.getPoolLiquidity(poolAddress);
    } catch (error) {
      throw new SDKError(
        `Failed to get pool liquidity: ${(error as Error).message}`,
        'POOL_LIQUIDITY_ERROR',
        500,
        { poolAddress, error: (error as Error).message }
      );
    }
  }

  async getSupportedTokens(): Promise<Array<{
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    priceUSD: string;
  }>> {
    try {
      return await this.envioClient.getSupportedTokens();
    } catch (error) {
      throw new SDKError(
        `Failed to get supported tokens: ${(error as Error).message}`,
        'TOKENS_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }
}


