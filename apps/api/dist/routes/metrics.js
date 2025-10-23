export async function metricsRoutes(fastify, options) {
    const { metricsService } = options;
    // GET /metrics/kpis
    fastify.get('/kpis', async (request, reply) => {
        try {
            const kpis = await metricsService.getKPIs();
            return reply.send(kpis);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /metrics/fills
    fastify.get('/fills', async (request, reply) => {
        try {
            const { limit } = request.query;
            const fills = await metricsService.getRecentFills(limit ? parseInt(limit) : 10);
            return reply.send(fills);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /metrics/live (SSE endpoint)
    fastify.get('/live', { websocket: true }, async (connection, request) => {
        connection.socket.on('message', (message) => {
            // Handle any incoming messages if needed
            console.log('Received message:', message.toString());
        });
        // Send initial data
        try {
            const initialMetrics = await metricsService.getMetricsForSSE();
            connection.socket.send(`data: ${JSON.stringify(initialMetrics)}\n\n`);
        }
        catch (error) {
            console.error('Failed to send initial metrics:', error);
        }
        // Set up interval to send updates every 2 seconds
        const interval = setInterval(async () => {
            try {
                const metrics = await metricsService.getMetricsForSSE();
                connection.socket.send(`data: ${JSON.stringify(metrics)}\n\n`);
            }
            catch (error) {
                console.error('Failed to send metrics update:', error);
            }
        }, 2000);
        // Clean up on disconnect
        connection.socket.on('close', () => {
            clearInterval(interval);
        });
        connection.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
            clearInterval(interval);
        });
    });
    // GET /metrics/historical
    fastify.get('/historical', async (request, reply) => {
        try {
            const { timeframe } = request.query;
            const kpis = await metricsService.getHistoricalKPIs(timeframe || '24h');
            return reply.send(kpis);
        }
        catch (error) {
            throw error;
        }
    });
    // GET /metrics/network-status
    fastify.get('/network-status', async (request, reply) => {
        try {
            const status = await metricsService.getNetworkStatus();
            return reply.send(status);
        }
        catch (error) {
            throw error;
        }
    });
    // POST /metrics/fill (for adding new fills)
    fastify.post('/fill', async (request, reply) => {
        try {
            const fill = request.body;
            await metricsService.addFill(fill);
            return reply.send({ success: true });
        }
        catch (error) {
            throw error;
        }
    });
}
//# sourceMappingURL=metrics.js.map