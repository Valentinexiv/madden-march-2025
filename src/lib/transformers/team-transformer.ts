/**
 * Team Transformer
 * 
 * This file contains utilities to transform team data from the Madden Companion App
 * into the format required by our database schema.
 */

import { MaddenTeam } from '../validators/team-validators';
import { Team } from '@/db/schema/teams';

/**
 * Transform a team from the Madden Companion App format to our database schema format
 * 
 * @param maddenTeam - Team data from the Madden Companion App
 * @param leagueId - The UUID of the league this team belongs to
 * @returns Team data in the format required by our database schema
 */
export function transformMaddenTeam(maddenTeam: MaddenTeam, leagueId: string): Omit<Team, 'id' | 'created_at' | 'updated_at'> {
  return {
    league_id: leagueId,
    team_id: maddenTeam.teamId.toString(),
    city_name: maddenTeam.cityName,
    nick_name: maddenTeam.nickName,
    abbr_name: maddenTeam.abbrName,
    display_name: maddenTeam.displayName,
    div_name: maddenTeam.divName,
    logo_id: maddenTeam.logoId,
    primary_color: maddenTeam.primaryColor,
    secondary_color: maddenTeam.secondaryColor,
    ovr_rating: maddenTeam.ovrRating,
    off_scheme: maddenTeam.offScheme,
    def_scheme: maddenTeam.defScheme,
    injury_count: maddenTeam.injuryCount,
    user_name: maddenTeam.userName,
  };
}

/**
 * Transform an array of teams from the Madden Companion App format to our database schema format
 * 
 * @param maddenTeams - Array of team data from the Madden Companion App
 * @param leagueId - The UUID of the league these teams belong to
 * @returns Array of team data in the format required by our database schema
 */
export function transformMaddenTeams(maddenTeams: MaddenTeam[], leagueId: string): Omit<Team, 'id' | 'created_at' | 'updated_at'>[] {
  return maddenTeams.map(team => transformMaddenTeam(team, leagueId));
} 