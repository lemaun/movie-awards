import { IMovieRepository } from '../../domain/repositories/IMovieRepository.js';
import { Movie } from '../../domain/entities/Movie.js';

export class GetMovies {
  constructor(private movieRepository: IMovieRepository) {}

  getAll(): Movie[] {
    return this.movieRepository.findAll();
  }

  getByYear(year: number): Movie[] {
    return this.movieRepository.findByYear(year);
  }

  getWinners(): Movie[] {
    return this.movieRepository.findWinners();
  }

  getByProducer(producerName: string): Movie[] {
    return this.movieRepository.findByProducer(producerName);
  }
}
