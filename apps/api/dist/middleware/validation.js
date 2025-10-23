import { ZodError } from 'zod';
// Store schemas for different routes
const routeSchemas = new Map();
export function registerRouteSchema(route, schemas) {
    routeSchemas.set(route, schemas);
}
export async function validationMiddleware(request, reply) {
    const route = `${request.method}:${request.routerPath}`;
    const schemas = routeSchemas.get(route);
    if (!schemas) {
        return; // No validation needed for this route
    }
    try {
        // Validate request body
        if (schemas.body && request.body) {
            request.body = schemas.body.parse(request.body);
        }
        // Validate query parameters
        if (schemas.query && request.query) {
            request.query = schemas.query.parse(request.query);
        }
        // Validate route parameters
        if (schemas.params && request.params) {
            request.params = schemas.params.parse(request.params);
        }
    }
    catch (error) {
        if (error instanceof ZodError) {
            return reply.status(400).send({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Request validation failed',
                    details: error.errors,
                },
            });
        }
        throw error;
    }
}
// Helper function to create route handlers with validation
export function createRouteHandler(handler, schemas) {
    return async (request, reply) => {
        try {
            const result = await handler(request, reply);
            return result;
        }
        catch (error) {
            throw error;
        }
    };
}
//# sourceMappingURL=validation.js.map