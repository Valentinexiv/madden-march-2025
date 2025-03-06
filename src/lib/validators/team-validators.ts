/**
 * Team Validators
 * 
 * This file contains validation schemas for team-related data.
 * It ensures that data received from the Madden Companion App is properly validated
 * before being processed and stored in the database.
 */

import { z } from 'zod';

/**
 * Schema for validating a single team from the Madden Companion App
 */
export const MaddenTeamSchema = z.object({
  teamId: z.number().int().positive(),
  cityName: z.string().nullable(),
  nickName: z.string().nullable(),
  displayName: z.string().nullable(),
  abbrName: z.string().nullable(),
  divName: z.string().nullable(),
  logoId: z.number().int().nullable(),
  primaryColor: z.number().int().nullable(),
  secondaryColor: z.number().int().nullable(),
  ovrRating: z.number().int().nullable(),
  offScheme: z.number().int().nullable(),
  defScheme: z.number().int().nullable(),
  injuryCount: z.number().int().nullable(),
  userName: z.string().nullable(),
});

/**
 * Schema for validating the payload from the Madden Companion App
 */
export const LeagueTeamsPayloadSchema = z.object({
  leagueTeamInfoList: z.array(MaddenTeamSchema),
});

/**
 * Type for a validated Madden team
 */
export type MaddenTeam = z.infer<typeof MaddenTeamSchema>;

/**
 * Type for a validated league teams payload
 */
export type LeagueTeamsPayload = z.infer<typeof LeagueTeamsPayloadSchema>;

/**
 * Schema for validating route parameters
 */
export const LeagueTeamsParamsSchema = z.object({
  leagueSlug: z.string().min(1, 'League slug is required'),
});

/**
 * Type for validated route parameters
 */
export type LeagueTeamsParams = z.infer<typeof LeagueTeamsParamsSchema>; 