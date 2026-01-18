import { IMovieRepository } from '../../domain/repositories/IMovieRepository.js';
import {
  ProducerIntervalsResult,
  ProducerInterval,
} from '../../shared/types/ProducerInterval.js';

export class GetProducerIntervals {
  constructor(private movieRepository: IMovieRepository) { }

  async execute(): Promise<ProducerIntervalsResult> {
    // 1. Buscar todos os filmes vencedores
    const winners = this.movieRepository.findWinners(); // Provavelmente, com banco de dados em produção, esse método será async

    // 2. Agrupar por produtor
    const producerWins = new Map<string, number[]>();

    for (const movie of winners) {
      // Parse de produtores (separados por vírgula ou " and ")
      const producers = this.parseProducers(movie.producers);

      for (const producer of producers) {
        if (!producerWins.has(producer)) {
          producerWins.set(producer, []);
        }
        producerWins.get(producer)!.push(movie.year);
      }
    }

    // 3. Calcular intervalos para produtores com 2+ vitórias
    const intervals: ProducerInterval[] = [];

    for (const [producer, years] of producerWins.entries()) {
      if (years.length < 2) continue;

      // Ordenar anos
      const sortedYears = [...years].sort((a, b) => a - b);

      // Calcular todos os intervalos consecutivos
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

    // 4. Encontrar menor e maior intervalo
    if (intervals.length === 0) {
      return { min: [], max: [] };
    }

    // 5. Remover registros com mesmo tamanho de intervalo de anos de um mesmo produtor
    const pickOnePerProducer = (list: ProducerInterval[]) => {
      const seen = new Set<string>();
      const out: ProducerInterval[] = [];

      for (const item of list) {
        if (seen.has(item.producer)) continue;
        seen.add(item.producer);
        out.push(item);
      }

      return out;
    };

    const minInterval = Math.min(...intervals.map((i) => i.interval));
    const maxInterval = Math.max(...intervals.map((i) => i.interval));

    const minCandidates = intervals.filter((i) => i.interval === minInterval);
    const maxCandidates = intervals.filter((i) => i.interval === maxInterval);

    // 6. Retornar apenas um resultado por produtor e ordenar por nome para determinismo
    const sortByProducer = (list: ProducerInterval[]) =>
      [...list].sort((a, b) => a.producer.localeCompare(b.producer));

    // Multiplos ganhadores no mesmo ano são considerados prêmios consecutivos (interval = 0)
    return {
      min: sortByProducer(pickOnePerProducer(minCandidates)),
      max: sortByProducer(pickOnePerProducer(maxCandidates)),
    };
  }

  /**
   * Parse produtores do campo producers
   * Separadores: vírgula, " and ", " and\n", etc.
   */
  private parseProducers(producersString: string): string[] {
    return producersString
      .split(/,| and /i)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }
}
