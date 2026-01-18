import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import { db } from '../database/sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CSVRow {
  year: string;
  title: string;
  studios: string;
  producers: string;
  winner: string;
}

export async function loadCSVToDatabase(csvPath?: string): Promise<number> {
  const defaultPath = path.join(__dirname, '../../../movielist.csv');
  const filePath = csvPath || defaultPath;

  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found at: ${filePath}`);
  }

  return new Promise((resolve, reject) => {
    const movies: Array<{
      year: number;
      title: string;
      studios: string;
      producers: string;
      winner: number;
    }> = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row: CSVRow) => {
        try {
          // Parse dos dados
          const year = parseInt(row.year, 10);
          const title = row.title?.trim() || '';
          const studios = row.studios?.trim() || '';
          const producers = row.producers?.trim() || '';
          const winner = row.winner?.trim().toLowerCase() === 'yes' ? 1 : 0;

          // Validação básica
          if (!year || !title) {
            console.warn(`⚠️  Skipping invalid row: ${JSON.stringify(row)}`);
            return;
          }

          movies.push({ year, title, studios, producers, winner });
        } catch (error) {
          console.warn(`⚠️  Error parsing row: ${JSON.stringify(row)}`, error);
        }
      })
      .on('end', () => {
        try {
          // Inserção em lote usando transaction para performance
          const insertStmt = db.prepare(`
            INSERT INTO movies (year, title, studios, producers, winner)
            VALUES (?, ?, ?, ?, ?)
          `);

          const insertMany = db.transaction((moviesToInsert) => {
            for (const movie of moviesToInsert) {
              insertStmt.run(
                movie.year,
                movie.title,
                movie.studios,
                movie.producers,
                movie.winner
              );
            }
          });

          insertMany(movies);

          console.log(`✅ Loaded ${movies.length} movies from CSV to database`);
          resolve(movies.length);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
