'use client';

import { createBusiness } from '@/server/actions/create-business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function OnboardingForm() {
  const [loading, setLoading] = useState(false);

  // We are using a simple form handling here for speed, 
  // keeping it compatible with the server action we just made.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    await createBusiness(formData);
    // Redirect happens in server action
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Business Name</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="e.g. Gold Gym" 
          required 
          disabled={loading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Business
      </Button>
    </form>
  );
}
