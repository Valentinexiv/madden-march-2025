import { pgTable, text, timestamp, integer, jsonb, uuid } from 'drizzle-orm/pg-core';
import { leagues } from './leagues';
import { teams } from './teams';

// Players table
export const players = pgTable('players', {
  id: uuid('id').primaryKey().defaultRandom(),
  leagueId: uuid('league_id').references(() => leagues.id).notNull(),
  teamId: uuid('team_id').references(() => teams.id),
  name: text('name').notNull(),
  position: text('position').notNull(),
  overall: integer('overall').notNull(),
  age: integer('age').notNull(),
  attributes: jsonb('attributes').default({}),
  stats: jsonb('stats').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 