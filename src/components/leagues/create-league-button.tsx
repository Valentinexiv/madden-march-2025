'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LeagueForm } from '@/components/leagues/league-form';
import { PlusCircle } from 'lucide-react';

interface CreateLeagueButtonProps {
  userId: string;
}

export function CreateLeagueButton({ userId }: CreateLeagueButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create League
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <LeagueForm userId={userId} />
      </DialogContent>
    </Dialog>
  );
} 