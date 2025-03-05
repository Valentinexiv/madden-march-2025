'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LeagueForm } from '@/components/leagues/league-form';
import { FaPlus, FaUsers } from 'react-icons/fa';

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [selectedOption, setSelectedOption] = useState<'create' | 'join' | null>(null);

  // Check for action parameter in URL
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create') {
      setSelectedOption('create');
    } else if (action === 'join') {
      setSelectedOption('join');
    }
  }, [searchParams]);

  // If auth is still loading or user is not authenticated, show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="animate-pulse text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-500">Please wait while we set up your account.</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to sign-in
  if (!user) {
    router.push('/sign-in');
    return null;
  }

  // Handle joining an existing league
  const handleJoinLeague = () => {
    // For now, just redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to Madden March 2025</h1>
          <p className="text-gray-500 mt-2">
            Let's get you set up with your Madden league
          </p>
        </div>

        {!selectedOption ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedOption('create')}>
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                  <FaPlus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Create a League</CardTitle>
                <CardDescription>
                  Start a new league and become the commissioner
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-500">
                  Create your own league, customize settings, and invite players
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="default">
                  Create a League
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedOption('join')}>
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                  <FaUsers className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Join a League</CardTitle>
                <CardDescription>
                  Join an existing league as a player
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-500">
                  Connect to an existing league that you've been invited to
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Join a League
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : selectedOption === 'create' ? (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => setSelectedOption(null)}
            >
              ← Back to options
            </Button>
            <LeagueForm userId={user.id} onComplete={() => router.push('/dashboard')} />
          </div>
        ) : (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => setSelectedOption(null)}
            >
              ← Back to options
            </Button>
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Join an Existing League</CardTitle>
                <CardDescription>
                  Connect to a league you've been invited to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">
                  This feature is coming soon. For now, you'll be redirected to the dashboard.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleJoinLeague}>
                  Continue to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 