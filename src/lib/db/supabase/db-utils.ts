/**
 * Supabase Database Utilities
 * 
 * This file provides utility functions for working with Supabase
 * in a way that's compatible with the existing database operations.
 */

import { supabaseAdmin } from '@/lib/supabase/server';

// Table names as simple strings
export const tables = {
  players: 'players',
  playerTraits: 'player_traits',
  playerRatings: 'player_ratings',
  playerAbilities: 'player_abilities',
  teams: 'teams',
  leagues: 'leagues',
};

/**
 * Execute a transaction-like operation with Supabase
 * 
 * Note: Supabase doesn't support true transactions in the client,
 * so this is a best-effort implementation that executes operations
 * in sequence.
 * 
 * @param callback - Function containing database operations
 * @returns Result of the callback
 */
export async function transaction<T>(callback: () => Promise<T>): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}

/**
 * Select records from a table
 * 
 * @param table - Table name
 * @param columns - Columns to select (default: '*')
 * @returns Query builder
 */
export function select(table: string, columns: string = '*') {
  return supabaseAdmin.from(table).select(columns);
}

/**
 * Insert records into a table
 * 
 * @param table - Table name
 * @param values - Values to insert
 * @returns Query builder
 */
export function insert(table: string, values: any | any[]) {
  return supabaseAdmin.from(table).insert(values);
}

/**
 * Upsert records in a table
 * 
 * @param table - Table name
 * @param values - Values to upsert
 * @param onConflict - Column to check for conflicts
 * @returns Query builder
 */
export function upsert(table: string, values: any | any[], onConflict?: string) {
  return supabaseAdmin.from(table).upsert(values, { onConflict });
}

/**
 * Delete records from a table
 * 
 * @param table - Table name
 * @returns Query builder
 */
export function deleteFrom(table: string) {
  return supabaseAdmin.from(table).delete();
}

/**
 * Create a condition for equality
 * 
 * @param column - Column name
 * @param value - Value to compare
 * @returns Object with column and value
 */
export function eq(column: string, value: any) {
  return { [column]: value };
}

/**
 * Create a condition for values in an array
 * 
 * @param column - Column name
 * @param values - Array of values
 * @returns Object with column and values
 */
export function inArray(column: string, values: any[]) {
  return { [column]: values };
} 