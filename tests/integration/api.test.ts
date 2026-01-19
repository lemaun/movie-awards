import 'dotenv/config';
import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../../src/app.js';
import { initializeDatabase, clearDatabase } from '../../src/infrastructure/database/sqlite.js';
import { loadCSVToDatabase } from '../../src/infrastructure/csv/CSVLoader.js';
import { SQLiteMovieRepository } from '../../src/infrastructure/repositories/SQLiteMovieRepository.js';

describe('Integration Tests - Producer Intervals API', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    initializeDatabase();
    clearDatabase();
    await loadCSVToDatabase(process.env.MOVIELIST_PATH || undefined);

    const movieRepository = new SQLiteMovieRepository();
    app = await buildApp(movieRepository);
  });

  describe('GET /api/movies/producer-intervals', () => {
    it('should return correct structure with min and max intervals', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/movies/producer-intervals',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);

      expect(body).toHaveProperty('min');
      expect(body).toHaveProperty('max');
      expect(Array.isArray(body.min)).toBe(true);
      expect(Array.isArray(body.max)).toBe(true);

      if (body.min.length > 0) {
        expect(body.min[0]).toHaveProperty('producer');
        expect(body.min[0]).toHaveProperty('interval');
        expect(body.min[0]).toHaveProperty('previousWin');
        expect(body.min[0]).toHaveProperty('followingWin');
      }

      if (body.max.length > 0) {
        expect(body.max[0]).toHaveProperty('producer');
        expect(body.max[0]).toHaveProperty('interval');
        expect(body.max[0]).toHaveProperty('previousWin');
        expect(body.max[0]).toHaveProperty('followingWin');
      }
    });

    it('should have min interval less than or equal to max interval', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/movies/producer-intervals',
      });

      const body = JSON.parse(response.body);

      if (body.min.length > 0 && body.max.length > 0) {
        const minInterval = body.min[0].interval;
        const maxInterval = body.max[0].interval;
        expect(minInterval).toBeLessThanOrEqual(maxInterval);
      }
    });
  });

  describe('GET /api/movies', () => {
    it('should return all movies from CSV', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/movies',
      });

      expect(response.statusCode).toBe(200);
      const movies = JSON.parse(response.body);
      expect(Array.isArray(movies)).toBe(true);
      expect(movies.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/movies/winners', () => {
    it('should return only winner movies', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/movies/winners',
      });

      expect(response.statusCode).toBe(200);
      const winners = JSON.parse(response.body);
      expect(Array.isArray(winners)).toBe(true);

      winners.forEach((movie: any) => {
        expect(movie.winner).toBe(true);
      });
    });
  });

  describe('GET /api/movies/year/:year', () => {
    it('should return movies from specific year', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/movies/year/1990',
      });

      expect(response.statusCode).toBe(200);
      const movies = JSON.parse(response.body);
      expect(Array.isArray(movies)).toBe(true);

      movies.forEach((movie: any) => {
        expect(movie.year).toBe(1990);
      });
    });

    it('should return 400 for invalid year format', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/movies/year/abc',
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe('ok');
      expect(body).toHaveProperty('timestamp');
    });
  });
});
