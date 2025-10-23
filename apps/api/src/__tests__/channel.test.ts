import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import { channelRoutes } from '../routes/channel.js';
import { ChannelService } from '../services/ChannelService.js';

describe('Channel Routes', () => {
  let app: any;
  let channelService: ChannelService;

  beforeAll(async () => {
    app = Fastify();
    channelService = new ChannelService();
    await app.register(channelRoutes, { prefix: '/channel', channelService });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /channel/status', () => {
    it('should return channel status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/channel/status',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('channelId');
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('balances');
    });
  });

  describe('POST /channel/open', () => {
    it('should open a channel', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/channel/open',
        payload: {
          participants: [
            '0x1234567890123456789012345678901234567890',
            '0x0987654321098765432109876543210987654321',
          ],
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('channelId');
      expect(data).toHaveProperty('status', 'OPEN');
    });
  });

  describe('POST /channel/close', () => {
    it('should close a channel', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/channel/close',
        payload: {},
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('status', 'CLOSED');
    });
  });

  describe('POST /channel/settle', () => {
    it('should request settlement', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/channel/settle',
        payload: {},
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data).toHaveProperty('txHash');
      expect(data).toHaveProperty('status');
    });
  });
});

