import 'dotenv/config';
import { buildApp } from './app.js';
import { initializeDatabase } from './infrastructure/database/sqlite.js';
import { loadCSVToDatabase } from './infrastructure/csv/CSVLoader.js';
import { SQLiteMovieRepository } from './infrastructure/repositories/SQLiteMovieRepository.js';

async function start() {
  try {
    // Inicializar banco de dados
    console.log('🚀 Initializing database...');
    initializeDatabase();

    // Carregar dados do CSV
    console.log('📂 Loading CSV data...');
    const csvPath = process.env.MOVIELIST_PATH || undefined;
    const count = await loadCSVToDatabase(csvPath);
    console.log(`✅ Loaded ${count} movies successfully`);

    // Criar repositório
    const movieRepository = new SQLiteMovieRepository();

    // Construir aplicação
    const app = await buildApp(movieRepository);

    // Iniciar servidor
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
