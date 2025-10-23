export async function channelRoutes(fastify, options) {
    const { channelService } = options;
    // GET /channel/status
    fastify.get('/status', async (request, reply) => {
        try {
            const status = await channelService.getChannelStatus();
            return reply.send(status);
        }
        catch (error) {
            throw error;
        }
    });
    // POST /channel/open
    fastify.post('/open', async (request, reply) => {
        try {
            const { participants, initialDeposits } = request.body;
            const result = await channelService.openChannel({
                participants: participants || [],
                initialDeposits,
            });
            return reply.send(result);
        }
        catch (error) {
            throw error;
        }
    });
    // POST /channel/close
    fastify.post('/close', async (request, reply) => {
        try {
            const { channelId } = request.body;
            const result = await channelService.closeChannel(channelId);
            return reply.send(result);
        }
        catch (error) {
            throw error;
        }
    });
    // POST /channel/settle
    fastify.post('/settle', async (request, reply) => {
        try {
            const { channelId } = request.body;
            const result = await channelService.requestSettlement(channelId);
            return reply.send(result);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /channel/history
    fastify.get('/history', async (request, reply) => {
        try {
            const { channelId } = request.query;
            const history = await channelService.getChannelHistory(channelId);
            return reply.send(history);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /channel/gas-estimate
    fastify.get('/gas-estimate', async (request, reply) => {
        try {
            const { channelId } = request.query;
            const estimate = await channelService.estimateSettlementGas(channelId);
            return reply.send(estimate);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /channel/network-status
    fastify.get('/network-status', async (request, reply) => {
        try {
            const status = await channelService.getNetworkStatus();
            return reply.send(status);
        }
        catch (error) {
            throw error;
        }
    });
}
//# sourceMappingURL=channel.js.map