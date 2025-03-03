import { 
  pgTable, 
  serial, 
  integer, 
  varchar, 
  timestamp, 
  unique, 
  index,
  boolean,
  uuid
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { leagues } from './leagues';
import { teams } from './teams';

export const schedules = pgTable(
    "schedules",
    {
      id: serial("id").primaryKey(),
      leagueId: uuid("league_id").references(() => leagues.id),
      scheduleId: varchar("schedule_id", { length: 20 }),
      weekIndex: integer("week_index"),
      seasonIndex: integer("season_index"),
      stageIndex: integer("stage_index"),
      homeTeamId: uuid("home_team_id").references(() => teams.id),
      awayTeamId: uuid("away_team_id").references(() => teams.id),
      homeScore: integer("home_score"),
      awayScore: integer("away_score"),
      status: integer("status"),
      isGameOfTheWeek: boolean("is_game_of_the_week"),
      createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
      scheduleUnique: unique().on(table.leagueId, table.scheduleId),
      leagueScheduleIdx: index("idx_schedules_league").on(table.leagueId),
      weekIdx: index("idx_schedules_week").on(table.leagueId, table.weekIndex, table.seasonIndex),
    })
  );
  
  export const schedulesRelations = relations(schedules, ({ one }) => ({
    league: one(leagues, {
      fields: [schedules.leagueId],
      references: [leagues.id],
    }),
    homeTeam: one(teams, {
      fields: [schedules.homeTeamId],
      references: [teams.id],
    }),
    awayTeam: one(teams, {
      fields: [schedules.awayTeamId],
      references: [teams.id],
    }),
  }));
  