/**
 * Weekly Stats Validators
 * 
 * This file contains Zod schemas for validating weekly stats data from the Madden Companion App.
 */

import { z } from 'zod';

// Base schema for common fields in all stats
const BaseStatSchema = z.object({
  statId: z.string().nullable().optional(),
  scheduleId: z.string().nullable().optional(),
  seasonIndex: z.number().int().nullable().optional(),
  weekIndex: z.number().int().nullable().optional(),
  stageIndex: z.number().int().nullable().optional(),
  teamId: z.string().nullable().optional(),
  playerId: z.string().nullable().optional(),
});

// Schema for defensive stats
export const MaddenDefensiveStatSchema = BaseStatSchema.extend({
  defTotalTackles: z.number().nullable().optional(),
  defSacks: z.number().nullable().optional(),
  defInts: z.number().nullable().optional(),
  defForcedFum: z.number().nullable().optional(),
  defFumRec: z.number().nullable().optional(),
  defDeflections: z.number().nullable().optional(),
  defTDs: z.number().nullable().optional(),
  defSafeties: z.number().nullable().optional(),
  defIntReturnYds: z.number().nullable().optional(),
  defCatchAllowed: z.number().nullable().optional(),
  defPts: z.number().nullable().optional(),
});

// Schema for receiving stats
export const MaddenReceivingStatSchema = BaseStatSchema.extend({
  recCatches: z.number().nullable().optional(),
  recYards: z.number().nullable().optional(),
  recTDs: z.number().nullable().optional(),
  recYardsAfterCatch: z.number().nullable().optional(),
  recDrops: z.number().nullable().optional(),
  recLongest: z.number().nullable().optional(),
  recYardsPerCatch: z.number().nullable().optional(),
  recCatchPct: z.number().nullable().optional(),
  recYACPerCatch: z.number().nullable().optional(),
  recYardsPerGame: z.number().nullable().optional(),
  recTOPct: z.number().nullable().optional(),
  recPts: z.number().nullable().optional(),
});

// Schema for rushing stats
export const MaddenRushingStatSchema = BaseStatSchema.extend({
  rushAtt: z.number().nullable().optional(),
  rushYards: z.number().nullable().optional(),
  rushTDs: z.number().nullable().optional(),
  rushYardsPerAtt: z.number().nullable().optional(),
  rushBrokenTackles: z.number().nullable().optional(),
  rushLongest: z.number().nullable().optional(),
  rush20PlusYds: z.number().nullable().optional(),
  rushYardsAfterContact: z.number().nullable().optional(),
  rushFum: z.number().nullable().optional(),
  rushYardsPerGame: z.number().nullable().optional(),
  rushTOPct: z.number().nullable().optional(),
  rushPts: z.number().nullable().optional(),
});

// Schema for passing stats
export const MaddenPassingStatSchema = BaseStatSchema.extend({
  passAtt: z.number().nullable().optional(),
  passComp: z.number().nullable().optional(),
  passYards: z.number().nullable().optional(),
  passTDs: z.number().nullable().optional(),
  passInts: z.number().nullable().optional(),
  passSacks: z.number().nullable().optional(),
  passLongest: z.number().nullable().optional(),
  passerRating: z.number().nullable().optional(),
  passCompPct: z.number().nullable().optional(),
  passYardsPerAtt: z.number().nullable().optional(),
  passYardsPerGame: z.number().nullable().optional(),
  passPts: z.number().nullable().optional(),
});

// Schema for kicking stats
export const MaddenKickingStatSchema = BaseStatSchema.extend({
  fgAtt: z.number().nullable().optional(),
  fgMade: z.number().nullable().optional(),
  fgLongest: z.number().nullable().optional(),
  fg50PlusAtt: z.number().nullable().optional(),
  fg50PlusMade: z.number().nullable().optional(),
  xpAtt: z.number().nullable().optional(),
  xpMade: z.number().nullable().optional(),
  kickoffAtt: z.number().nullable().optional(),
  kickoffTBs: z.number().nullable().optional(),
  fgCompPct: z.number().nullable().optional(),
  xpCompPct: z.number().nullable().optional(),
  kickPts: z.number().nullable().optional(),
});

// Schema for punting stats
export const MaddenPuntingStatSchema = BaseStatSchema.extend({
  puntAtt: z.number().nullable().optional(),
  puntYards: z.number().nullable().optional(),
  puntLongest: z.number().nullable().optional(),
  puntsIn20: z.number().nullable().optional(),
  puntTBs: z.number().nullable().optional(),
  puntsBlocked: z.number().nullable().optional(),
  puntNetYards: z.number().nullable().optional(),
  puntNetYardsPerAtt: z.number().nullable().optional(),
  puntYardsPerAtt: z.number().nullable().optional(),
});

