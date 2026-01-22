import { Movie } from '../entities/Movie.js';

export interface IMovieRepository {
  findAll(): Movie[];
  findByYear(year: number): Movie[];
  findWinners(): Movie[];
  findByProducer(producerName: string): Movie[];
}
