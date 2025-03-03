import type { Config } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('Missing env.DATABASE_URL');
}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  driver: 'postgres',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config; 