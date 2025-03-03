import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('Missing env.DATABASE_URL');
}

// Create the connection
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

// Create the database instance
export const db = drizzle(client, { schema });

// Export a type for the database instance
export type Database = typeof db;

// Helper function to get the database instance
export const getDatabase = () => {
  return db;
}; 