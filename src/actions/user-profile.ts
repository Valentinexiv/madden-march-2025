'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Type for profile update data
type ProfileUpdateData = {
  displayName?: string;
  emailNotifications?: boolean;
  discordNotifications?: boolean;
  discordDmNotifications?: boolean;
  discordChannelNotifications?: boolean;
  theme?: string;
};

// Create a Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Update user profile and preferences
 */
export async function updateUserProfile(userId: string, data: ProfileUpdateData) {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }
    
    // Update user metadata if displayName is provided
    if (data.displayName) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { user_metadata: { full_name: data.displayName } }
      );
      
      if (updateError) {
        return { success: false, error: updateError.message };
      }
    }
    
    // Update user preferences
    const preferencesData: Record<string, any> = {
      user_id: userId,
      updated_at: new Date().toISOString()
    };
    
    // Add preference fields if they exist in the data
    if (data.emailNotifications !== undefined) {
      preferencesData.email_notifications = data.emailNotifications;
    }
    
    if (data.discordNotifications !== undefined) {
      preferencesData.discord_notifications = data.discordNotifications;
    }
    
    if (data.discordDmNotifications !== undefined) {
      preferencesData.discord_dm_notifications = data.discordDmNotifications;
    }
    
    if (data.discordChannelNotifications !== undefined) {
      preferencesData.discord_channel_notifications = data.discordChannelNotifications;
    }
    
    if (data.theme) {
      preferencesData.theme = data.theme;
    }
    
    // Only update preferences if there's data to update
    if (Object.keys(preferencesData).length > 2) {
      const { error: preferencesError } = await supabaseAdmin
        .from('user_preferences')
        .upsert(preferencesData);
        
      if (preferencesError) {
        return { success: false, error: preferencesError.message };
      }
    }
    
    // Revalidate the profile page to reflect changes
    revalidatePath('/profile');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

/**
 * Get user preferences
 */
export async function getUserPreferences(userId: string) {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }
    
    // Get user preferences
    const { data, error } = await supabaseAdmin
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      data: data || {
        email_notifications: false,
        discord_notifications: true,
        discord_dm_notifications: true,
        discord_channel_notifications: true,
        theme: 'light'
      }
    };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
} 