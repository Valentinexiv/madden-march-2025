'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeagueUpdateInput, LeagueUpdateSchema, LeagueDeleteInput, LeagueDeleteSchema } from '@/lib/validators/league-validators';
import { updateExistingLeague, deleteExistingLeague } from '@/lib/actions/league-actions';
import { useToast } from '@/components/ui/use-toast';
import { League } from '@/db/schema/leagues';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react';

interface LeagueSettingsProps {
  league: League;
  userId: string;
  userTeam?: {
    id: string;
    name: string;
    abbreviation: string;
  } | null;
  discordInfo?: {
    username: string;
    avatar: string;
  } | null;
}

export function LeagueSettings({ league, userId, userTeam, discordInfo }: LeagueSettingsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form for updating league settings
  const form = useForm<LeagueUpdateInput>({
    resolver: zodResolver(LeagueUpdateSchema),
    defaultValues: {
      name: league.name,
      platform: league.platform as 'ps5' | 'xbsx',
      madden_league_id: league.madden_league_id || '',
      discord_server_id: league.discord_server_id,
      import_url: league.import_url,
    },
  });

  // Form for deleting league
  const deleteForm = useForm<LeagueDeleteInput>({
    resolver: zodResolver(LeagueDeleteSchema),
    defaultValues: {
      id: league.id,
      confirmation: '' as any,
    },
  });

  const onSubmit = async (data: LeagueUpdateInput) => {
    setIsSubmitting(true);
    try {
      const result = await updateExistingLeague(userId, league.id, data);
      
      if (result.success) {
        toast({
          title: 'League updated successfully!',
          description: `Your league "${data.name || league.name}" has been updated.`,
        });
        
        // Refresh the page to show updated data
        router.refresh();
      } else {
        toast({
          title: 'Error updating league',
          description: result.error || 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating league:', error);
      toast({
        title: 'Error updating league',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (data: LeagueDeleteInput) => {
    setIsDeleting(true);
    try {
      const result = await deleteExistingLeague(userId, data);
      
      if (result.success) {
        toast({
          title: 'League deleted successfully!',
          description: `Your league "${league.name}" has been deleted.`,
        });
        
        // Redirect to leagues list
        router.push('/leagues');
      } else {
        toast({
          title: 'Error deleting league',
          description: result.error || 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting league:', error);
      toast({
        title: 'Error deleting league',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* User Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Your information for this league
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Discord Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Discord Account</h3>
            {discordInfo ? (
              <div className="flex items-center space-x-3">
                {discordInfo.avatar && (
                  <img 
                    src={discordInfo.avatar} 
                    alt={discordInfo.username} 
                    className="h-10 w-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{discordInfo.username}</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">?</span>
                </div>
                <div>
                  <p className="font-medium">Not Connected</p>
                  <p className="text-sm text-muted-foreground">
                    <Button variant="link" className="h-auto p-0" onClick={() => router.push('/settings/discord')}>
                      Connect Discord
                    </Button>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Team Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Your Team</h3>
            {userTeam ? (
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">{userTeam.abbreviation}</span>
                </div>
                <div>
                  <p className="font-medium">{userTeam.name}</p>
                  <p className="text-sm text-muted-foreground">Team Owner</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">?</span>
                </div>
                <div>
                  <p className="font-medium">No Team Assigned</p>
                  <p className="text-sm text-muted-foreground">
                    You haven't been assigned a team in this league yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* League Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>League Settings</CardTitle>
          <CardDescription>
            Update your league settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>League Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the display name for your league.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="ps5" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            PlayStation 5
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="xbsx" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Xbox Series X
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="madden_league_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Madden League ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The unique identifier for your league in Madden.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Import URL Card */}
      <Card>
        <CardHeader>
          <CardTitle>Import URL</CardTitle>
          <CardDescription>
            Use this URL in the Madden Companion App to import data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded-md font-mono text-sm break-all">
            {league.import_url || `${process.env.NEXT_PUBLIC_APP_URL}/api/leagues/${league.league_identifier}/import`}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Enter this URL in the Madden Companion App to export your league data.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader className="bg-red-50 text-red-900 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle>Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-red-700">
            Actions here can't be undone
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Delete this league</h3>
              <p className="text-sm text-muted-foreground">
                Once deleted, all data will be permanently removed.
              </p>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete League
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete League</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the league
                    "{league.name}" and all associated data.
                  </DialogDescription>
                </DialogHeader>
                <Form {...deleteForm}>
                  <form onSubmit={deleteForm.handleSubmit(onDelete)} className="space-y-4">
                    <FormField
                      control={deleteForm.control}
                      name="confirmation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Please type <span className="font-bold">DELETE</span> to confirm
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="DELETE" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        variant="destructive" 
                        disabled={isDeleting || deleteForm.watch('confirmation') !== 'DELETE'}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          'Delete League'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 