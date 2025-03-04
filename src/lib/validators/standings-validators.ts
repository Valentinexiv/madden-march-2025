/**
 * Standings Validators
 * 
 * This file contains validation schemas for standings-related data.
 * It ensures that data received from the Madden Companion App is properly validated
 * before being processed and stored in the database.
 */

import { z } from 'zod';

/**
 * Schema for validating a single team standing from the Madden Companion App
 */
export const MaddenStandingSchema = z.object({
  teamId: z.number().int().positive(),
  teamName: z.string().nullable(),
  teamOvr: z.number().int().nullable(),
  rank: z.number().int().nullable(),
  prevRank: z.number().int().nullable(),
  seed: z.number().int().nullable(),
  totalWins: z.number().int().nullable(),
  totalLosses: z.number().int().nullable(),
  totalTies: z.number().int().nullable(),
  winPct: z.number().nullable(),
  homeWins: z.number().int().nullable(),
  homeLosses: z.number().int().nullable(),
  homeTies: z.number().int().nullable(),
  awayWins: z.number().int().nullable(),
  awayLosses: z.number().int().nullable(),
  awayTies: z.number().int().nullable(),
  divWins: z.number().int().nullable(),
  divLosses: z.number().int().nullable(),
  divTies: z.number().int().nullable(),
  confWins: z.number().int().nullable(),
  confLosses: z.number().int().nullable(),
  confTies: z.number().int().nullable(),
  ptsFor: z.number().int().nullable(),
  ptsAgainst: z.number().int().nullable(),
  netPts: z.number().int().nullable(),
  ptsForRank: z.number().int().nullable(),
  ptsAgainstRank: z.number().int().nullable(),
  offTotalYds: z.number().int().nullable(),
  offTotalYdsRank: z.number().int().nullable(),
  defTotalYds: z.number().int().nullable(),
  defTotalYdsRank: z.number().int().nullable(),
  offPassYds: z.number().int().nullable(),
  offPassYdsRank: z.number().int().nullable(),
  defPassYds: z.number().int().nullable(),
  defPassYdsRank: z.number().int().nullable(),
  offRushYds: z.number().int().nullable(),
  offRushYdsRank: z.number().int().nullable(),
  defRushYds: z.number().int().nullable(),
  defRushYdsRank: z.number().int().nullable(),
  tODiff: z.number().int().nullable(),
  winLossStreak: z.number().int().nullable(),
  divisionName: z.string().nullable(),
  divisionId: z.number().int().nullable(),
  conferenceId: z.number().int().nullable(),
  conferenceName: z.string().nullable(),
  playoffStatus: z.number().int().nullable(),
  capAvailable: z.number().int().nullable(),
  capSpent: z.number().int().nullable(),
  capRoom: z.number().int().nullable(),
  weekIndex: z.number().int().nullable(),
  seasonIndex: z.number().int().nullable(),
  stageIndex: z.number().int().nullable(),
  calendarYear: z.number().int().nullable(),
});

/**
 * Schema for validating the standings payload from the Madden Companion App
 */
export const LeagueStandingsPayloadSchema = z.object({
  teamStandingInfoList: z.array(MaddenStandingSchema),
});

/**
 * Type for a validated Madden standing
 */
export type MaddenStanding = z.infer<typeof MaddenStandingSchema>;

/**
 * Type for a validated league standings payload
 */
export type LeagueStandingsPayload = z.infer<typeof LeagueStandingsPayloadSchema>;

/**
 * Schema for validating route parameters
 */
export const LeagueStandingsParamsSchema = z.object({
  leagueSlug: z.string().min(1, 'League slug is required'),
});

/**
 * Type for validated route parameters
 */
export type LeagueStandingsParams = z.infer<typeof LeagueStandingsParamsSchema>; 