/**
 * League Validators
 * 
 * This file contains Zod schemas for validating league-related data.
 */

import { z } from 'zod';

/**
 * Schema for validating league creation data
 */
export const LeagueCreateSchema = z.object({
  name: z.string().min(3, 'League name must be at least 3 characters'),
  league_identifier: z.string()
    .min(2, 'League identifier must be at least 2 characters')
    .max(10, 'League identifier must be at most 10 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'League identifier can only contain letters, numbers, hyphens, and underscores'),
  platform: z.enum(['ps5', 'xbsx'], {
    errorMap: () => ({ message: 'Platform must be either ps5 or xbsx' }),
  }),
  madden_league_id: z.string().optional(),
  discord_server_id: z.string().optional().nullable(),
});

/**
 * Schema for validating league update data
 */
export const LeagueUpdateSchema = z.object({
  name: z.string().min(3, 'League name must be at least 3 characters').optional(),
  platform: z.enum(['ps5', 'xbsx'], {
    errorMap: () => ({ message: 'Platform must be either ps5 or xbsx' }),
  }).optional(),
  madden_league_id: z.string().optional(),
  discord_server_id: z.string().optional().nullable(),
  import_url: z.string().url('Import URL must be a valid URL').optional().nullable(),
});

/**
 * Schema for validating league slug availability check
 */
export const LeagueSlugCheckSchema = z.object({
  league_identifier: z.string()
    .min(2, 'League identifier must be at least 2 characters')
    .max(10, 'League identifier must be at most 10 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'League identifier can only contain letters, numbers, hyphens, and underscores'),
});

/**
 * Schema for validating league deletion
 */
export const LeagueDeleteSchema = z.object({
  id: z.string().uuid('Invalid league ID'),
  confirmation: z.literal('DELETE', {
    errorMap: () => ({ message: 'Please type DELETE to confirm' }),
  }),
});

// Types derived from the schemas
export type LeagueCreateInput = z.infer<typeof LeagueCreateSchema>;
export type LeagueUpdateInput = z.infer<typeof LeagueUpdateSchema>;
export type LeagueSlugCheckInput = z.infer<typeof LeagueSlugCheckSchema>;
export type LeagueDeleteInput = z.infer<typeof LeagueDeleteSchema>; 