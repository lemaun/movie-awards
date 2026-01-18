import { FastifyRequest, FastifyReply } from 'fastify';
import { GetProducerIntervals } from '../../application/use-cases/GetProducerIntervals.js';
import { GetMovies } from '../../application/use-cases/GetMovies.js';
import { IMovieRepository } from '../../domain/repositories/IMovieRepository.js';
import { yearParamSchema, producerQuerySchema } from '../validators/movieValidators.js';

export class MovieController {
  private getProducerIntervalsUseCase: GetProducerIntervals;
  private getMoviesUseCase: GetMovies;

  constructor(movieRepository: IMovieRepository) {
    this.getProducerIntervalsUseCase = new GetProducerIntervals(movieRepository);
    this.getMoviesUseCase = new GetMovies(movieRepository);
  }

  async getProducerIntervals(_request: FastifyRequest, reply: FastifyReply) {
    const result = await this.getProducerIntervalsUseCase.execute();
    return reply.status(200).send(result);
  }

  async getAllMovies(_request: FastifyRequest, reply: FastifyReply) {
    const movies = this.getMoviesUseCase.getAll();
    return reply.status(200).send(movies);
  }

  async getWinners(_request: FastifyRequest, reply: FastifyReply) {
    const winners = this.getMoviesUseCase.getWinners();
    return reply.status(200).send(winners);
  }

  async getByYear(
    request: FastifyRequest<{ Params: { year: string } }>,
    reply: FastifyReply
  ) {
    const validated = yearParamSchema.parse(request.params);
    const year = parseInt(validated.year, 10);
    const movies = this.getMoviesUseCase.getByYear(year);
    return reply.status(200).send(movies);
  }

  async getByProducer(
    request: FastifyRequest<{ Querystring: { name: string } }>,
    reply: FastifyReply
  ) {
    const validated = producerQuerySchema.parse(request.query);
    const movies = this.getMoviesUseCase.getByProducer(validated.name);
    return reply.status(200).send(movies);
  }
}
