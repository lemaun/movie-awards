import 'dotenv/config';
import { buildApp } from './app.js';
import { clearDatabase, initializeDatabase } from './infrastructure/database/sqlite.js';
import { loadCSVToDatabase } from './infrastructure/csv/CSVLoader.js';
import { SQLiteMovieRepository } from './infrastructure/repositories/SQLiteMovieRepository.js';

async function start() {
  try {
    console.log('🚀 Initializing database...');
    initializeDatabase();
    clearDatabase();

    console.log('📂 Loading CSV data...');
    const csvPath = process.env.MOVIELIST_PATH || undefined;
    const count = await loadCSVToDatabase(csvPath);
    console.log(`✅ Loaded ${count} movies successfully`);

    const movieRepository = new SQLiteMovieRepository();
    const app = await buildApp(movieRepository);

    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });

    console.log(`✅ Server listening on http://localhost:${port}`);
    console.log(`📚 API Documentation available at http://localhost:${port}/docs`);
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

start();
