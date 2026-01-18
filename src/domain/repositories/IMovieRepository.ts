import { Movie } from '../entities/Movie.js';

export interface IMovieRepository {
  /**
   * Retorna todos os filmes
   */
  findAll(): Movie[];

  /**
   * Retorna filmes de um ano específico
   */
  findByYear(year: number): Movie[];

  /**
   * Retorna apenas os filmes vencedores
   */
  findWinners(): Movie[];

  /**
   * Retorna filmes de um produtor específico (busca parcial no campo producers)
   */
  findByProducer(producerName: string): Movie[];
}
