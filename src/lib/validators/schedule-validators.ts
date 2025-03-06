/**
 * Schedule Validators
 * 
 * This file contains Zod schemas for validating schedule data from the Madden Companion App.
 */

import { z } from 'zod';

// Schema for individual game schedule entries
export const MaddenScheduleSchema = z.object({
  status: z.number().nullable().optional(),
  awayScore: z.number().nullable().optional(),
  awayTeamId: z.number().nullable().optional(),
  weekIndex: z.number().int().nullable().optional(),
  homeScore: z.number().nullable().optional(),
  homeTeamId: z.number().nullable().optional(),
  scheduleId: z.string().nullable().optional(),
  seasonIndex: z.number().int().nullable().optional(),
  isGameOfTheWeek: z.boolean().nullable().optional(),
  stageIndex: z.number().int().nullable().optional(),
});

// Type for the Madden schedule data
export type MaddenSchedule = z.infer<typeof MaddenScheduleSchema>;

// Payload schema for schedule data
export const SchedulePayloadSchema = z.object({
  gameScheduleInfoList: z.array(MaddenScheduleSchema),
});

// Type for the schedule payload
export type SchedulePayload = z.infer<typeof SchedulePayloadSchema>; 