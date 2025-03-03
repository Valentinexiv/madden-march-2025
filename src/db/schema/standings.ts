import { 
  pgTable, 
  serial, 
  integer, 
  varchar, 
  decimal,
  timestamp, 
  unique, 
  index,
  bigint,
  uuid
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { leagues } from './leagues';
import { teams } from './teams';

export const standings = pgTable(
    "standings",
    {
      id: serial("id").primaryKey(),
      leagueId: uuid("league_id").references(() => leagues.id),
      teamId: varchar("team_id", { length: 20 }),
      weekIndex: integer("week_index"),
      seasonIndex: integer("season_index"),
      stageIndex: integer("stage_index"),
      calendarYear: integer("calendar_year"),
      rank: integer("rank"),
      prevRank: integer("prev_rank"),
      seed: integer("seed"),
      totalWins: integer("total_wins"),
      totalLosses: integer("total_losses"),
      totalTies: integer("total_ties"),
      winPct: decimal("win_pct", { precision: 5, scale: 3 }),
      homeWins: integer("home_wins"),
      homeLosses: integer("home_losses"),
      homeTies: integer("home_ties"),
      awayWins: integer("away_wins"),
      awayLosses: integer("away_losses"),
      awayTies: integer("away_ties"),
      divWins: integer("div_wins"),
      divLosses: integer("div_losses"),
      divTies: integer("div_ties"),
      confWins: integer("conf_wins"),
      confLosses: integer("conf_losses"),
      confTies: integer("conf_ties"),
      ptsFor: integer("pts_for"),
      ptsAgainst: integer("pts_against"),
      netPts: integer("net_pts"),
      ptsForRank: integer("pts_for_rank"),
      ptsAgainstRank: integer("pts_against_rank"),
      offTotalYds: integer("off_total_yds"),
      offTotalYdsRank: integer("off_total_yds_rank"),
      defTotalYds: integer("def_total_yds"),
      defTotalYdsRank: integer("def_total_yds_rank"),
      winLossStreak: integer("win_loss_streak"),
      divName: varchar("div_name", { length: 50 }),
      divisionId: varchar("division_id", { length: 20 }),
      conferenceId: varchar("conference_id", { length: 20 }),
      conferenceName: varchar("conference_name", { length: 50 }),
      playoffStatus: integer("playoff_status"),
      capAvailable: bigint("cap_available", { mode: "number" }),
      capSpent: bigint("cap_spent", { mode: "number" }),
      capRoom: bigint("cap_room", { mode: "number" }),
      teamOvr: integer("team_ovr"),
      createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
      standingUnique: unique().on(table.leagueId, table.teamId, table.weekIndex, table.seasonIndex),
      leagueTeamIdx: index("idx_standings_league_team").on(table.leagueId, table.teamId),
      weekIdx: index("idx_standings_week").on(table.leagueId, table.weekIndex, table.seasonIndex),
    })
  );
  
  export const standingsRelations = relations(standings, ({ one }) => ({
    league: one(leagues, {
      fields: [standings.leagueId],
      references: [leagues.id],
    }),
    team: one(teams, {
      fields: [standings.teamId],
      references: [teams.id],
    }),
  }));
  