// Schema for team stats
export const MaddenTeamStatSchema = z.object({
  statId: z.string().nullable().optional(),
  scheduleId: z.string().nullable().optional(),
  seasonIndex: z.number().int().nullable().optional(),
  weekIndex: z.number().int().nullable().optional(),
  stageIndex: z.number().int().nullable().optional(),
  teamId: z.string().nullable().optional(),
  totalWins: z.number().nullable().optional(),
  totalLosses: z.number().nullable().optional(),
  totalTies: z.number().nullable().optional(),
  seed: z.number().nullable().optional(),
  offTotalYards: z.number().nullable().optional(),
  offPassYards: z.number().nullable().optional(),
  offRushYards: z.number().nullable().optional(),
  offPassTDs: z.number().nullable().optional(),
  offRushTDs: z.number().nullable().optional(),
  offPtsPerGame: z.number().nullable().optional(),
  off1stDowns: z.number().nullable().optional(),
  off3rdDownAtt: z.number().nullable().optional(),
  off3rdDownConv: z.number().nullable().optional(),
  off3rdDownConvPct: z.number().nullable().optional(),
  off4thDownAtt: z.number().nullable().optional(),
  off4thDownConv: z.number().nullable().optional(),
  off4thDownConvPct: z.number().nullable().optional(),
  offRedZones: z.number().nullable().optional(),
  offRedZoneTDs: z.number().nullable().optional(),
  offRedZoneFGs: z.number().nullable().optional(),
  offRedZonePct: z.number().nullable().optional(),
  defTotalYards: z.number().nullable().optional(),
  defPassYards: z.number().nullable().optional(),
  defRushYards: z.number().nullable().optional(),
  defPtsPerGame: z.number().nullable().optional(),
  defRedZones: z.number().nullable().optional(),
  defRedZoneTDs: z.number().nullable().optional(),
  defRedZoneFGs: z.number().nullable().optional(),
  defRedZonePct: z.number().nullable().optional(),
  penalties: z.number().nullable().optional(),
  penaltyYards: z.number().nullable().optional(),
  toGiveaways: z.number().nullable().optional(),
  toTakeaways: z.number().nullable().optional(),
  toDiff: z.number().nullable().optional(),
});

// Payload schemas for each stat type
export const DefensiveStatsPayloadSchema = z.object({
  defensiveStatInfoList: z.array(MaddenDefensiveStatSchema),
});

export const ReceivingStatsPayloadSchema = z.object({
  receivingStatInfoList: z.array(MaddenReceivingStatSchema),
});

export const RushingStatsPayloadSchema = z.object({
  rushingStatInfoList: z.array(MaddenRushingStatSchema),
});

export const PassingStatsPayloadSchema = z.object({
  passingStatInfoList: z.array(MaddenPassingStatSchema),
});

export const KickingStatsPayloadSchema = z.object({
  kickingStatInfoList: z.array(MaddenKickingStatSchema),
});

export const PuntingStatsPayloadSchema = z.object({
  puntingStatInfoList: z.array(MaddenPuntingStatSchema),
});

export const TeamStatsPayloadSchema = z.object({
  teamStatInfoList: z.array(MaddenTeamStatSchema),
});

// Route parameter schema
export const WeeklyStatsRouteParamsSchema = z.object({
  leagueSlug: z.string().min(1),
});

// Types for validated data
export type MaddenDefensiveStat = z.infer<typeof MaddenDefensiveStatSchema>;
export type MaddenReceivingStat = z.infer<typeof MaddenReceivingStatSchema>;
export type MaddenRushingStat = z.infer<typeof MaddenRushingStatSchema>;
export type MaddenPassingStat = z.infer<typeof MaddenPassingStatSchema>;
export type MaddenKickingStat = z.infer<typeof MaddenKickingStatSchema>;
export type MaddenPuntingStat = z.infer<typeof MaddenPuntingStatSchema>;
export type MaddenTeamStat = z.infer<typeof MaddenTeamStatSchema>;

export type DefensiveStatsPayload = z.infer<typeof DefensiveStatsPayloadSchema>;
export type ReceivingStatsPayload = z.infer<typeof ReceivingStatsPayloadSchema>;
export type RushingStatsPayload = z.infer<typeof RushingStatsPayloadSchema>;
export type PassingStatsPayload = z.infer<typeof PassingStatsPayloadSchema>;
export type KickingStatsPayload = z.infer<typeof KickingStatsPayloadSchema>;
export type PuntingStatsPayload = z.infer<typeof PuntingStatsPayloadSchema>;
export type TeamStatsPayload = z.infer<typeof TeamStatsPayloadSchema>; 