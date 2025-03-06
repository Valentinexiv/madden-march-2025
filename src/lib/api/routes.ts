/**
 * API Routes
 * 
 * This file defines the API route patterns used throughout the application.
 * It ensures consistency in URL structure and provides a central place to
 * manage all API endpoints.
 */

/**
 * Base API routes
 */
export const ApiRoutes = {
  // Auth routes
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    session: '/api/auth/session',
    user: '/api/auth/user',
  },
  
  // User routes
  users: {
    base: '/api/users',
    profile: (userId: string) => `/api/users/${userId}`,
    preferences: (userId: string) => `/api/users/${userId}/preferences`,
  },
  
  // League routes
  leagues: {
    base: '/api/leagues',
    detail: (leagueId: string) => `/api/leagues/${leagueId}`,
    members: (leagueId: string) => `/api/leagues/${leagueId}/members`,
    teams: (leagueId: string) => `/api/leagues/${leagueId}/teams`,
    players: (leagueId: string) => `/api/leagues/${leagueId}/players`,
    import: (leagueId: string) => `/api/leagues/${leagueId}/import`,
    stats: (leagueId: string) => `/api/leagues/${leagueId}/stats`,
  },
  
  // Team routes
  teams: {
    base: '/api/teams',
    detail: (teamId: string) => `/api/teams/${teamId}`,
    roster: (teamId: string) => `/api/teams/${teamId}/roster`,
    stats: (teamId: string) => `/api/teams/${teamId}/stats`,
  },
  
  // Player routes
  players: {
    base: '/api/players',
    detail: (playerId: string) => `/api/players/${playerId}`,
    stats: (playerId: string) => `/api/players/${playerId}/stats`,
    ratings: (playerId: string) => `/api/players/${playerId}/ratings`,
    traits: (playerId: string) => `/api/players/${playerId}/traits`,
    abilities: (playerId: string) => `/api/players/${playerId}/abilities`,
  },
  
  // Game routes
  games: {
    base: '/api/games',
    detail: (gameId: string) => `/api/games/${gameId}`,
    stats: (gameId: string) => `/api/games/${gameId}/stats`,
  },
  
  // Stats routes
  stats: {
    base: '/api/stats',
    weekly: '/api/stats/weekly',
    season: '/api/stats/season',
    career: '/api/stats/career',
  },
  
  // Subscription routes
  subscriptions: {
    base: '/api/subscriptions',
    plans: '/api/subscriptions/plans',
    checkout: '/api/subscriptions/checkout',
    portal: '/api/subscriptions/portal',
    webhook: '/api/subscriptions/webhook',
  },
  
  // Integration routes
  integrations: {
    discord: {
      base: '/api/integrations/discord',
      webhook: '/api/integrations/discord/webhook',
      auth: '/api/integrations/discord/auth',
      callback: '/api/integrations/discord/callback',
    },
  },
};

/**
 * Helper function to build API URLs with query parameters
 * 
 * @param baseUrl - The base URL
 * @param params - Object containing query parameters
 * @returns URL with query parameters
 */
export function buildApiUrl(baseUrl: string, params?: Record<string, string | number | boolean>): string {
  if (!params) return baseUrl;
  
  const url = new URL(baseUrl, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
} 