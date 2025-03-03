import { pgTable, text, timestamp, integer, jsonb, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';

// Leagues table
export const leagues = pgTable('leagues', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  platform: text('platform').notNull(), // 'PS5', 'Xbox', etc.
  commissionerId: uuid('commissioner_id').references(() => users.id).notNull(),
  season: integer('season').notNull(),
  week: integer('week').notNull(),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// League Members table (for tracking who has access to which leagues)
export const leagueMembers = pgTable('league_members', {
  leagueId: uuid('league_id').references(() => leagues.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: text('role').notNull(), // 'commissioner', 'owner', 'member'
}, (table) => ({
  pk: primaryKey({ columns: [table.leagueId, table.userId] }),
})); 