import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import dotenv from 'dotenv';
import { QuoteService } from './services/QuoteService.js';
import { IntentService } from './services/IntentService.js';
import { ChannelService } from './services/ChannelService.js';
import { PolicyService } from './services/PolicyService.js';
import { MetricsService } from './services/MetricsService.js';
import { errorHandler } from './middleware/errorHandler.js';
import { validationMiddleware } from './middleware/validation.js';
import { quoteRoutes } from './routes/quote.js';
import { intentRoutes } from './routes/intent.js';
import { channelRoutes } from './routes/channel.js';
import { policyRoutes } from './routes/policy.js';
import { metricsRoutes } from './routes/metrics.js';
import { healthRoutes } from './routes/health.js';
// Load environment variables
dotenv.config();
const fastify = Fastify({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
    },
});
// Register plugins
await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
});
await fastify.register(websocket);
// Register middleware
fastify.setErrorHandler(errorHandler);
fastify.addHook('preHandler', validationMiddleware);
// Initialize services
const quoteService = new QuoteService();
const intentService = new IntentService();
const channelService = new ChannelService();
const policyService = new PolicyService();
const metricsService = new MetricsService();
// Register routes
await fastify.register(quoteRoutes, { prefix: '/intents', quoteService });
await fastify.register(intentRoutes, { prefix: '/intents', intentService });
await fastify.register(channelRoutes, { prefix: '/channel', channelService });
await fastify.register(policyRoutes, { prefix: '/policies', policyService });
await fastify.register(metricsRoutes, { prefix: '/metrics', metricsService });
await fastify.register(healthRoutes, { prefix: '/healthz' });
// Start server
const start = async () => {
    try {
        const port = Number(process.env.PORT) || 4000;
        const host = process.env.HOST || '0.0.0.0';
        await fastify.listen({ port, host });
        console.log(`🚀 USAIN API server running on http://${host}:${port}`);
        console.log(`📊 Health check: http://${host}:${port}/healthz`);
        console.log(`📈 Live metrics: http://${host}:${port}/metrics/live`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down server...');
    await fastify.close();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('🛑 Shutting down server...');
    await fastify.close();
    process.exit(0);
});
start();
//# sourceMappingURL=index.js.map