'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { League } from '@/db/schema/leagues';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Upload,
  Trophy
} from 'lucide-react';

interface LeagueCardProps {
  league: League;
  userRole?: 'commissioner' | 'admin' | 'member';
  seasonInfo?: {
    season: number;
    week: number;
  };
}

export function LeagueCard({ league, userRole = 'commissioner', seasonInfo }: LeagueCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format the last import time
  const lastImportText = league.last_import_at 
    ? `Last import ${formatDistanceToNow(new Date(league.last_import_at), { addSuffix: true })}`
    : 'No data imported yet';
  
  // Determine platform display
  const platformDisplay = league.platform === 'ps5' ? 'PlayStation 5' : 'Xbox Series X';
  
  // Determine badge color based on user role
  const roleBadgeVariant = 
    userRole === 'commissioner' ? 'default' : 
    userRole === 'admin' ? 'secondary' : 
    'outline';
  
  return (
    <Card 
      className="transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{league.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">
                {platformDisplay}
              </Badge>
              <Badge variant={roleBadgeVariant}>
                {userRole === 'commissioner' ? 'Commissioner' : 
                 userRole === 'admin' ? 'Admin' : 'Member'}
              </Badge>
            </CardDescription>
          </div>
          {userRole === 'commissioner' && (
            <Link href={`/dashboard/leagues/${league.id}/settings`} passHref>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{lastImportText}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>32 Teams</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Season {seasonInfo?.season || 1}, Week {seasonInfo?.week || 1}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex space-x-2">
          <Link href={`/dashboard/leagues/${league.id}/import`} passHref>
            <Button variant="outline" size="sm" className="h-8">
              <Upload className="h-3.5 w-3.5 mr-1" />
              Import
            </Button>
          </Link>
          {userRole === 'commissioner' && (
            <Link href={`/dashboard/leagues/${league.id}/members`} passHref>
              <Button variant="outline" size="sm" className="h-8">
                <Users className="h-3.5 w-3.5 mr-1" />
                Members
              </Button>
            </Link>
          )}
        </div>
        <Link href={`/dashboard/leagues/${league.id}`} passHref>
          <Button 
            variant="default" 
            size="sm" 
            className={`h-8 transition-all duration-200 ${isHovered ? 'translate-x-1' : ''}`}
          >
            <span className="mr-1">Dashboard</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 