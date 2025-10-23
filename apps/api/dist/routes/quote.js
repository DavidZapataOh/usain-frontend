import { QuoteRequestSchema } from '@usain/sdk';
import { registerRouteSchema } from '../middleware/validation.js';
export async function quoteRoutes(fastify, options) {
    const { quoteService } = options;
    // Register validation schema
    registerRouteSchema('POST:/intents/quote', {
        body: QuoteRequestSchema,
    });
    // POST /intents/quote
    fastify.post('/quote', async (request, reply) => {
        try {
            const quoteRequest = request.body;
            const quote = await quoteService.getQuote(quoteRequest);
            return reply.send(quote);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /intents/route (for route optimization)
    fastify.get('/route', async (request, reply) => {
        try {
            const { fromToken, toToken, amount } = request.query;
            if (!fromToken || !toToken || !amount) {
                return reply.status(400).send({
                    error: {
                        code: 'MISSING_PARAMETERS',
                        message: 'fromToken, toToken, and amount are required',
                    },
                });
            }
            const route = await quoteService.getOptimalRoute({
                fromToken,
                toToken,
                amount,
            });
            return reply.send(route);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /intents/pools/:address/liquidity
    fastify.get('/pools/:address/liquidity', async (request, reply) => {
        try {
            const { address } = request.params;
            const liquidity = await quoteService.getPoolLiquidity(address);
            return reply.send(liquidity);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /intents/tokens/supported
    fastify.get('/tokens/supported', async (request, reply) => {
        try {
            const tokens = await quoteService.getSupportedTokens();
            return reply.send(tokens);
        }
        catch (error) {
            throw error;
        }
    });
}
//# sourceMappingURL=quote.js.map