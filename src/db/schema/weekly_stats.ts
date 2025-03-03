import { 
  pgTable, 
  serial, 
  integer, 
  varchar, 
  decimal, 
  timestamp, 
  unique, 
  index,
  uuid
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { leagues } from './leagues';
import { teams } from './teams';
import { players } from './players';

// Weekly Stats Tables

export const weeklyDefensiveStats = pgTable(
    "weekly_defensive_stats",
    {
      id: serial("id").primaryKey(),
      leagueId: uuid("league_id").references(() => leagues.id),
      playerId: uuid("player_id").references(() => players.id),
      statId: varchar("stat_id", { length: 20 }),
      scheduleId: varchar("schedule_id", { length: 20 }),
      weekIndex: integer("week_index"),
      seasonIndex: integer("season_index"),
      stageIndex: integer("stage_index"),
      teamId: varchar("team_id", { length: 20 }),
      defTotalTackles: integer("def_total_tackles"),
      defSacks: decimal("def_sacks", { precision: 5, scale: 1 }),
      defInts: integer("def_ints"),
      defForcedFum: integer("def_forced_fum"),
      defFumRec: integer("def_fum_rec"),
      defDeflections: integer("def_deflections"),
      defTDs: integer("def_tds"),
      defSafeties: integer("def_safeties"),
      defIntReturnYds: integer("def_int_return_yds"),
      defCatchAllowed: integer("def_catch_allowed"),
      defPts: integer("def_pts"),
      createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
      statUnique: unique().on(table.leagueId, table.statId, table.weekIndex, table.seasonIndex),
      leaguePlayerIdx: index("idx_weekly_defensive_stats_league_player").on(table.leagueId, table.playerId),
      weekIdx: index("idx_weekly_defensive_stats_week").on(table.leagueId, table.weekIndex, table.seasonIndex),
    })
  );
  
  export const weeklyDefensiveStatsRelations = relations(weeklyDefensiveStats, ({ one }) => ({
    league: one(leagues, {
      fields: [weeklyDefensiveStats.leagueId],
      references: [leagues.id],
    }),
    player: one(players, {
      fields: [weeklyDefensiveStats.playerId],
      references: [players.id],
    }),
  }));
  
  export const weeklyReceivingStats = pgTable(
    "weekly_receiving_stats",
    {
      id: serial("id").primaryKey(),
      leagueId: uuid("league_id").references(() => leagues.id),
      playerId: uuid("player_id").references(() => players.id),
      statId: varchar("stat_id", { length: 20 }),
      scheduleId: varchar("schedule_id", { length: 20 }),
      weekIndex: integer("week_index"),
      seasonIndex: integer("season_index"),
      stageIndex: integer("stage_index"),
      teamId: varchar("team_id", { length: 20 }),
      recCatches: integer("rec_catches"),
      recYards: integer("rec_yards"),
      recTDs: integer("rec_tds"),
      recYardsAfterCatch: integer("rec_yards_after_catch"),
      recDrops: integer("rec_drops"),
      recLongest: integer("rec_longest"),
      recYdsPerCatch: decimal("rec_yards_per_catch", { precision: 5, scale: 1 }),
      recCatchPct: decimal("rec_catch_pct", { precision: 5, scale: 1 }),
      recYacPerCatch: decimal("rec_yac_per_catch", { precision: 5, scale: 1 }),
      recYdsPerGame: decimal("rec_yards_per_game", { precision: 5, scale: 1 }),
      recToPct: decimal("rec_to_pct", { precision: 5, scale: 1 }),
      recPts: integer("rec_pts"),
      createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
      statUnique: unique().on(table.leagueId, table.statId, table.weekIndex, table.seasonIndex),
      leaguePlayerIdx: index("idx_weekly_receiving_stats_league_player").on(table.leagueId, table.playerId),
      weekIdx: index("idx_weekly_receiving_stats_week").on(table.leagueId, table.weekIndex, table.seasonIndex),
    })
  );
  
  export const weeklyReceivingStatsRelations = relations(weeklyReceivingStats, ({ one }) => ({
    league: one(leagues, {
      fields: [weeklyReceivingStats.leagueId],
      references: [leagues.id],
    }),
    player: one(players, {
      fields: [weeklyReceivingStats.playerId],
      references: [players.id],
    }),
  }));
  
  export const weeklyRushingStats = pgTable(
    "weekly_rushing_stats",
    {
      id: serial("id").primaryKey(),
      leagueId: uuid("league_id").references(() => leagues.id),
      playerId: uuid("player_id").references(() => players.id),
      statId: varchar("stat_id", { length: 20 }),
      scheduleId: varchar("schedule_id", { length: 20 }),
      weekIndex: integer("week_index"),
      seasonIndex: integer("season_index"),
      stageIndex: integer("stage_index"),
      teamId: varchar("team_id", { length: 20 }),
      rushAtt: integer("rush_att"),
      rushYards: integer("rush_yards"),
      rushTDs: integer("rush_tds"),
      rushYdsPerAtt: decimal("rush_yards_per_att", { precision: 5, scale: 1 }),
      rushBrokenTackles: integer("rush_broken_tackles"),
      rushLongest: integer("rush_longest"),
      rush20PlusYds: integer("rush_20_plus_yds"),
      rushYdsAfterContact: integer("rush_yards_after_contact"),
      rushFum: integer("rush_fum"),
      rushYdsPerGame: decimal("rush_yards_per_game", { precision: 5, scale: 1 }),
      rushToPct: decimal("rush_to_pct", { precision: 5, scale: 1 }),
      rushPts: integer("rush_pts"),
      createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
      statUnique: unique().on(table.leagueId, table.statId, table.weekIndex, table.seasonIndex),
      leaguePlayerIdx: index("idx_weekly_rushing_stats_league_player").on(table.leagueId, table.playerId),
      weekIdx: index("idx_weekly_rushing_stats_week").on(table.leagueId, table.weekIndex, table.seasonIndex),
    })
  );
  
  export const weeklyRushingStatsRelations = relations(weeklyRushingStats, ({ one }) => ({
    league: one(leagues, {
      fields: [weeklyRushingStats.leagueId],
      references: [leagues.id],
    }),
    player: one(players, {
      fields: [weeklyRushingStats.playerId],
      references: [players.id],
    }),
  }));
  
  export const weeklyPassingStats = pgTable(
    "weekly_passing_stats",
    {
      id: serial("id").primaryKey(),
      leagueId: uuid("league_id").references(() => leagues.id),
      playerId: uuid("player_id").references(() => players.id),
      statId: varchar("stat_id", { length: 20 }),
      scheduleId: varchar("schedule_id", { length: 20 }),
      weekIndex: integer("week_index"),
      seasonIndex: integer("season_index"),
      stageIndex: integer("stage_index"),
      teamId: varchar("team_id", { length: 20 }),
      passAtt: integer("pass_att"),
      passComp: integer("pass_comp"),
      passYards: integer("pass_yards"),
      passTDs: integer("pass_tds"),
      passInts: integer("pass_ints"),
      passSacks: integer("pass_sacks"),
      passLongest: integer("pass_longest"),
      passerRating: decimal("passer_rating", { precision: 5, scale: 1 }),
      passCompPct: decimal("pass_comp_pct", { precision: 5, scale: 1 }),
      passYdsPerAtt: decimal("pass_yards_per_att", { precision: 5, scale: 1 }),
      passYdsPerGame: decimal("pass_yards_per_game", { precision: 5, scale: 1 }),
      passPts: integer("pass_pts"),
      createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
      statUnique: unique().on(table.leagueId, table.statId, table.weekIndex, table.seasonIndex),
      leaguePlayerIdx: index("idx_weekly_passing_stats_league_player").on(table.leagueId, table.playerId),
      weekIdx: index("idx_weekly_passing_stats_week").on(table.leagueId, table.weekIndex, table.seasonIndex),
    })
  );
  
  export const weeklyPassingStatsRelations = relations(weeklyPassingStats, ({ one }) => ({
    league: one(leagues, {
      fields: [weeklyPassingStats.leagueId],
      references: [leagues.id],
    }),
    player: one(players, {
      fields: [weeklyPassingStats.playerId],
      references: [players.id],
    }),
  }));
  
  export const weeklyKickingStats = pgTable(
    "weekly_kicking_stats",
    {
      id: serial("id").primaryKey(),
      leagueId: uuid("league_id").references(() => leagues.id),
      playerId: uuid("player_id").references(() => players.id),
      statId: varchar("stat_id", { length: 20 }),
      scheduleId: varchar("schedule_id", { length: 20 }),
      weekIndex: integer("week_index"),
      seasonIndex: integer("season_index"),
      stageIndex: integer("stage_index"),
      teamId: varchar("team_id", { length: 20 }),
      fgAtt: integer("fg_att"),
      fgMade: integer("fg_made"),
      fgLongest: integer("fg_longest"),
      fg50PlusAtt: integer("fg_50_plus_att"),
      fg50PlusMade: integer("fg_50_plus_made"),
      xpAtt: integer("xp_att"),
      xpMade: integer("xp_made"),
      kickoffAtt: integer("kickoff_att"),
      kickoffTBs: integer("kickoff_tbs"),
      fgCompPct: decimal("fg_comp_pct", { precision: 5, scale: 1 }),
      xpCompPct: decimal("xp_comp_pct", { precision: 5, scale: 1 }),
      kickPts: integer("kick_pts"),
      createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
      statUnique: unique().on(table.leagueId, table.statId, table.weekIndex, table.seasonIndex),
      leaguePlayerIdx: index("idx_weekly_kicking_stats_league_player").on(table.leagueId, table.playerId),
      weekIdx: index("idx_weekly_kicking_stats_week").on(table.leagueId, table.weekIndex, table.seasonIndex),
    })
  );
  
  export const weeklyKickingStatsRelations = relations(weeklyKickingStats, ({ one }) => ({
    league: one(leagues, {
      fields: [weeklyKickingStats.leagueId],
      references: [leagues.id],
    }),
    player: one(players, {
      fields: [weeklyKickingStats.playerId],
      references: [players.id],
    }),
  }));
  
  export const weeklyPuntingStats = pgTable(
    "weekly_punting_stats",
    {
      id: serial("id").primaryKey(),
      leagueId: uuid("league_id").references(() => leagues.id),
      playerId: uuid("player_id").references(() => players.id),
      statId: varchar("stat_id", { length: 20 }),
      scheduleId: varchar("schedule_id", { length: 20 }),
      weekIndex: integer("week_index"),
      seasonIndex: integer("season_index"),
      stageIndex: integer("stage_index"),
      teamId: varchar("team_id", { length: 20 }),
      puntAtt: integer("punt_att"),
      puntYards: integer("punt_yards"),
      puntLongest: integer("punt_longest"),
      puntsIn20: integer("punts_in_20"),
      puntTBs: integer("punt_tbs"),
      puntsBlocked: integer("punts_blocked"),
      puntNetYards: integer("punt_net_yards"),
      puntNetYdsPerAtt: decimal("punt_net_yards_per_att", { precision: 5, scale: 1 }),
      puntYdsPerAtt: decimal("punt_yards_per_att", { precision: 5, scale: 1 }),
      createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
      statUnique: unique().on(table.leagueId, table.statId, table.weekIndex, table.seasonIndex),
      leaguePlayerIdx: index("idx_weekly_punting_stats_league_player").on(table.leagueId, table.playerId),
      weekIdx: index("idx_weekly_punting_stats_week").on(table.leagueId, table.weekIndex, table.seasonIndex),
    })
  );
  
  export const weeklyPuntingStatsRelations = relations(weeklyPuntingStats, ({ one }) => ({
    league: one(leagues, {
      fields: [weeklyPuntingStats.leagueId],
      references: [leagues.id],
    }),
    player: one(players, {
      fields: [weeklyPuntingStats.playerId],
      references: [players.id],
    }),
  }));
  
  export const weeklyTeamStats = pgTable(
    "weekly_team_stats",
    {
      id: serial("id").primaryKey(),
      leagueId: uuid("league_id").references(() => leagues.id),
      teamId: uuid("team_id").references(() => teams.id),
      statId: varchar("stat_id", { length: 20 }),
      scheduleId: varchar("schedule_id", { length: 20 }),
      weekIndex: integer("week_index"),
      seasonIndex: integer("season_index"),
      stageIndex: integer("stage_index"),
      totalWins: integer("total_wins"),
      totalLosses: integer("total_losses"),
      totalTies: integer("total_ties"),
      seed: integer("seed"),
      offTotalYards: integer("off_total_yards"),
      offPassYards: integer("off_pass_yards"),
      offRushYards: integer("off_rush_yards"),
      offPassTDs: integer("off_pass_tds"),
      offRushTDs: integer("off_rush_tds"),
      offPtsPerGame: decimal("off_pts_per_game", { precision: 5, scale: 1 }),
      off1stDowns: integer("off_1st_downs"),
      off3rdDownAtt: integer("off_3rd_down_att"),
      off3rdDownConv: integer("off_3rd_down_conv"),
      off3rdDownConvPct: decimal("off_3rd_down_conv_pct", { precision: 5, scale: 1 }),
      off4thDownAtt: integer("off_4th_down_att"),
      off4thDownConv: integer("off_4th_down_conv"),
      off4thDownConvPct: decimal("off_4th_down_conv_pct", { precision: 5, scale: 1 }),
      offRedZones: integer("off_red_zones"),
      offRedZoneTDs: integer("off_red_zone_tds"),
      offRedZoneFGs: integer("off_red_zone_fgs"),
      offRedZonePct: decimal("off_red_zone_pct", { precision: 5, scale: 1 }),
      defTotalYards: integer("def_total_yards"),
      defPassYards: integer("def_pass_yards"),
      defRushYards: integer("def_rush_yards"),
      defPtsPerGame: decimal("def_pts_per_game", { precision: 5, scale: 1 }),
      defRedZones: integer("def_red_zones"),
      defRedZoneTDs: integer("def_red_zone_tds"),
      defRedZoneFGs: integer("def_red_zone_fgs"),
      defRedZonePct: decimal("def_red_zone_pct", { precision: 5, scale: 1 }),
      penalties: integer("penalties"),
      penaltyYards: integer("penalty_yards"),
      toGiveaways: integer("to_giveaways"),
      toTakeaways: integer("to_takeaways"),
      toDiff: integer("to_diff"),
      createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
      statUnique: unique().on(table.leagueId, table.statId, table.weekIndex, table.seasonIndex),
      leagueTeamIdx: index("idx_weekly_team_stats_league_team").on(table.leagueId, table.teamId),
      weekIdx: index("idx_weekly_team_stats_week").on(table.leagueId, table.weekIndex, table.seasonIndex),
    })
  );
  
  export const weeklyTeamStatsRelations = relations(weeklyTeamStats, ({ one }) => ({
    league: one(leagues, {
      fields: [weeklyTeamStats.leagueId],
      references: [leagues.id],
    }),
    team: one(teams, {
      fields: [weeklyTeamStats.teamId],
      references: [teams.id],
    }),
  }));
  
  // Export all tables
  export const schema = {
    weeklyDefensiveStats,
    weeklyReceivingStats,
    weeklyRushingStats,
    weeklyPassingStats,
    weeklyKickingStats,
    weeklyPuntingStats,
    weeklyTeamStats,
  };