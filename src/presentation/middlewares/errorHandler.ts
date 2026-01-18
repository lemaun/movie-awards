import 'dotenv/config';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../../shared/errors/AppError.js';
import { ZodError } from 'zod';

export async function errorHandler(error: Error, _request: FastifyRequest, reply: FastifyReply) {
  // Erro customizado da aplicação
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      statusCode: error.statusCode,
    });
  }

  // Erro de validação Zod
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Validation error',
      details: error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Erro genérico
  console.error('Unhandled error:', error);
  return reply.status(500).send({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
}
