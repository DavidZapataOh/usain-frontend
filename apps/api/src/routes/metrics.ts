import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { MetricsService } from '../services/MetricsService.js';

export async function metricsRoutes(
  fastify: FastifyInstance,
  options: { metricsService: MetricsService }
) {
  const { metricsService } = options;

  // GET /metrics/kpis
  fastify.get('/kpis', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const kpis = await metricsService.getKPIs();
      
      return reply.send(kpis);
    } catch (error) {
      throw error;
    }
  });

  // GET /metrics/fills
  fastify.get('/fills', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { limit } = request.query as { limit?: string };
      
      const fills = await metricsService.getRecentFills(
        limit ? parseInt(limit) : 10
      );
      
      return reply.send(fills);
    } catch (error) {
      throw error;
    }
  });

  // GET /metrics/live (SSE endpoint)
  fastify.get('/live', { websocket: true }, async (connection, request) => {
    connection.socket.on('message', (message: any) => {
      // Handle any incoming messages if needed
      console.log('Received message:', message.toString());
    });

    // Send initial data
    try {
      const initialMetrics = await metricsService.getMetricsForSSE();
      connection.socket.send(`data: ${JSON.stringify(initialMetrics)}\n\n`);
    } catch (error) {
      console.error('Failed to send initial metrics:', error);
    }

    // Set up interval to send updates every 2 seconds
    const interval = setInterval(async () => {
      try {
        const metrics = await metricsService.getMetricsForSSE();
        connection.socket.send(`data: ${JSON.stringify(metrics)}\n\n`);
      } catch (error) {
        console.error('Failed to send metrics update:', error);
      }
    }, 2000);

    // Clean up on disconnect
    connection.socket.on('close', () => {
      clearInterval(interval);
    });

    connection.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
      clearInterval(interval);
    });
  });

  // GET /metrics/historical
  fastify.get('/historical', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { timeframe } = request.query as { timeframe?: '24h' | '7d' | '30d' };
      
      const kpis = await metricsService.getHistoricalKPIs(timeframe || '24h');
      
      return reply.send(kpis);
    } catch (error) {
      throw error;
    }
  });

  // GET /metrics/network-status
  fastify.get('/network-status', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const status = await metricsService.getNetworkStatus();
      
      return reply.send(status);
    } catch (error) {
      throw error;
    }
  });

  // POST /metrics/fill (for adding new fills)
  fastify.post('/fill', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const fill = request.body as any;
      
      await metricsService.addFill(fill);
      
      return reply.send({ success: true });
    } catch (error) {
      throw error;
    }
  });
}
