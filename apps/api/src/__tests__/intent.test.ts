import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import Fastify from 'fastify';
import { intentRoutes } from '../routes/intent.js';
import { IntentService } from '../services/IntentService.js';

describe('Intent Routes', () => {
  let app: any;
  let intentService: IntentService;

  beforeAll(async () => {
    app = Fastify();
    intentService = new IntentService();
    
    // Mock signature verification
    vi.spyOn(intentService as any, 'verifySignature').mockResolvedValue(true);
    
    await app.register(intentRoutes, { prefix: '/intents', intentService });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /intents/submit', () => {
    it('should submit an intent successfully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/intents/submit',
        payload: {
          intent: {
            pair: 'USDC-DAI',
            amount: '1000',
            fromToken: 'USDC',
            toToken: 'DAI',
            userAddress: '0x1234567890123456789012345678901234567890',
            nonce: '1',
            deadline: Date.now() + 60000,
          },
          signature: '0xabcdef1234567890',
          policyId: 'policy_123',
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('status', 'filled');
      expect(data).toHaveProperty('fillId');
      expect(data).toHaveProperty('channelId');
      expect(data).toHaveProperty('latencyMs');
      expect(data).toHaveProperty('ts');
    });

    it('should return 400 for invalid signature', async () => {
      // Reset mock to return false
      vi.spyOn(intentService as any, 'verifySignature').mockResolvedValue(false);

      const response = await app.inject({
        method: 'POST',
        url: '/intents/submit',
        payload: {
          intent: {
            pair: 'USDC-DAI',
            amount: '1000',
            fromToken: 'USDC',
            toToken: 'DAI',
            userAddress: '0x1234567890123456789012345678901234567890',
            nonce: '1',
            deadline: Date.now() + 60000,
          },
          signature: '0xinvalid',
          policyId: 'policy_123',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /intents/:fillId/status', () => {
    it('should return fill status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/intents/fill_123/status',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('fillId');
      expect(data).toHaveProperty('status');
    });
  });
});

