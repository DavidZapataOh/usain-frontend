import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { SDKError } from '@usain/sdk';

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error
  request.log.error(error);

  // Handle SDK errors
  if (error instanceof SDKError) {
    return reply.status(error.statusCode || 500).send({
      error: {
        code: error.code,
        message: (error as Error).message,
        details: (error as any).details,
      },
    });
  }

  // Handle validation errors
  if (error.validation) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.validation,
      },
    });
  }

  // Handle JSON parsing errors
  if (error.code === 'FST_ERR_VALIDATION') {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid JSON format',
        details: (error as Error).message,
      },
    });
  }

  // Handle rate limit errors
  if (error.statusCode === 429) {
    return reply.status(429).send({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        details: 'Please try again later',
      },
    });
  }

  // Handle generic errors
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : (error as Error).message;

  return reply.status(statusCode).send({
    error: {
      code: 'INTERNAL_ERROR',
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
}
