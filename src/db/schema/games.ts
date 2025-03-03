import { pgTable, text, timestamp, integer, jsonb, uuid } from 'drizzle-orm/pg-core';
import { leagues } from './leagues';
import { teams } from './teams';

// Games table
export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  leagueId: uuid('league_id').references(() => leagues.id).notNull(),
  homeTeamId: uuid('home_team_id').references(() => teams.id).notNull(),
  awayTeamId: uuid('away_team_id').references(() => teams.id).notNull(),
  week: integer('week').notNull(),
  season: integer('season').notNull(),
  status: text('status').notNull(), // 'scheduled', 'in_progress', 'completed'
  homeScore: integer('home_score'),
  awayScore: integer('away_score'),
  stats: jsonb('stats').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Standings table
export const standings = pgTable('standings', {
  id: uuid('id').primaryKey().defaultRandom(),
  leagueId: uuid('league_id').references(() => leagues.id).notNull(),
  teamId: uuid('team_id').references(() => teams.id).notNull(),
  wins: integer('wins').notNull().default(0),
  losses: integer('losses').notNull().default(0),
  ties: integer('ties').notNull().default(0),
  pointsFor: integer('points_for').notNull().default(0),
  pointsAgainst: integer('points_against').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 