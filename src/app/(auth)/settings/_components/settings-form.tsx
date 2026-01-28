'use client';

import { useState, useTransition } from 'react';
import { updateSettings } from "@/server/actions/update-settings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Link as LinkIcon, Check, Copy } from "lucide-react";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // If you don't have sonner, remove this line

interface SettingsFormProps {
  initialLink: string | null;
}

export function SettingsForm({ initialLink }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);
  const [link, setLink] = useState(initialLink || '');
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await updateSettings(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      router.refresh();
    });
  };

  const copyToClipboard = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="googleReviewLink" className="text-sm font-medium text-zinc-900">
            Google Review Link
          </Label>
          <p className="text-[13px] text-zinc-500">
            This is the direct link we send to happy customers.
          </p>
        </div>

        {/* Premium Input Group */}
        <div className="relative group flex rounded-lg shadow-sm ring-1 ring-zinc-200 transition-all focus-within:ring-2 focus-within:ring-zinc-900 focus-within:ring-offset-1 hover:ring-zinc-300 bg-white">
          <div className="pointer-events-none flex items-center pl-3">
            <LinkIcon className="h-4 w-4 text-zinc-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="googleReviewLink"
            id="googleReviewLink"
            className="block flex-1 border-0 bg-transparent py-2.5 pl-3 pr-12 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 font-mono"
            placeholder="https://g.page/r/..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={isPending}
          />
          <div className="flex items-center pr-2">
            <button
              type="button"
              onClick={copyToClipboard}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              title="Copy link"
            >
              {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="rounded-md bg-zinc-50 p-3 border border-zinc-100">
            <p className="text-xs text-zinc-500 leading-relaxed">
                <span className="font-medium text-zinc-900">Tip:</span> Find this link in your Google Business Profile &rarr; &quot;Ask for reviews&quot;. It usually starts with <code>g.page</code>.
            </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
        <span className="text-xs text-zinc-400">
          {isSaved ? "Last saved just now" : "Auto-formatted for best results"}
        </span>
        <Button 
          type="submit" 
          disabled={isPending} 
          className={cn(
            "min-w-[120px] shadow-sm transition-all duration-300",
            isSaved 
              ? "bg-green-600 hover:bg-green-700 text-white ring-green-600" 
              : "bg-zinc-900 hover:bg-zinc-800 text-white"
          )}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSaved ? (
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Saved
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}