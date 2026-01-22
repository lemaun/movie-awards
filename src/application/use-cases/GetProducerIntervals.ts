import { IMovieRepository } from '../../domain/repositories/IMovieRepository.js';
import { ProducerIntervalsResult, ProducerInterval } from '../../shared/types/ProducerInterval.js';

export class GetProducerIntervals {
  constructor(private movieRepository: IMovieRepository) { }

  async execute(): Promise<ProducerIntervalsResult> {
    const winners = this.movieRepository.findWinners();

    const producerWins = new Map<string, number[]>();

    for (const movie of winners) {
      const producers = this.parseProducers(movie.producers);

      for (const producer of producers) {
        if (!producerWins.has(producer)) {
          producerWins.set(producer, []);
        }
        producerWins.get(producer)!.push(movie.year);
      }
    }

    const intervals: ProducerInterval[] = [];

    for (const [producer, years] of producerWins.entries()) {
      if (years.length < 2) continue;

      const sortedYears = [...years].sort((a, b) => a - b);

      for (let i = 0; i < sortedYears.length - 1; i++) {
        const previousWin = sortedYears[i];
        const followingWin = sortedYears[i + 1];
        const interval = followingWin - previousWin;

        intervals.push({
          producer,
          interval,
          previousWin,
          followingWin,
        });
      }
    }

    if (intervals.length === 0) {
      return { min: [], max: [] };
    }

    const minInterval = Math.min(...intervals.map((i) => i.interval));
    const maxInterval = Math.max(...intervals.map((i) => i.interval));

    const minCandidates = intervals.filter((i) => i.interval === minInterval);
    const maxCandidates = intervals.filter((i) => i.interval === maxInterval);

    const sortByProducer = (list: ProducerInterval[]) =>
      [...list].sort((a, b) => a.producer.localeCompare(b.producer));

    return {
      min: sortByProducer(minCandidates),
      max: sortByProducer(maxCandidates),
    };
  }

  private parseProducers(producersString: string): string[] {
    return producersString
      .split(/,| and /i)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }
}
