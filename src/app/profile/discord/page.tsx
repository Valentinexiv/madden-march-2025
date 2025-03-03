'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FaDiscord, FaPlus, FaServer, FaLink, FaUnlink } from 'react-icons/fa';

// Mock data for Discord servers
const mockDiscordServers = [
  {
    id: 'server1',
    name: 'Madden League Champions',
    icon: 'https://cdn.discordapp.com/icons/123456789/abcdef.png',
    connected: true,
    memberCount: 128,
    role: 'Admin'
  },
  {
    id: 'server2',
    name: 'NFL Fantasy League',
    icon: null,
    connected: false,
    memberCount: 56,
    role: 'Member'
  },
];

export default function DiscordConnectionsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [discordServers, setDiscordServers] = useState(mockDiscordServers);
  const [isConnecting, setIsConnecting] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router]);

  // Handle connect server
  const handleConnectServer = (serverId: string) => {
    setIsConnecting(true);
    
    // Simulate API call
    setTimeout(() => {
      setDiscordServers(servers => 
        servers.map(server => 
          server.id === serverId 
            ? { ...server, connected: true } 
            : server
        )
      );
      setIsConnecting(false);
    }, 1000);
  };

  // Handle disconnect server
  const handleDisconnectServer = (serverId: string) => {
    setIsConnecting(true);
    
    // Simulate API call
    setTimeout(() => {
      setDiscordServers(servers => 
        servers.map(server => 
          server.id === serverId 
            ? { ...server, connected: false } 
            : server
        )
      );
      setIsConnecting(false);
    }, 1000);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-pulse text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-500">Please wait while we load your Discord connections.</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not redirected yet, show a message
  if (!user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="Discord avatar" 
            className="w-12 h-12 rounded-full" 
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <FaDiscord className="text-[#5865F2] w-6 h-6" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold">{discordUsername}</h2>
          <p className="text-sm text-gray-500">Connected via Discord</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaServer className="mr-2 text-gray-500" />
            Discord Servers
          </CardTitle>
          <CardDescription>
            Connect your Discord servers to enable league integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {discordServers.map(server => (
              <div 
                key={server.id} 
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {server.icon ? (
                    <img 
                      src={server.icon} 
                      alt={`${server.name} icon`} 
                      className="w-10 h-10 rounded-full" 
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-500">
                        {server.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{server.name}</h3>
                    <p className="text-sm text-gray-500">
                      {server.memberCount} members • {server.role}
                    </p>
                  </div>
                </div>
                
                {server.connected ? (
                  <Button
                    className="flex items-center gap-1 text-red-600 border border-red-200 bg-white hover:bg-red-50 hover:text-red-700 h-9 px-3 rounded-md text-sm"
                    onClick={() => handleDisconnectServer(server.id)}
                    disabled={isConnecting}
                  >
                    <FaUnlink className="w-3 h-3" />
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    className="flex items-center gap-1 text-[#5865F2] border border-[#5865F2] bg-white hover:bg-[#5865F2]/10 h-9 px-3 rounded-md text-sm"
                    onClick={() => handleConnectServer(server.id)}
                    disabled={isConnecting}
                  >
                    <FaLink className="w-3 h-3" />
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="flex items-center gap-2 w-full">
            <FaPlus className="w-3 h-3" />
            Add Another Discord Server
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discord Bot</CardTitle>
          <CardDescription>
            Add our Discord bot to your server for enhanced integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            The Madden March Discord bot enables automatic notifications, league updates, and commands for checking stats directly in your Discord server.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-medium mb-2">Bot Features:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Automatic game result notifications</li>
              <li>Player stat commands</li>
              <li>League standings updates</li>
              <li>Schedule reminders</li>
              <li>Trade and free agency alerts</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] w-full">
            <FaDiscord className="w-4 h-4" />
            Add Bot to Server
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 