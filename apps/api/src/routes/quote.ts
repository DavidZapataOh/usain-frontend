import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { QuoteService } from '../services/QuoteService.js';
import { QuoteRequestSchema } from '@usain/sdk';
import { registerRouteSchema } from '../middleware/validation.js';

export async function quoteRoutes(
  fastify: FastifyInstance,
  options: { quoteService: QuoteService }
) {
  const { quoteService } = options;

  // Register validation schema
  registerRouteSchema('POST:/intents/quote', {
    body: QuoteRequestSchema,
  });

  // POST /intents/quote
  fastify.post('/quote', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const quoteRequest = request.body as any;
      const quote = await quoteService.getQuote(quoteRequest);
      
      return reply.send(quote);
    } catch (error) {
      throw error;
    }
  });

  // GET /intents/route (for route optimization)
  fastify.get('/route', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { fromToken, toToken, amount } = request.query as any;
      
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
    } catch (error) {
      throw error;
    }
  });

  // GET /intents/pools/:address/liquidity
  fastify.get('/pools/:address/liquidity', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { address } = request.params as { address: string };
      
      const liquidity = await quoteService.getPoolLiquidity(address);
      
      return reply.send(liquidity);
    } catch (error) {
      throw error;
    }
  });

  // GET /intents/tokens/supported
  fastify.get('/tokens/supported', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tokens = await quoteService.getSupportedTokens();
      
      return reply.send(tokens);
    } catch (error) {
      throw error;
    }
  });
}

