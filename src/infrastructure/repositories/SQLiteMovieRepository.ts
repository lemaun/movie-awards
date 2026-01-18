import { IMovieRepository } from '../../domain/repositories/IMovieRepository.js';
import { Movie } from '../../domain/entities/Movie.js';
import { db } from '../database/sqlite.js';

export class SQLiteMovieRepository implements IMovieRepository {
  findAll(): Movie[] {
    const stmt = db.prepare('SELECT * FROM movies ORDER BY year, title');
    const rows = stmt.all() as Array<{
      id: number;
      year: number;
      title: string;
      studios: string;
      producers: string;
      winner: number;
    }>;

    return rows.map((row) => ({
      id: row.id,
      year: row.year,
      title: row.title,
      studios: row.studios,
      producers: row.producers,
      winner: row.winner === 1,
    }));
  }

  findByYear(year: number): Movie[] {
    const stmt = db.prepare('SELECT * FROM movies WHERE year = ? ORDER BY title');
    const rows = stmt.all(year) as Array<{
      id: number;
      year: number;
      title: string;
      studios: string;
      producers: string;
      winner: number;
    }>;

    return rows.map((row) => ({
      id: row.id,
      year: row.year,
      title: row.title,
      studios: row.studios,
      producers: row.producers,
      winner: row.winner === 1,
    }));
  }

  findWinners(): Movie[] {
    const stmt = db.prepare('SELECT * FROM movies WHERE winner = 1 ORDER BY year, title');
    const rows = stmt.all() as Array<{
      id: number;
      year: number;
      title: string;
      studios: string;
      producers: string;
      winner: number;
    }>;

    return rows.map((row) => ({
      id: row.id,
      year: row.year,
      title: row.title,
      studios: row.studios,
      producers: row.producers,
      winner: row.winner === 1,
    }));
  }

  findByProducer(producerName: string): Movie[] {
    const stmt = db.prepare('SELECT * FROM movies WHERE producers LIKE ? ORDER BY year, title');
    const rows = stmt.all(`%${producerName}%`) as Array<{
      id: number;
      year: number;
      title: string;
      studios: string;
      producers: string;
      winner: number;
    }>;

    return rows.map((row) => ({
      id: row.id,
      year: row.year,
      title: row.title,
      studios: row.studios,
      producers: row.producers,
      winner: row.winner === 1,
    }));
  }
}
