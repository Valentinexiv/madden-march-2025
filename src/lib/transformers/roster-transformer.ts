/**
 * Roster Transformer
 * 
 * This file contains utilities to transform roster data from the Madden Companion App
 * into the format required by our database schema, splitting it across multiple tables.
 */

import { MaddenPlayer } from '../validators/roster-validators';
import { Player } from '@/db/schema/players';
import { PlayerTrait } from '@/db/schema/player_traits';
import { PlayerRating } from '@/db/schema/player_ratings';
import { PlayerAbility } from '@/db/schema/player_abilities';
import { v4 as uuidv4 } from 'uuid';

/**
 * Transform player basic info from Madden format to our database schema
 * 
 * @param maddenPlayer - Player data from the Madden Companion App
 * @param leagueId - The UUID of the league this player belongs to
 * @param teamId - The UUID of the team this player belongs to (from our database)
 * @returns Player data in the format required by our database schema
 */
export function transformPlayerBasicInfo(
  maddenPlayer: MaddenPlayer, 
  leagueId: string, 
  teamId: string | null
): Omit<Player, 'id' | 'created_at' | 'updated_at'> {
  const fullName = `${maddenPlayer.firstName || ''} ${maddenPlayer.lastName || ''}`.trim();
  
  return {
    league_id: leagueId,
    team_id: teamId,
    roster_id: maddenPlayer.rosterId.toString(),
    
    // Basic info
    first_name: maddenPlayer.firstName,
    last_name: maddenPlayer.lastName,
    full_name: fullName || null,
    position: maddenPlayer.position,
    jersey_num: maddenPlayer.jerseyNum,
    
    // Physical attributes
    height: maddenPlayer.height,
    weight: maddenPlayer.weight,
    age: maddenPlayer.age,
    
    // Career info
    rookie_year: maddenPlayer.rookieYear,
    years_pro: maddenPlayer.yearsPro,
    college: maddenPlayer.college,
    home_state: maddenPlayer.homeState,
    home_town: maddenPlayer.homeTown,
    birth_day: maddenPlayer.birthDay,
    birth_month: maddenPlayer.birthMonth,
    birth_year: maddenPlayer.birthYear,
    
    // Overalls and development
    player_best_ovr: maddenPlayer.playerBestOvr,
    player_scheme_ovr: maddenPlayer.playerSchemeOvr,
    team_scheme_ovr: maddenPlayer.teamSchemeOvr,
    dev_trait: maddenPlayer.devTrait,
    
    // Contract data
    contract_salary: maddenPlayer.contractSalary,
    contract_bonus: maddenPlayer.contractBonus,
    contract_years_left: maddenPlayer.contractYearsLeft,
    contract_length: maddenPlayer.contractLength,
    cap_hit: maddenPlayer.capHit,
    cap_release_penalty: maddenPlayer.capReleasePenalty,
    cap_release_net_savings: maddenPlayer.capReleaseNetSavings,
    desired_length: maddenPlayer.desiredLength,
    desired_salary: maddenPlayer.desiredSalary,
    desired_bonus: maddenPlayer.desiredBonus,
    re_sign_status: maddenPlayer.reSignStatus,
    
    // Active status
    is_free_agent: maddenPlayer.isFreeAgent,
    is_on_practice_squad: maddenPlayer.isOnPracticeSquad,
    is_on_ir: maddenPlayer.isOnIR,
    is_active: maddenPlayer.isActive,
    
    // Draft information
    draft_round: maddenPlayer.draftRound,
    draft_pick: maddenPlayer.draftPick,
    
    // Game-related data
    injury_type: maddenPlayer.injuryType,
    injury_length: maddenPlayer.injuryLength,
    portrait_id: maddenPlayer.portraitId,
    presentation_id: maddenPlayer.presentationId,
    scheme: maddenPlayer.scheme,
    
    // Performance indicators
    legacy_score: maddenPlayer.legacyScore,
    experience_points: maddenPlayer.experiencePoints,
    skill_points: maddenPlayer.skillPoints,
    
    // Grades
    physical_grade: maddenPlayer.physicalGrade,
    intangible_grade: maddenPlayer.intangibleGrade,
    production_grade: maddenPlayer.productionGrade,
    durability_grade: maddenPlayer.durabilityGrade,
    size_grade: maddenPlayer.sizeGrade,
  };
}

/**
 * Transform player traits from Madden format to our database schema
 * 
 * @param maddenPlayer - Player data from the Madden Companion App
 * @param playerId - The UUID of the player in our database
 * @param leagueId - The UUID of the league this player belongs to
 * @returns PlayerTrait data in the format required by our database schema
 */
