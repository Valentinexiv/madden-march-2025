/**
 * Roster Validators
 * 
 * This file contains validation schemas for roster-related data.
 * It ensures that data received from the Madden Companion App is properly validated
 * before being processed and stored in the database.
 */

import { z } from 'zod';

/**
 * Schema for validating a single player from the Madden Companion App
 */
export const MaddenPlayerSchema = z.object({
  // Basic player info
  rosterId: z.number().int().positive(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  position: z.string().nullable(),
  jerseyNum: z.number().int().nullable(),
  
  // Physical attributes
  height: z.number().int().nullable(),
  weight: z.number().int().nullable(),
  age: z.number().int().nullable(),
  
  // Career info
  rookieYear: z.number().int().nullable(),
  yearsPro: z.number().int().nullable(),
  college: z.string().nullable(),
  homeState: z.number().int().nullable(),
  homeTown: z.string().nullable(),
  birthDay: z.number().int().nullable(),
  birthMonth: z.number().int().nullable(),
  birthYear: z.number().int().nullable(),
  
  // Overalls and development
  playerBestOvr: z.number().int().nullable(),
  playerSchemeOvr: z.number().int().nullable(),
  teamSchemeOvr: z.number().int().nullable(),
  devTrait: z.number().int().nullable(),
  
  // Contract data
  contractSalary: z.number().int().nullable(),
  contractBonus: z.number().int().nullable(),
  contractYearsLeft: z.number().int().nullable(),
  contractLength: z.number().int().nullable(),
  capHit: z.number().int().nullable(),
  capReleasePenalty: z.number().int().nullable(),
  capReleaseNetSavings: z.number().int().nullable(),
  desiredLength: z.number().int().nullable(),
  desiredSalary: z.number().int().nullable(),
  desiredBonus: z.number().int().nullable(),
  reSignStatus: z.number().int().nullable(),
  
  // Active status
  isFreeAgent: z.boolean().nullable(),
  isOnPracticeSquad: z.boolean().nullable(),
  isOnIR: z.boolean().nullable(),
  isActive: z.boolean().nullable(),
  
  // Draft information
  draftRound: z.number().int().nullable(),
  draftPick: z.number().int().nullable(),
  
  // Game-related data
  injuryType: z.number().int().nullable(),
  injuryLength: z.number().int().nullable(),
  portraitId: z.number().int().nullable(),
  presentationId: z.number().int().nullable(),
  scheme: z.number().int().nullable(),
  teamId: z.number().int().positive(),
  
  // Performance indicators
  legacyScore: z.number().int().nullable(),
  experiencePoints: z.number().int().nullable(),
  skillPoints: z.number().int().nullable(),
  
  // Grades
  physicalGrade: z.number().int().nullable(),
  intangibleGrade: z.number().int().nullable(),
  productionGrade: z.number().int().nullable(),
  durabilityGrade: z.number().int().nullable(),
  sizeGrade: z.number().int().nullable(),
  
  // Traits
  tightSpiralTrait: z.number().int().nullable(),
  sensePressureTrait: z.number().int().nullable(),
  throwAwayTrait: z.number().int().nullable(),
  highMotorTrait: z.number().int().nullable(),
  qBStyleTrait: z.number().int().nullable(),
  stripBallTrait: z.number().int().nullable(),
  playBallTrait: z.number().int().nullable(),
  bigHitTrait: z.number().int().nullable(),
  dLBullRushTrait: z.number().int().nullable(),
  dLSwimTrait: z.number().int().nullable(),
  dLSpinTrait: z.number().int().nullable(),
  lBStyleTrait: z.number().int().nullable(),
  dropOpenPassTrait: z.number().int().nullable(),
  fightForYardsTrait: z.number().int().nullable(),
  hPCatchTrait: z.number().int().nullable(),
  posCatchTrait: z.number().int().nullable(),
  yACCatchTrait: z.number().int().nullable(),
  feetInBoundsTrait: z.number().int().nullable(),
  coverBallTrait: z.number().int().nullable(),
  clutchTrait: z.number().int().nullable(),
  penaltyTrait: z.number().int().nullable(),
  predictTrait: z.number().int().nullable(),
  runStyle: z.number().int().nullable(),
  
  // Ratings
  speedRating: z.number().int().nullable(),
  strengthRating: z.number().int().nullable(),
  agilityRating: z.number().int().nullable(),
  accelRating: z.number().int().nullable(),
  awareRating: z.number().int().nullable(),
  catchRating: z.number().int().nullable(),
  carryRating: z.number().int().nullable(),
  throwPowerRating: z.number().int().nullable(),
  throwAccRating: z.number().int().nullable(),
  throwAccShortRating: z.number().int().nullable(),
  throwAccMidRating: z.number().int().nullable(),
  throwAccDeepRating: z.number().int().nullable(),
  routeRunShortRating: z.number().int().nullable(),
  routeRunMedRating: z.number().int().nullable(),
  routeRunDeepRating: z.number().int().nullable(),
  releaseRating: z.number().int().nullable(),
  specCatchRating: z.number().int().nullable(),
  cITRating: z.number().int().nullable(),
  breakTackleRating: z.number().int().nullable(),
  truckRating: z.number().int().nullable(),
  stiffArmRating: z.number().int().nullable(),
  spinMoveRating: z.number().int().nullable(),
  jukeMoveRating: z.number().int().nullable(),
  breakSackRating: z.number().int().nullable(),
  playActionRating: z.number().int().nullable(),
  throwUnderPressureRating: z.number().int().nullable(),
  throwOnRunRating: z.number().int().nullable(),
  leadBlockRating: z.number().int().nullable(),
  impactBlockRating: z.number().int().nullable(),
  runBlockRating: z.number().int().nullable(),
  runBlockPowerRating: z.number().int().nullable(),
  runBlockFinesseRating: z.number().int().nullable(),
  passBlockRating: z.number().int().nullable(),
  passBlockPowerRating: z.number().int().nullable(),
  passBlockFinesseRating: z.number().int().nullable(),
  tackleRating: z.number().int().nullable(),
  hitPowerRating: z.number().int().nullable(),
  pursuitRating: z.number().int().nullable(),
  playRecRating: z.number().int().nullable(),
  zoneCoverRating: z.number().int().nullable(),
  manCoverRating: z.number().int().nullable(),
  pressRating: z.number().int().nullable(),
  blockShedRating: z.number().int().nullable(),
  powerMovesRating: z.number().int().nullable(),
  finesseMovesRating: z.number().int().nullable(),
  kickPowerRating: z.number().int().nullable(),
  kickAccRating: z.number().int().nullable(),
  kickRetRating: z.number().int().nullable(),
  injuryRating: z.number().int().nullable(),
  staminaRating: z.number().int().nullable(),
  toughRating: z.number().int().nullable(),
  jumpRating: z.number().int().nullable(),
  bCVRating: z.number().int().nullable(),
  changeOfDirectionRating: z.number().int().nullable(),
  
  // Abilities
  signatureSlotList: z.array(
    z.object({
      signatureTitle: z.string().nullable().optional(),
      signatureDescription: z.string().nullable().optional(),
      signatureLogoId: z.number().int().nullable().optional(),
      signatureActivationDescription: z.string().nullable().optional(),
      signatureDeactivationDescription: z.string().nullable().optional(),
      abilityRank: z.string().nullable().optional(),
      isPassive: z.boolean().nullable().optional(),
      isUnlocked: z.boolean().nullable().optional(),
      marketAbilityAlias: z.string().nullable().optional(),
    })
  ).optional().nullable(),
  
  // Goals
  rosterGoalList: z.array(z.any()).optional().nullable(),
  
  // Decision maker trait (special case)
  decisionMakerTrait: z.number().int().nullable(),
});

/**
 * Schema for validating the roster payload from the Madden Companion App
 */
export const LeagueRosterPayloadSchema = z.object({
  rosterInfoList: z.array(MaddenPlayerSchema),
});

/**
 * Type for a validated Madden player
 */
export type MaddenPlayer = z.infer<typeof MaddenPlayerSchema>;

/**
 * Type for a validated league roster payload
 */
export type LeagueRosterPayload = z.infer<typeof LeagueRosterPayloadSchema>;

/**
 * Schema for validating route parameters
 */
export const LeagueRosterParamsSchema = z.object({
  leagueSlug: z.string().min(1, 'League slug is required'),
});

/**
 * Type for validated route parameters
 */
export type LeagueRosterParams = z.infer<typeof LeagueRosterParamsSchema>; 