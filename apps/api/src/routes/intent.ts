import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IntentService } from '../services/IntentService.js';
import { SubmitIntentRequestSchema } from '@usain/sdk';
import { registerRouteSchema } from '../middleware/validation.js';

export async function intentRoutes(
  fastify: FastifyInstance,
  options: { intentService: IntentService }
) {
  const { intentService } = options;

  // Register validation schema
  registerRouteSchema('POST:/intents/submit', {
    body: SubmitIntentRequestSchema,
  });

  // POST /intents/submit
  fastify.post('/submit', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const submitRequest = request.body as any;
      const response = await intentService.submitIntent(submitRequest);
      
      return reply.send(response);
    } catch (error) {
      throw error;
    }
  });

  // GET /intents/:fillId/status
  fastify.get('/:fillId/status', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { fillId } = request.params as { fillId: string };
      
      const status = await intentService.getIntentStatus(fillId);
      
      return reply.send(status);
    } catch (error) {
      throw error;
    }
  });
}

