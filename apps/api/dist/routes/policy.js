import { CreatePolicyRequestSchema } from '@usain/sdk';
import { registerRouteSchema } from '../middleware/validation.js';
export async function policyRoutes(fastify, options) {
    const { policyService } = options;
    // Register validation schemas
    registerRouteSchema('POST:/policies/create', {
        body: CreatePolicyRequestSchema,
    });
    // GET /policies
    fastify.get('/', async (request, reply) => {
        try {
            const { page, limit } = request.query;
            const params = {
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
            };
            const policies = await policyService.getPolicies(params);
            return reply.send(policies);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /policies/:id
    fastify.get('/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const policy = await policyService.getPolicy(id);
            return reply.send(policy);
        }
        catch (error) {
            throw error;
        }
    });
    // POST /policies/create
    fastify.post('/create', async (request, reply) => {
        try {
            const policyData = request.body;
            const policy = await policyService.createPolicy(policyData);
            return reply.send(policy);
        }
        catch (error) {
            throw error;
        }
    });
    // POST /policies/:id/pause
    fastify.post('/:id/pause', async (request, reply) => {
        try {
            const { id } = request.params;
            const policy = await policyService.pausePolicy(id);
            return reply.send(policy);
        }
        catch (error) {
            throw error;
        }
    });
    // POST /policies/:id/resume
    fastify.post('/:id/resume', async (request, reply) => {
        try {
            const { id } = request.params;
            const policy = await policyService.resumePolicy(id);
            return reply.send(policy);
        }
        catch (error) {
            throw error;
        }
    });
    // POST /policies/:id/revoke
    fastify.post('/:id/revoke', async (request, reply) => {
        try {
            const { id } = request.params;
            await policyService.revokePolicy(id);
            return reply.send({ success: true });
        }
        catch (error) {
            throw error;
        }
    });
    // GET /policies/active
    fastify.get('/active', async (request, reply) => {
        try {
            const policy = await policyService.getActivePolicy();
            return reply.send(policy);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /policies/:id/stats
    fastify.get('/:id/stats', async (request, reply) => {
        try {
            const { id } = request.params;
            const stats = await policyService.getPolicyStats(id);
            return reply.send(stats);
        }
        catch (error) {
            throw error;
        }
    });
    // POST /policies/validate
    fastify.post('/validate', async (request, reply) => {
        try {
            const { policyId, intent } = request.body;
            const validation = await policyService.validatePolicy(policyId, intent);
            return reply.send(validation);
        }
        catch (error) {
            throw error;
        }
    });
}
//# sourceMappingURL=policy.js.map