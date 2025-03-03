'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { FaDiscord } from 'react-icons/fa';
import { updateUserProfile, getUserPreferences } from '@/actions/user-profile';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [discordNotifications, setDiscordNotifications] = useState(true);
  const [discordDmNotifications, setDiscordDmNotifications] = useState(true);
  const [discordChannelNotifications, setDiscordChannelNotifications] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/sign-in');
    } else if (user) {
      // Initialize form with user data
      setDisplayName(user.user_metadata?.full_name || user.user_metadata?.name || '');
      
      // Fetch user preferences from database
      const fetchUserPreferences = async () => {
        if (user.id) {
          const result = await getUserPreferences(user.id);
          if (result.success && result.data) {
            setEmailNotifications(result.data.email_notifications || false);
            setDiscordNotifications(result.data.discord_notifications || true);
            setDiscordDmNotifications(result.data.discord_dm_notifications || true);
            setDiscordChannelNotifications(result.data.discord_channel_notifications || true);
          }
        }
      };
      
      fetchUserPreferences();
    }
  }, [user, isLoading, router]);

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    setUpdateSuccess(false);
    
    try {
      const result = await updateUserProfile(user.id, {
        displayName,
        emailNotifications,
        discordNotifications,
        discordDmNotifications,
        discordChannelNotifications
      });
      
      if (result.success) {
        setUpdateSuccess(true);
      } else {
        console.error('Error updating profile:', result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-pulse text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-500">Please wait while we load your profile.</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not redirected yet, show a message
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-500">You need to be signed in to view this page.</p>
        </div>
      </div>
    );
  }

  // Get user details from metadata if available
  const discordUsername = user.user_metadata?.name || user.user_metadata?.preferred_username || user.email;
  const avatarUrl = user.user_metadata?.avatar_url;
  const discordId = user.user_metadata?.sub || user.user_metadata?.provider_id;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Discord Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Discord Account</CardTitle>
            <CardDescription>Your connected Discord account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Discord avatar" 
                className="w-24 h-24 rounded-full mb-4" 
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FaDiscord className="text-[#5865F2] w-12 h-12" />
              </div>
            )}
            <div className="text-center">
              <h3 className="font-medium text-lg">{discordUsername}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              {discordId && (
                <p className="text-xs text-gray-400 mt-1">Discord ID: {discordId}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="flex items-center gap-2 border border-gray-300 bg-white text-gray-800 hover:bg-gray-50">
              <FaDiscord className="text-[#5865F2]" />
              Refresh Discord Data
            </Button>
          </CardFooter>
        </Card>
        
        {/* Profile Settings Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder="Your display name"
              />
              <p className="text-sm text-gray-500">
                This name will be shown to other users in leagues
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="font-normal">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive updates about your leagues via email
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="discordNotifications" className="font-normal">
                      Discord Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive updates about your leagues via Discord
                    </p>
                  </div>
                  <Switch 
                    id="discordNotifications" 
                    checked={discordNotifications} 
                    onCheckedChange={setDiscordNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between pl-6">
                  <div>
                    <Label htmlFor="discordDmNotifications" className="font-normal">
                      Discord Direct Messages
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive direct messages for important updates
                    </p>
                  </div>
                  <Switch 
                    id="discordDmNotifications" 
                    checked={discordDmNotifications} 
                    onCheckedChange={setDiscordDmNotifications}
                    disabled={!discordNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between pl-6">
                  <div>
                    <Label htmlFor="discordChannelNotifications" className="font-normal">
                      Discord Channel Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications in league channels
                    </p>
                  </div>
                  <Switch 
                    id="discordChannelNotifications" 
                    checked={discordChannelNotifications} 
                    onCheckedChange={setDiscordChannelNotifications}
                    disabled={!discordNotifications}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            {updateSuccess && (
              <p className="text-sm text-green-600">Profile updated successfully!</p>
            )}
            <Button 
              onClick={handleUpdateProfile} 
              disabled={isUpdating}
              className="ml-auto"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Connected Leagues Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Connected Leagues</CardTitle>
            <CardDescription>Leagues you are participating in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>You haven't joined any leagues yet.</p>
              <Button 
                className="mt-4" 
                onClick={() => router.push('/leagues')}
              >
                Browse Available Leagues
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 