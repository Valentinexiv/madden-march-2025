// Games schema
// This file provides context for the games table structure

export interface Game {
  id: string;
  league_id: string;
  home_team_id: string;
  away_team_id: string;
  week: number;
  season: number;
  status: 'scheduled' | 'in_progress' | 'completed';
  home_score?: number;
  away_score?: number;
  stats?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export const schema = {
  games: {
    tableName: 'games',
    columns: [
      'id', 'league_id', 'home_team_id', 'away_team_id', 
      'week', 'season', 'status', 
      'home_score', 'away_score', 'stats', 
      'created_at', 'updated_at'
    ],
  },
};