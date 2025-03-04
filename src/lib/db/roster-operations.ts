/**
 * Roster Database Operations
 * 
 * This file contains database operations for roster-related data.
 * It provides functions for creating, reading, updating, and deleting
 * player data across multiple tables.
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  select, 
  insert, 
  upsert, 
  deleteFrom, 
  transaction, 
  eq, 
  inArray, 
  tables 
} from './supabase/db-utils';

// Import schema types
import { 
  Player,
  PlayerTrait,
  PlayerRating,
  PlayerAbility,
  Team,
  League
} from '@/db/schema';

/**
 * Get a mapping of Madden team IDs to our database team UUIDs for a specific league
 * 
 * @param leagueId - The UUID of the league
 * @returns A Map of Madden team IDs to our database team UUIDs
 */
export async function getTeamIdMapping(leagueId: string): Promise<Map<string, string>> {
  try {
    const { data: teamRecords, error } = await select(tables.teams, 'id, team_id')
      .eq('league_id', leagueId);
    
    if (error) throw error;
    
    const teamIdMap = new Map<string, string>();
    
    if (teamRecords && Array.isArray(teamRecords)) {
      teamRecords.forEach((team: any) => {
        if (team.team_id) {
          teamIdMap.set(team.team_id.toString(), team.id);
        }
      });
    }
    
    return teamIdMap;
  } catch (error) {
    console.error('Error getting team ID mapping:', error);
    throw new Error('Failed to get team ID mapping');
  }
}

/**
 * Get a league by ID
 * 
 * @param leagueId - The UUID of the league
 * @returns The league record or null if not found
 */
export async function getLeagueById(leagueId: string) {
  try {
    const { data, error } = await select(tables.leagues)
      .eq('id', leagueId)
      .limit(1);
    
    if (error) throw error;
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error getting league by ID:', error);
    throw new Error('Failed to get league');
  }
}

/**
 * Get players by league ID
 * 
 * @param leagueId - The UUID of the league
 * @returns Array of player records
 */
