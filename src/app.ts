import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { MovieController } from './presentation/controllers/MovieController.js';
import { movieRoutes } from './presentation/routes/movieRoutes.js';
import { errorHandler } from './presentation/middlewares/errorHandler.js';
import { IMovieRepository } from './domain/repositories/IMovieRepository.js';

export async function buildApp(movieRepository: IMovieRepository) {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Registrar plugins
  await app.register(cors, {
    origin: '*',
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Golden Raspberry Awards API',
        description: 'API RESTful para consulta de indicados e vencedores do Pior Filme',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
        },
      ],
      tags: [
        {
          name: 'Movies',
          description: 'Movie related endpoints',
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  // Criar controller
  const movieController = new MovieController(movieRepository);

  // Registrar rotas
  await app.register(
    async (instance) => {
      await movieRoutes(instance, movieController);
    },
    { prefix: '/api/movies' }
  );

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Registrar error handler
  app.setErrorHandler(errorHandler);

  return app;
}
