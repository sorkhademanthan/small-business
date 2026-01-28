'use client';

import { useState, useMemo } from 'react';
import { Loader2, ArrowRight, Building2, MapPin, Globe } from 'lucide-react';
import { createBusiness } from '@/server/actions/create-business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // FIX: Use useMemo instead of useEffect + useState to avoid cascading renders
  const detectedTimezone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    // Explicitly append timezone if the hidden input misses it for some reason
    if (!formData.get('timezone')) {
        formData.append('timezone', detectedTimezone);
    }

    const result = await createBusiness(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Success redirect handled by Server Action
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        
        {/* Business Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-zinc-700">Business Name</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              id="name"
              name="name"
              placeholder="e.g. Gold Gym Mumbai"
              required
              minLength={2}
              disabled={loading}
              className="pl-10 h-11 border-zinc-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Google Review Link (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="google_review_link" className="text-zinc-700">
            Google Review Link <span className="text-zinc-400 font-normal">(Optional)</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              id="google_review_link"
              name="google_review_link"
              placeholder="https://g.page/r/..."
              disabled={loading}
              className="pl-10 h-11 border-zinc-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
            />
          </div>
          <p className="text-[11px] text-zinc-500">
            {/* FIX: Escape quotes */}
            Go to your Google Business Profile &gt; &quot;Ask for reviews&quot; &gt; Copy link.
          </p>
        </div>

        {/* Timezone (Hidden/Read-only) */}
        <div className="space-y-2">
          <Label className="text-zinc-700">Timezone</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input 
                name="timezone"
                value={detectedTimezone} 
                readOnly 
                className="pl-10 h-11 bg-zinc-50 text-zinc-500 border-zinc-200"
            />
          </div>
          <p className="text-[11px] text-zinc-400">
            Auto-detected for reminder accuracy.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"/>
            {error}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={loading}
        className={cn(
          "w-full h-11 text-base font-medium shadow-lg transition-all hover:shadow-xl",
          loading ? "bg-zinc-800" : "bg-zinc-900 hover:bg-zinc-800"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Setting up...
          </>
        ) : (
          <>
            Create Workspace
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}