import { neon } from '@neondatabase/serverless';

import 'dotenv/config';

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
)`;
    await sql`CREATE TABLE IF NOT EXISTS routines (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  energy_level INTEGER,
  mood VARCHAR(255),
  sleep_hours INTEGER,
  did_sport BOOLEAN,
  completed_tasks INTEGER,
  added_tasks INTEGER,
  note TEXT,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, date)
)`;
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}
