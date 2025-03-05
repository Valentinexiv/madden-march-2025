'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HiUsers, HiStar, HiCalendar, HiTrophy } from 'react-icons/hi';

interface LeagueStatsSummaryProps {
  stats: {
    totalTeams: number;
    totalPlayers: number;
    currentWeek: number;
    seasonType: string;
    topRusher?: {
      name: string;
      yards: number;
      team: string;
    };
    topPasser?: {
      name: string;
      yards: number;
      team: string;
    };
  };
}

export function LeagueStatsSummary({ stats }: LeagueStatsSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Teams"
        value={stats.totalTeams.toString()}
        icon={<HiUsers className="h-5 w-5 text-blue-500" />}
        description="Active teams in league"
      />
      
      <StatCard
        title="Players"
        value={stats.totalPlayers.toString()}
        icon={<HiStar className="h-5 w-5 text-green-500" />}
        description="Total rostered players"
      />
      
      <StatCard
        title="Current Week"
        value={`Week ${stats.currentWeek}`}
        icon={<HiCalendar className="h-5 w-5 text-purple-500" />}
        description={`${stats.seasonType}`}
      />
      
      <StatCard
        title="League Leaders"
        value={stats.topRusher ? stats.topRusher.name : 'N/A'}
        icon={<HiTrophy className="h-5 w-5 text-yellow-500" />}
        description={stats.topRusher ? `${stats.topRusher.yards} rushing yards` : 'No stats yet'}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
} 