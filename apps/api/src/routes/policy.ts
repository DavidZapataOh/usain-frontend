import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PolicyService } from '../services/PolicyService.js';
import { CreatePolicyRequestSchema } from '@usain/sdk';
import { registerRouteSchema } from '../middleware/validation.js';

export async function policyRoutes(
  fastify: FastifyInstance,
  options: { policyService: PolicyService }
) {
  const { policyService } = options;

  // Register validation schemas
  registerRouteSchema('POST:/policies/create', {
    body: CreatePolicyRequestSchema,
  });

  // GET /policies
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page, limit } = request.query as { page?: string; limit?: string };
      
      const params = {
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
      };
      
      const policies = await policyService.getPolicies(params);
      
      return reply.send(policies);
    } catch (error) {
      throw error;
    }
  });

  // GET /policies/:id
  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      
      const policy = await policyService.getPolicy(id);
      
      return reply.send(policy);
    } catch (error) {
      throw error;
    }
  });

  // POST /policies/create
  fastify.post('/create', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const policyData = request.body as any;
      
      const policy = await policyService.createPolicy(policyData);
      
      return reply.send(policy);
    } catch (error) {
      throw error;
    }
  });

  // POST /policies/:id/pause
  fastify.post('/:id/pause', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      
      const policy = await policyService.pausePolicy(id);
      
      return reply.send(policy);
    } catch (error) {
      throw error;
    }
  });

  // POST /policies/:id/resume
  fastify.post('/:id/resume', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      
      const policy = await policyService.resumePolicy(id);
      
      return reply.send(policy);
    } catch (error) {
      throw error;
    }
  });

  // POST /policies/:id/revoke
  fastify.post('/:id/revoke', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      
      await policyService.revokePolicy(id);
      
      return reply.send({ success: true });
    } catch (error) {
      throw error;
    }
  });

  // GET /policies/active
  fastify.get('/active', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const policy = await policyService.getActivePolicy();
      
      return reply.send(policy);
    } catch (error) {
      throw error;
    }
  });

  // GET /policies/:id/stats
  fastify.get('/:id/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      
      const stats = await policyService.getPolicyStats(id);
      
      return reply.send(stats);
    } catch (error) {
      throw error;
    }
  });

  // POST /policies/validate
  fastify.post('/validate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { policyId, intent } = request.body as {
        policyId: string;
        intent: {
          pair: string;
          amount: string;
          userAddress: string;
        };
      };
      
      const validation = await policyService.validatePolicy(policyId, intent);
      
      return reply.send(validation);
    } catch (error) {
      throw error;
    }
  });
}

