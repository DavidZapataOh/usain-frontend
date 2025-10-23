import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import { policyRoutes } from '../routes/policy.js';
import { PolicyService } from '../services/PolicyService.js';

describe('Policy Routes', () => {
  let app: any;
  let policyService: PolicyService;

  beforeAll(async () => {
    app = Fastify();
    policyService = new PolicyService();
    await app.register(policyRoutes, { prefix: '/policies', policyService });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /policies', () => {
    it('should return list of policies', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/policies',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('POST /policies/create', () => {
    it('should create a new policy', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/policies/create',
        payload: {
          name: 'Test Policy',
          description: 'A test policy',
          spendingLimitUSD: 1000,
          allowedPairs: ['USDC-DAI', 'USDT-USDC'],
          expiryDays: 30,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('name', 'Test Policy');
      expect(data).toHaveProperty('isActive', true);
    });

    it('should return 400 for invalid policy data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/policies/create',
        payload: {
          name: '',
          spendingLimitUSD: -100,
          allowedPairs: [],
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /policies/:id/pause', () => {
    it('should pause a policy', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/policies/policy_123/pause',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('isActive', false);
    });
  });

  describe('POST /policies/:id/resume', () => {
    it('should resume a policy', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/policies/policy_123/resume',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('isActive', true);
    });
  });

  describe('POST /policies/:id/revoke', () => {
    it('should revoke a policy', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/policies/policy_123/revoke',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('success', true);
    });
  });
});