export async function getPlayersByLeagueId(leagueId: string) {
  try {
    const { data, error } = await select(tables.players)
      .eq('league_id', leagueId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting players by league ID:', error);
    throw new Error('Failed to get players');
  }
}

/**
 * Get player by ID
 * 
 * @param playerId - The UUID of the player
 * @returns The player record or null if not found
 */
export async function getPlayerById(playerId: string) {
  try {
    const { data, error } = await select(tables.players)
      .eq('id', playerId)
      .limit(1);
    
    if (error) throw error;
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error getting player by ID:', error);
    throw new Error('Failed to get player');
  }
}

/**
 * Get players by team ID
 * 
 * @param teamId - The UUID of the team
 * @returns Array of player records
 */
export async function getPlayersByTeamId(teamId: string) {
  try {
    const { data, error } = await select(tables.players)
      .eq('team_id', teamId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting players by team ID:', error);
    throw new Error('Failed to get players');
  }
}

/**
 * Get player traits by player ID
 * 
 * @param playerId - The UUID of the player
 * @returns The player traits record or null if not found
 */
export async function getPlayerTraitsByPlayerId(playerId: string) {
  try {
    const { data, error } = await select(tables.playerTraits)
      .eq('player_id', playerId)
      .limit(1);
    
    if (error) throw error;
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error getting player traits by player ID:', error);
    throw new Error('Failed to get player traits');
  }
}

/**
 * Get player ratings by player ID
 * 
 * @param playerId - The UUID of the player
 * @returns The player ratings record or null if not found
 */
export async function getPlayerRatingsByPlayerId(playerId: string) {
  try {
    const { data, error } = await select(tables.playerRatings)
      .eq('player_id', playerId)
      .limit(1);
    
    if (error) throw error;
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error getting player ratings by player ID:', error);
    throw new Error('Failed to get player ratings');
  }
}

/**
 * Get player abilities by player ID
 * 
 * @param playerId - The UUID of the player
 * @returns Array of player ability records
 */
export async function getPlayerAbilitiesByPlayerId(playerId: string) {
  try {
    const { data, error } = await select(tables.playerAbilities)
      .eq('player_id', playerId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting player abilities by player ID:', error);
    throw new Error('Failed to get player abilities');
  }
}

/**
 * Create or update players in a transaction
 * 
 * @param playerData - Array of player data to create or update
 * @returns Array of created or updated player records
 */
export async function upsertPlayers(
  playerData: (Omit<Player, 'created_at' | 'updated_at'> & { id: string })[]
) {
  try {
    // Extract player IDs for later use
    const playerIds = playerData.map(player => player.id);
    
    // Add updated_at timestamp to each player
    const playersWithTimestamp = playerData.map(player => ({
      ...player,
      updated_at: new Date()
    }));
    
    // Perform the upsert operation
    const { data, error } = await upsert(tables.players, playersWithTimestamp, 'id')
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error upserting players:', error);
    throw new Error('Failed to upsert players');
  }
}

/**
 * Create or update player traits in a transaction
 * 
 * @param traitData - Array of player trait data to create or update
 * @returns Array of created or updated player trait records
 */
export async function upsertPlayerTraits(
  traitData: Omit<PlayerTrait, 'created_at' | 'updated_at'>[]
) {
  try {
    // Extract player IDs for later use
    const playerIds = traitData.map(trait => trait.player_id);
    
    // Add updated_at timestamp to each trait
    const traitsWithTimestamp = traitData.map(trait => ({
      ...trait,
      updated_at: new Date()
    }));
    
    // Perform the operations
    await transaction(async () => {
      // Delete existing traits for these players to avoid duplicates
      await deleteFrom(tables.playerTraits)
        .in('player_id', playerIds);
      
      // Insert new traits
      if (traitsWithTimestamp.length > 0) {
        await insert(tables.playerTraits, traitsWithTimestamp);
      }
    });
    
    // Return the inserted traits
    const { data, error } = await select(tables.playerTraits)
      .in('player_id', playerIds);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error upserting player traits:', error);
    throw new Error('Failed to upsert player traits');
  }
}

/**
 * Create or update player ratings in a transaction
 * 
 * @param ratingData - Array of player rating data to create or update
 * @returns Array of created or updated player rating records
 */
export async function upsertPlayerRatings(
  ratingData: Omit<PlayerRating, 'id' | 'created_at' | 'updated_at'>[]
) {
  try {
    // Perform the upsert operation
    const result = await transaction(async () => {
      // Delete existing ratings for these players to avoid duplicates
      const playerIds = ratingData.map(rating => rating.player_id);
      await deleteFrom(tables.playerRatings)
        .in('player_id', playerIds);
      
      // Insert new ratings with generated IDs
      const ratingsWithIds = ratingData.map(rating => ({
        id: uuidv4(),
        ...rating,
      }));
      
      await insert(tables.playerRatings, ratingsWithIds);
      
      // Return the inserted ratings
      return await select(tables.playerRatings)
        .in('player_id', playerIds);
    });
    
    return result;
  } catch (error) {
    console.error('Error upserting player ratings:', error);
    throw new Error('Failed to upsert player ratings');
  }
}

/**
 * Create or update player abilities in a transaction
 * 
 * @param abilityData - Array of player ability data to create or update
 * @returns Array of created or updated player ability records
 */
export async function upsertPlayerAbilities(
  abilityData: Omit<PlayerAbility, 'created_at' | 'updated_at'>[]
) {
  try {
    // Extract ability IDs for later use
    const abilityIds = abilityData.map(ability => ability.id);
    
    // Perform the upsert operation
    const result = await transaction(async () => {
      // Delete existing abilities for these players to avoid duplicates
      const playerIds = [...new Set(abilityData.map(ability => ability.player_id))];
      await deleteFrom(tables.playerAbilities)
        .in('player_id', playerIds);
      
      // Insert new abilities
      if (abilityData.length > 0) {
        await insert(tables.playerAbilities, abilityData);
      }
      
      // Return the inserted abilities
      return await select(tables.playerAbilities)
        .in('player_id', playerIds);
    });
    
    return result;
  } catch (error) {
    console.error('Error upserting player abilities:', error);
    throw new Error('Failed to upsert player abilities');
  }
}

/**
 * Create or update a complete roster in a transaction
 * 
 * @param playerData - Array of player data to create or update
 * @param traitData - Array of player trait data to create or update
 * @param ratingData - Array of player rating data to create or update
 * @param abilityData - Array of player ability data to create or update
 * @returns Object containing arrays of created or updated records
 */
export async function upsertRoster(
  playerData: (Omit<Player, 'created_at' | 'updated_at'> & { id: string })[],
  traitData: Omit<PlayerTrait, 'created_at' | 'updated_at'>[],
  ratingData: Omit<PlayerRating, 'id' | 'created_at' | 'updated_at'>[],
  abilityData: Omit<PlayerAbility, 'created_at' | 'updated_at'>[]
) {
  try {
    // Extract player IDs for later use
    const playerIds = playerData.map(player => player.id);
    
    // Add updated_at timestamp to each record
    const playersWithTimestamp = playerData.map(player => ({
      ...player,
      updated_at: new Date()
    }));
    
    const traitsWithTimestamp = traitData.map(trait => ({
      ...trait,
      updated_at: new Date()
    }));
    
    const ratingsWithTimestamp = ratingData.map(rating => ({
      id: uuidv4(), // Generate UUID for ratings
      ...rating,
      updated_at: new Date()
    }));
    
    const abilitiesWithTimestamp = abilityData.map(ability => ({
      ...ability,
      updated_at: new Date()
    }));
    
    // Perform all operations in sequence (Supabase doesn't support true transactions)
    await transaction(async () => {
      // Upsert players
      await upsert(tables.players, playersWithTimestamp, 'id');
      
      // Delete existing traits, ratings, and abilities for these players
      if (playerIds.length > 0) {
        await deleteFrom(tables.playerTraits).in('player_id', playerIds);
        await deleteFrom(tables.playerRatings).in('player_id', playerIds);
        await deleteFrom(tables.playerAbilities).in('player_id', playerIds);
      }
      
      // Insert new traits
      if (traitsWithTimestamp.length > 0) {
        await insert(tables.playerTraits, traitsWithTimestamp);
      }
      
      // Insert new ratings
      if (ratingsWithTimestamp.length > 0) {
        await insert(tables.playerRatings, ratingsWithTimestamp);
      }
      
      // Insert new abilities
      if (abilitiesWithTimestamp.length > 0) {
        await insert(tables.playerAbilities, abilitiesWithTimestamp);
      }
    });
    
    // Fetch and return the updated data
    const { data: updatedPlayers } = await select(tables.players).in('id', playerIds);
    const { data: updatedTraits } = await select(tables.playerTraits).in('player_id', playerIds);
    const { data: updatedRatings } = await select(tables.playerRatings).in('player_id', playerIds);
    const { data: updatedAbilities } = await select(tables.playerAbilities).in('player_id', playerIds);
    
    return {
      players: updatedPlayers || [],
      traits: updatedTraits || [],
      ratings: updatedRatings || [],
      abilities: updatedAbilities || []
    };
  } catch (error) {
    console.error('Error upserting roster:', error);
    throw new Error('Failed to upsert roster');
  }
}

/**
 * Delete a player and all related data
 * 
 * @param playerId - The UUID of the player to delete
 * @returns Boolean indicating success
 */
export async function deletePlayer(playerId: string): Promise<boolean> {
  try {
    await transaction(async () => {
      // Delete related data first
      await deleteFrom(tables.playerAbilities)
        .eq(tables.playerAbilities.player_id, playerId);
      
      await deleteFrom(tables.playerRatings)
        .eq(tables.playerRatings.player_id, playerId);
      
      await deleteFrom(tables.playerTraits)
        .eq(tables.playerTraits.player_id, playerId);
      
      // Delete the player last
      await deleteFrom(tables.players)
        .eq(tables.players.id, playerId);
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting player:', error);
    throw new Error('Failed to delete player');
  }
}

/**
 * Delete all players and related data for a team
 * 
 * @param teamId - The UUID of the team
 * @returns Boolean indicating success
 */
export async function deleteTeamPlayers(teamId: string): Promise<boolean> {
  try {
    // Get all player IDs for this team
    const teamPlayers = await select(tables.players)
      .eq(tables.players.team_id, teamId);
    
    const playerIds = teamPlayers.map(player => player.id);
    
    if (playerIds.length === 0) {
      return true; // No players to delete
    }
    
    await transaction(async () => {
      // Delete related data first
      await deleteFrom(tables.playerAbilities)
        .in('player_id', playerIds);
      
      await deleteFrom(tables.playerRatings)
        .in('player_id', playerIds);
      
      await deleteFrom(tables.playerTraits)
        .in('player_id', playerIds);
      
      // Delete the players last
      await deleteFrom(tables.players)
        .in('id', playerIds);
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting team players:', error);
    throw new Error('Failed to delete team players');
  }
}

/**
 * Delete all players and related data for a league
 * 
 * @param leagueId - The UUID of the league
 * @returns Boolean indicating success
 */
export async function deleteLeaguePlayers(leagueId: string): Promise<boolean> {
  try {
    // Get all player IDs for this league
    const leaguePlayers = await select(tables.players)
      .eq(tables.players.league_id, leagueId);
    
    const playerIds = leaguePlayers.map(player => player.id);
    
    if (playerIds.length === 0) {
      return true; // No players to delete
    }
    
    await transaction(async () => {
      // Delete related data first
      await deleteFrom(tables.playerAbilities)
        .in('player_id', playerIds);
      
      await deleteFrom(tables.playerRatings)
        .in('player_id', playerIds);
      
      await deleteFrom(tables.playerTraits)
        .in('player_id', playerIds);
      
      // Delete the players last
      await deleteFrom(tables.players)
        .in('id', playerIds);
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting league players:', error);
    throw new Error('Failed to delete league players');
  }
} 