export function transformPlayerTraits(
  maddenPlayer: MaddenPlayer, 
  playerId: string, 
  leagueId: string
): Omit<PlayerTrait, 'created_at' | 'updated_at'> {
  return {
    id: uuidv4(),
    player_id: playerId,
    league_id: leagueId,
    
    // Quarterback traits
    tight_spiral_trait: maddenPlayer.tightSpiralTrait,
    sense_pressure_trait: maddenPlayer.sensePressureTrait,
    throw_away_trait: maddenPlayer.throwAwayTrait,
    high_motor_trait: maddenPlayer.highMotorTrait,
    qb_style_trait: maddenPlayer.qBStyleTrait,
    
    // Defensive traits
    strip_ball_trait: maddenPlayer.stripBallTrait,
    play_ball_trait: maddenPlayer.playBallTrait,
    big_hit_trait: maddenPlayer.bigHitTrait,
    dl_bull_rush_trait: maddenPlayer.dLBullRushTrait,
    dl_swim_trait: maddenPlayer.dLSwimTrait,
    dl_spin_trait: maddenPlayer.dLSpinTrait,
    lb_style_trait: maddenPlayer.lBStyleTrait,
    
    // Offensive traits
    drops_open_pass_trait: maddenPlayer.dropOpenPassTrait,
    break_tackle_trait: null, // Not in the payload
    fight_for_yards_trait: maddenPlayer.fightForYardsTrait,
    hpc_trait: maddenPlayer.hPCatchTrait,
    pos_catch_trait: maddenPlayer.posCatchTrait,
    rac_catch_trait: maddenPlayer.yACCatchTrait,
    feet_in_bounds_trait: maddenPlayer.feetInBoundsTrait,
    cover_ball_trait: maddenPlayer.coverBallTrait,
    
    // General traits
    clutch_trait: maddenPlayer.clutchTrait,
    penalty_trait: maddenPlayer.penaltyTrait,
    predict_trait: maddenPlayer.predictTrait,
    run_style: maddenPlayer.runStyle,
  };
}

/**
 * Transform player ratings from Madden format to our database schema
 * 
 * @param maddenPlayer - Player data from the Madden Companion App
 * @param playerId - The UUID of the player in our database
 * @param leagueId - The UUID of the league this player belongs to
 * @returns PlayerRating data in the format required by our database schema
 */
export function transformPlayerRatings(
  maddenPlayer: MaddenPlayer, 
  playerId: string, 
  leagueId: string
): Omit<PlayerRating, 'id' | 'created_at' | 'updated_at'> {
  return {
    player_id: playerId,
    league_id: leagueId,
    
    // Offensive ratings
    speed_rating: maddenPlayer.speedRating,
    strength_rating: maddenPlayer.strengthRating,
    agility_rating: maddenPlayer.agilityRating,
    acceleration_rating: maddenPlayer.accelRating,
    awareness_rating: maddenPlayer.awareRating,
    catch_rating: maddenPlayer.catchRating,
    carry_rating: maddenPlayer.carryRating,
    throw_power_rating: maddenPlayer.throwPowerRating,
    throw_acc_rating: maddenPlayer.throwAccRating,
    throw_acc_short_rating: maddenPlayer.throwAccShortRating,
    throw_acc_mid_rating: maddenPlayer.throwAccMidRating,
    throw_acc_deep_rating: maddenPlayer.throwAccDeepRating,
    route_run_short_rating: maddenPlayer.routeRunShortRating,
    route_run_med_rating: maddenPlayer.routeRunMedRating,
    route_run_deep_rating: maddenPlayer.routeRunDeepRating,
    release_rating: maddenPlayer.releaseRating,
    spec_catch_rating: maddenPlayer.specCatchRating,
    cit_rating: maddenPlayer.cITRating,
    break_tackle_rating: maddenPlayer.breakTackleRating,
    truck_rating: maddenPlayer.truckRating,
    stiff_arm_rating: maddenPlayer.stiffArmRating,
    spin_move_rating: maddenPlayer.spinMoveRating,
    juke_move_rating: maddenPlayer.jukeMoveRating,
    break_sack_rating: maddenPlayer.breakSackRating,
    play_action_rating: maddenPlayer.playActionRating,
    throw_under_pressure_rating: maddenPlayer.throwUnderPressureRating,
    throw_on_run_rating: maddenPlayer.throwOnRunRating,
    lead_block_rating: maddenPlayer.leadBlockRating,
    impact_block_rating: maddenPlayer.impactBlockRating,
    run_block_rating: maddenPlayer.runBlockRating,
    run_block_power_rating: maddenPlayer.runBlockPowerRating,
    run_block_finesse_rating: maddenPlayer.runBlockFinesseRating,
    pass_block_rating: maddenPlayer.passBlockRating,
    pass_block_power_rating: maddenPlayer.passBlockPowerRating,
    pass_block_finesse_rating: maddenPlayer.passBlockFinesseRating,
    
    // Defensive ratings
    tackle_rating: maddenPlayer.tackleRating,
    hit_power_rating: maddenPlayer.hitPowerRating,
    pursuit_rating: maddenPlayer.pursuitRating,
    play_rec_rating: maddenPlayer.playRecRating,
    zone_cover_rating: maddenPlayer.zoneCoverRating,
    man_cover_rating: maddenPlayer.manCoverRating,
    press_rating: maddenPlayer.pressRating,
    block_shed_rating: maddenPlayer.blockShedRating,
    power_moves_rating: maddenPlayer.powerMovesRating,
    finesse_moves_rating: maddenPlayer.finesseMovesRating,
    
    // Special ratings
    kick_power_rating: maddenPlayer.kickPowerRating,
    kick_acc_rating: maddenPlayer.kickAccRating,
    kick_ret_rating: maddenPlayer.kickRetRating,
    
    // Physical attributes
    injury_rating: maddenPlayer.injuryRating,
    stamina_rating: maddenPlayer.staminaRating,
    toughness_rating: maddenPlayer.toughRating,
    jump_rating: maddenPlayer.jumpRating,
    
    // Other attributes
    bcv_rating: maddenPlayer.bCVRating,
    change_of_direction_rating: maddenPlayer.changeOfDirectionRating,
  };
}

