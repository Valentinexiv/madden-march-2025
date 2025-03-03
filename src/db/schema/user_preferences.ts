import { pgTable, uuid, boolean, timestamp, text } from 'drizzle-orm/pg-core';

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull(),
  email_notifications: boolean('email_notifications').default(false),
  discord_notifications: boolean('discord_notifications').default(true),
  discord_dm_notifications: boolean('discord_dm_notifications').default(true),
  discord_channel_notifications: boolean('discord_channel_notifications').default(true),
  theme: text('theme').default('light'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert; 