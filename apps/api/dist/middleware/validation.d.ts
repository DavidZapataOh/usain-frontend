import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema } from 'zod';
export declare function registerRouteSchema(route: string, schemas: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}): void;
export declare function validationMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<undefined>;
export declare function createRouteHandler<T = any>(handler: (request: FastifyRequest, reply: FastifyReply) => Promise<T>, schemas?: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}): (request: FastifyRequest, reply: FastifyReply) => Promise<T>;
//# sourceMappingURL=validation.d.ts.map