// Integrations schema
// This file provides context for the discord integrations table structure

export interface DiscordIntegration {
  id: string;
  league_id: string;
  guild_id: string;
  channel_id: string;
  settings?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export const schema = {
  discord_integrations: {
    tableName: 'discord_integrations',
    columns: [
      'id', 'league_id', 'guild_id', 
      'channel_id', 'settings', 
      'created_at', 'updated_at'
    ],
  },
};