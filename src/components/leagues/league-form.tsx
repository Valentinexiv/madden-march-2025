'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeagueCreateInput, LeagueCreateSchema } from '@/lib/validators/league-validators';
import { createNewLeague, checkLeagueIdentifier } from '@/lib/actions/league-actions';
import { useToast } from '@/components/ui/use-toast';

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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface LeagueFormProps {
  userId: string;
}

export function LeagueForm({ userId }: LeagueFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugCheckLoading, setSlugCheckLoading] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const form = useForm<LeagueCreateInput>({
    resolver: zodResolver(LeagueCreateSchema),
    defaultValues: {
      name: '',
      league_identifier: '',
      platform: 'ps5',
      madden_league_id: '',
      discord_server_id: null,
    },
  });

  const checkSlugAvailability = async (slug: string) => {
    if (slug.length < 2) return;
    
    setSlugCheckLoading(true);
    try {
      const result = await checkLeagueIdentifier({ league_identifier: slug });
      setSlugAvailable(result.available);
    } catch (error) {
      console.error('Error checking slug availability:', error);
      setSlugAvailable(null);
    } finally {
      setSlugCheckLoading(false);
    }
  };

  const onSubmit = async (data: LeagueCreateInput) => {
    setIsSubmitting(true);
    try {
      // Check slug availability one more time before submitting
      const slugCheck = await checkLeagueIdentifier({ league_identifier: data.league_identifier });
      if (!slugCheck.available) {
        form.setError('league_identifier', { 
          type: 'manual', 
          message: 'This identifier is already taken. Please choose another one.' 
        });
        setSlugAvailable(false);
        return;
      }

      const result = await createNewLeague(userId, data);
      
      if (result.success && result.league) {
        toast({
          title: 'League created successfully!',
          description: `Your league "${data.name}" has been created.`,
        });
        
        // Redirect to the league dashboard
        router.push(`/leagues/${result.league.id}`);
      } else {
        toast({
          title: 'Error creating league',
          description: result.error || 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating league:', error);
      toast({
        title: 'Error creating league',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New League</CardTitle>
        <CardDescription>
          Set up your Madden league to start importing and tracking stats.
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
                    <Input placeholder="My Awesome League" {...field} />
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
              name="league_identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>League Identifier (Slug)</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input 
                        placeholder="my-league" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          checkSlugAvailability(e.target.value);
                        }}
                      />
                      {slugCheckLoading && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    This will be used in your API URL: /api/leagues/<strong>{field.value || 'your-slug'}</strong>/import
                  </FormDescription>
                  {slugAvailable !== null && !slugCheckLoading && field.value.length >= 2 && (
                    <Alert className={slugAvailable ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}>
                      <AlertDescription>
                        {slugAvailable 
                          ? '✓ This identifier is available!' 
                          : '✗ This identifier is already taken. Please choose another one.'}
                      </AlertDescription>
                    </Alert>
                  )}
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
                  <FormLabel>Madden League ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678" {...field} />
                  </FormControl>
                  <FormDescription>
                    The unique identifier for your league in Madden.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating League...
                  </>
                ) : (
                  'Create League'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 text-sm text-muted-foreground">
        <p>
          Your league will be created immediately without payment during this testing phase.
        </p>
      </CardFooter>
    </Card>
  );
} 