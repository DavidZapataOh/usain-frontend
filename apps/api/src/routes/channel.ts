import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ChannelService } from '../services/ChannelService.js';

export async function channelRoutes(
  fastify: FastifyInstance,
  options: { channelService: ChannelService }
) {
  const { channelService } = options;

  // GET /channel/status
  fastify.get('/status', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const status = await channelService.getChannelStatus();
      
      return reply.send(status);
    } catch (error) {
      throw error;
    }
  });

  // POST /channel/open
  fastify.post('/open', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { participants, initialDeposits } = request.body as any;
      
      const result = await channelService.openChannel({
        participants: participants || [],
        initialDeposits,
      });
      
      return reply.send(result);
    } catch (error) {
      throw error;
    }
  });

  // POST /channel/close
  fastify.post('/close', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { channelId } = request.body as { channelId?: string };
      
      const result = await channelService.closeChannel(channelId);
      
      return reply.send(result);
    } catch (error) {
      throw error;
    }
  });

  // POST /channel/settle
  fastify.post('/settle', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { channelId } = request.body as { channelId?: string };
      
      const result = await channelService.requestSettlement(channelId);
      
      return reply.send(result);
    } catch (error) {
      throw error;
    }
  });

  // GET /channel/history
  fastify.get('/history', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { channelId } = request.query as { channelId?: string };
      
      const history = await channelService.getChannelHistory(channelId);
      
      return reply.send(history);
    } catch (error) {
      throw error;
    }
  });

  // GET /channel/gas-estimate
  fastify.get('/gas-estimate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { channelId } = request.query as { channelId?: string };
      
      const estimate = await channelService.estimateSettlementGas(channelId);
      
      return reply.send(estimate);
    } catch (error) {
      throw error;
    }
  });

  // GET /channel/network-status
  fastify.get('/network-status', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const status = await channelService.getNetworkStatus();
      
      return reply.send(status);
    } catch (error) {
      throw error;
    }
  });
}

