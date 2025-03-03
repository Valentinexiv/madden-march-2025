import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { leagues } from './leagues';
import { users } from './users';

// Teams table
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  leagueId: uuid('league_id').references(() => leagues.id).notNull(),
  name: text('name').notNull(),
  abbreviation: text('abbreviation').notNull(),
  ownerId: uuid('owner_id').references(() => users.id),
  roster: jsonb('roster').default([]),
  depthChart: jsonb('depth_chart').default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 