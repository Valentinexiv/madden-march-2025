'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FaPlayStation, FaXbox } from 'react-icons/fa';

interface LeagueHeaderProps {
  league: {
    id: string;
    name: string;
    platform: string;
    league_identifier: string;
    import_url?: string | null;
    last_import_at?: string | null;
  };
}

export function LeagueHeader({ league }: LeagueHeaderProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/leagues/${league.id}`;
  
  // Determine which tab is active based on the current path
  const getActiveTab = () => {
    if (pathname.endsWith(`/teams`)) return 'teams';
    if (pathname.endsWith(`/players`)) return 'players';
    if (pathname.endsWith(`/standings`)) return 'standings';
    if (pathname.endsWith(`/schedule`)) return 'schedule';
    if (pathname.endsWith(`/settings`)) return 'settings';
    return 'overview'; // Default to overview
  };
  
  // Calculate time since last import
  const getImportStatus = () => {
    if (!league.last_import_at) return 'Never imported';
    
    const lastImport = new Date(league.last_import_at);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastImport.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Imported less than an hour ago';
    if (diffInHours < 24) return `Imported ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Imported ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{league.name}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Badge variant="outline" className="flex items-center gap-1">
              {league.platform === 'ps5' ? (
                <>
                  <FaPlayStation className="h-3 w-3" />
                  <span>PlayStation 5</span>
                </>
              ) : (
                <>
                  <FaXbox className="h-3 w-3" />
                  <span>Xbox Series X</span>
                </>
              )}
            </Badge>
            <span className="text-gray-400">•</span>
            <span>{getImportStatus()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-normal">
            ID: {league.league_identifier}
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue={getActiveTab()} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="overview" asChild>
            <Link href={basePath}>Overview</Link>
          </TabsTrigger>
          <TabsTrigger value="teams" asChild>
            <Link href={`${basePath}/teams`}>Teams</Link>
          </TabsTrigger>
          <TabsTrigger value="players" asChild>
            <Link href={`${basePath}/players`}>Players</Link>
          </TabsTrigger>
          <TabsTrigger value="standings" asChild>
            <Link href={`${basePath}/standings`}>Standings</Link>
          </TabsTrigger>
          <TabsTrigger value="schedule" asChild>
            <Link href={`${basePath}/schedule`}>Schedule</Link>
          </TabsTrigger>
          <TabsTrigger value="settings" asChild>
            <Link href={`${basePath}/settings`}>Settings</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
} 