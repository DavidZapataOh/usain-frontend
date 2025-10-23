import { SubmitIntentRequestSchema } from '@usain/sdk';
import { registerRouteSchema } from '../middleware/validation.js';
export async function intentRoutes(fastify, options) {
    const { intentService } = options;
    // Register validation schema
    registerRouteSchema('POST:/intents/submit', {
        body: SubmitIntentRequestSchema,
    });
    // POST /intents/submit
    fastify.post('/submit', async (request, reply) => {
        try {
            const submitRequest = request.body;
            const response = await intentService.submitIntent(submitRequest);
            return reply.send(response);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /intents/:fillId/status
    fastify.get('/:fillId/status', async (request, reply) => {
        try {
            const { fillId } = request.params;
            const status = await intentService.getIntentStatus(fillId);
            return reply.send(status);
        }
        catch (error) {
            throw error;
        }
    });
}
//# sourceMappingURL=intent.js.map