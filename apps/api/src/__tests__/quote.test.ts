import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import { quoteRoutes } from '../routes/quote.js';
import { QuoteService } from '../services/QuoteService.js';

describe('Quote Routes', () => {
  let app: any;
  let quoteService: QuoteService;

  beforeAll(async () => {
    app = Fastify();
    quoteService = new QuoteService();
    await app.register(quoteRoutes, { prefix: '/intents', quoteService });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /intents/quote', () => {
    it('should return a quote for valid request', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/intents/quote',
        payload: {
          fromToken: 'USDC',
          toToken: 'DAI',
          amount: '1000',
          address: '0x1234567890123456789012345678901234567890',
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('price');
      expect(data).toHaveProperty('fee');
      expect(data).toHaveProperty('route');
      expect(data).toHaveProperty('etaMs');
      expect(data).toHaveProperty('savingsUSD');
    });

    it('should return 400 for invalid request', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/intents/quote',
        payload: {
          fromToken: 'USDC',
          // Missing required fields
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /intents/tokens/supported', () => {
    it('should return list of supported tokens', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/intents/tokens/supported',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(Array.isArray(data)).toBe(true);
    });
  });
});