/**
 * Transform player abilities from Madden format to our database schema
 * 
 * @param maddenPlayer - Player data from the Madden Companion App
 * @param playerId - The UUID of the player in our database
 * @param leagueId - The UUID of the league this player belongs to
 * @returns Array of PlayerAbility data in the format required by our database schema
 */
export function transformPlayerAbilities(
  maddenPlayer: MaddenPlayer, 
  playerId: string, 
  leagueId: string
): Omit<PlayerAbility, 'created_at' | 'updated_at'>[] {
  const abilities: Omit<PlayerAbility, 'created_at' | 'updated_at'>[] = [];
  
  // Check if player has signature abilities
  if (maddenPlayer.signatureSlotList && Array.isArray(maddenPlayer.signatureSlotList)) {
    maddenPlayer.signatureSlotList.forEach(ability => {
      if (ability) {
        abilities.push({
          id: uuidv4(),
          player_id: playerId,
          league_id: leagueId,
          signature_title: ability.signatureTitle || null,
          signature_description: ability.signatureDescription || null,
          signature_logo_id: ability.signatureLogoId || null,
          signature_activation_description: ability.signatureActivationDescription || null,
          signature_deactivation_description: ability.signatureDeactivationDescription || null,
          ability_rank: ability.abilityRank || null,
          is_passive: ability.isPassive || null,
          is_unlocked: ability.isUnlocked || null,
          market_ability_alias: ability.marketAbilityAlias || null,
        });
      }
    });
  }
  
  return abilities;
}

/**
 * Transform a complete player from Madden format to our database schema
 * 
 * @param maddenPlayer - Player data from the Madden Companion App
 * @param leagueId - The UUID of the league this player belongs to
 * @param teamIdMap - Map of Madden team IDs to our database team UUIDs
 * @returns Object containing player data for all tables
 */
export function transformMaddenPlayer(
  maddenPlayer: MaddenPlayer, 
  leagueId: string,
  teamIdMap: Map<string, string>
) {
  // Get the team ID from our database
  const teamId = teamIdMap.get(maddenPlayer.teamId.toString()) || null;
  
  // Generate a UUID for the player
  const playerId = uuidv4();
  
  // Transform player data for each table
  const playerBasicInfo = transformPlayerBasicInfo(maddenPlayer, leagueId, teamId);
  const playerTraits = transformPlayerTraits(maddenPlayer, playerId, leagueId);
  const playerRatings = transformPlayerRatings(maddenPlayer, playerId, leagueId);
  const playerAbilities = transformPlayerAbilities(maddenPlayer, playerId, leagueId);
  
  return {
    id: playerId,
    playerBasicInfo,
    playerTraits,
    playerRatings,
    playerAbilities,
  };
}

/**
 * Transform an array of players from Madden format to our database schema
 * 
 * @param maddenPlayers - Array of player data from the Madden Companion App
 * @param leagueId - The UUID of the league these players belong to
 * @param teamIdMap - Map of Madden team IDs to our database team UUIDs
 * @returns Object containing arrays of player data for all tables
 */
export function transformMaddenRoster(
  maddenPlayers: MaddenPlayer[], 
  leagueId: string,
  teamIdMap: Map<string, string>
) {
  const players: (Omit<Player, 'created_at' | 'updated_at'> & { id: string })[] = [];
  const traits: Omit<PlayerTrait, 'created_at' | 'updated_at'>[] = [];
  const ratings: Omit<PlayerRating, 'id' | 'created_at' | 'updated_at'>[] = [];
  const abilities: Omit<PlayerAbility, 'created_at' | 'updated_at'>[] = [];
  
  maddenPlayers.forEach(maddenPlayer => {
    const transformedPlayer = transformMaddenPlayer(maddenPlayer, leagueId, teamIdMap);
    
    players.push({
      id: transformedPlayer.id,
      ...transformedPlayer.playerBasicInfo,
    });
    
    traits.push(transformedPlayer.playerTraits);
    ratings.push(transformedPlayer.playerRatings);
    abilities.push(...transformedPlayer.playerAbilities);
  });
  
  return {
    players,
    traits,
    ratings,
    abilities,
  };
} 