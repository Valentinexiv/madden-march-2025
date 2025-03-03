import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { leagues } from './leagues';

// Discord Integration table
export const discordIntegrations = pgTable('discord_integrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  leagueId: uuid('league_id').references(() => leagues.id).notNull(),
  guildId: text('guild_id').notNull(),
  channelId: text('channel_id').notNull(),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 