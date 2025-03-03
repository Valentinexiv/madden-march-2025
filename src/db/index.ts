import { drizzle } from 'drizzle-orm/postgres-js';
// @ts-ignore - This will be installed
import postgres from 'postgres';
import * as schema from './schema';

// Database connection string from environment variables
// @ts-ignore - This will be fixed when @types/node is installed
const connectionString = process.env.DATABASE_URL || '';

// Create postgres connection
const client = postgres(connectionString);

// Create drizzle database instance with schema
export const db = drizzle(client, { schema });

// Export schema for migrations and other uses
export { schema }; 