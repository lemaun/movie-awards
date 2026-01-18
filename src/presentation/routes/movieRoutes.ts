import { FastifyInstance } from 'fastify';
import { MovieController } from '../controllers/MovieController.js';

export async function movieRoutes(
  fastify: FastifyInstance,
  movieController: MovieController
) {
  // Endpoint principal - Intervalos de produtores
  fastify.get(
    '/producer-intervals',
    {
      schema: {
        description: 'Get producer award intervals (min and max)',
        tags: ['Movies'],
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              min: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    producer: { type: 'string' },
                    interval: { type: 'number' },
                    previousWin: { type: 'number' },
                    followingWin: { type: 'number' },
                  },
                },
              },
              max: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    producer: { type: 'string' },
                    interval: { type: 'number' },
                    previousWin: { type: 'number' },
                    followingWin: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
    movieController.getProducerIntervals.bind(movieController)
  );

  // Listar todos os filmes
  fastify.get(
    '/',
    {
      schema: {
        description: 'Get all movies',
        tags: ['Movies'],
        response: {
          200: {
            description: 'List of movies',
            type: 'array',
          },
        },
      },
    },
    movieController.getAllMovies.bind(movieController)
  );

  // Listar apenas vencedores
  fastify.get(
    '/winners',
    {
      schema: {
        description: 'Get winner movies only',
        tags: ['Movies'],
        response: {
          200: {
            description: 'List of winner movies',
            type: 'array',
          },
        },
      },
    },
    movieController.getWinners.bind(movieController)
  );

  // Buscar por ano
  fastify.get(
    '/year/:year',
    {
      schema: {
        description: 'Get movies by year',
        tags: ['Movies'],
        params: {
          type: 'object',
          properties: {
            year: { type: 'string', pattern: '^\\d{4}$' },
          },
          required: ['year'],
        },
        response: {
          200: {
            description: 'Movies from specified year',
            type: 'array',
          },
        },
      },
    },
    movieController.getByYear.bind(movieController)
  );

  // Buscar por produtor
  fastify.get(
    '/producer',
    {
      schema: {
        description: 'Search movies by producer name',
        tags: ['Movies'],
        querystring: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
          required: ['name'],
        },
        response: {
          200: {
            description: 'Movies from specified producer',
            type: 'array',
          },
        },
      },
    },
    movieController.getByProducer.bind(movieController)
  );
}
