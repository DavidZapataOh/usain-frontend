import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, ZodError } from 'zod';

// Store schemas for different routes
const routeSchemas = new Map<string, {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}>();

export function registerRouteSchema(
  route: string,
  schemas: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
  }
) {
  routeSchemas.set(route, schemas);
}

export async function validationMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
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
  } catch (error) {
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
export function createRouteHandler<T = any>(
  handler: (request: FastifyRequest, reply: FastifyReply) => Promise<T>,
  schemas?: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
  }
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await handler(request, reply);
      return result;
    } catch (error) {
      throw error;
    }
  };
}

