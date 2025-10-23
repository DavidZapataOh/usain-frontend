export async function healthRoutes(fastify) {
    // GET /healthz
    fastify.get('/', async (request, reply) => {
        try {
            const startTime = Date.now();
            // Check service dependencies
            const dependencies = await checkDependencies();
            const responseTime = Date.now() - startTime;
            const health = {
                status: 'ok',
                timestamp: Date.now(),
                responseTime,
                dependencies,
                version: process.env.npm_package_version || '0.1.0',
                environment: process.env.NODE_ENV || 'development',
            };
            return reply.send(health);
        }
        catch (error) {
            return reply.status(503).send({
                status: 'error',
                timestamp: Date.now(),
                error: error.message,
            });
        }
    });
    // GET /healthz/ready
    fastify.get('/ready', async (request, reply) => {
        try {
            const dependencies = await checkDependencies();
            const allHealthy = Object.values(dependencies).every(dep => dep.status === 'healthy');
            if (allHealthy) {
                return reply.send({ status: 'ready' });
            }
            else {
                return reply.status(503).send({ status: 'not ready', dependencies });
            }
        }
        catch (error) {
            return reply.status(503).send({
                status: 'not ready',
                error: error.message,
            });
        }
    });
    // GET /healthz/live
    fastify.get('/live', async (request, reply) => {
        return reply.send({ status: 'alive', timestamp: Date.now() });
    });
}
async function checkDependencies() {
    const dependencies = {};
    // Check Envio connection
    try {
        const startTime = Date.now();
        // This would be a real health check
        dependencies.envio = {
            status: 'healthy',
            responseTime: Date.now() - startTime,
        };
    }
    catch (error) {
        dependencies.envio = {
            status: 'unhealthy',
            error: error.message,
        };
    }
    // Check Lit Protocol connection
    try {
        const startTime = Date.now();
        // This would be a real health check
        dependencies.lit = {
            status: 'healthy',
            responseTime: Date.now() - startTime,
        };
    }
    catch (error) {
        dependencies.lit = {
            status: 'unhealthy',
            error: error.message,
        };
    }
    // Check Yellow network connection
    try {
        const startTime = Date.now();
        // This would be a real health check
        dependencies.yellow = {
            status: 'healthy',
            responseTime: Date.now() - startTime,
        };
    }
    catch (error) {
        dependencies.yellow = {
            status: 'unhealthy',
            error: error.message,
        };
    }
    // Check database connection (if using one)
    try {
        const startTime = Date.now();
        // This would be a real health check
        dependencies.database = {
            status: 'healthy',
            responseTime: Date.now() - startTime,
        };
    }
    catch (error) {
        dependencies.database = {
            status: 'unhealthy',
            error: error.message,
        };
    }
    return dependencies;
}
//# sourceMappingURL=health.js.map