'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation'; // Added useRouter
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitPrivateFeedback } from '@/server/actions/submit-private-feedback';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface ReviewFormProps {
  appointmentId: string;
  businessName: string;
  customerName: string;
  googleReviewLink: string;
}

export function ReviewForm({ 
  appointmentId, 
  businessName, 
  customerName, 
  googleReviewLink 
}: ReviewFormProps) {
  const router = useRouter(); // Initialize router
  const [step, setStep] = useState<'rating' | 'feedback' | 'redirect'>('rating');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRating = (value: number) => {
    setRating(value);
    // Smart Filter Logic
    if (value >= 4) {
      setStep('redirect');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500'] // Gold colors
      });
    } else {
      setStep('feedback');
    }
  };

  const handleGoogleClick = () => {
    // 1. Open Google Review in a new tab so they can review
    window.open(googleReviewLink, '_blank');
    // 2. Redirect this tab to the Referral/Thank you page
    router.push(`/review/${appointmentId}/thank-you`);
  };

  const handlePrivateSubmit = async () => {
    setSubmitting(true);
    await submitPrivateFeedback(appointmentId, rating, comment);
    setSubmitting(false);
    // Just thank them and close
    alert("Thank you for your feedback. The owner has been notified.");
    // Ideally redirect to a generic thank you page
  };

  // --- VIEW 1: RATING ---
  if (step === 'rating') {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="space-y-2">
           <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hi {customerName.split(' ')[0]}! 👋
          </h1>
          <p className="text-xl text-slate-600">
            How was your visit to <span className="font-semibold text-slate-900">{businessName}</span>?
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => handleRating(star)}
              className="transition-transform hover:scale-110 active:scale-95 touch-manipulation"
            >
              <Star 
                className={cn(
                  "w-12 h-12 transition-colors",
                  (hovered || rating) >= star 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "fill-slate-100 text-slate-200"
                )}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-400">Tap a star to rate</p>
      </div>
    );
  }

  // --- VIEW 2: HAPPY PATH (Google) ---
  if (step === 'redirect') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
           <ThumbsUp className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">That&apos;s Awesome! 🎉</h2>
        <p className="text-slate-600">
          We&apos;re glad see you enjoyed it. Would you mind taking 10 seconds to share that on Google?
        </p>
        
        <div className="pt-4">
          <Button 
            size="lg" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-14"
            onClick={handleGoogleClick}
          >
            Rate on Google Maps
          </Button>
          <Button 
            variant="ghost" 
            className="mt-4 text-slate-400"
            onClick={() => router.push(`/review/${appointmentId}/thank-you`)}
          >
            No thanks, maybe later
          </Button>
        </div>
      </div>
    );
  }

  // --- VIEW 3: UNHAPPY PATH (Private) ---
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
           <MessageSquare className="w-8 h-8 text-slate-500" />
        </div>
      <h2 className="text-xl font-bold text-slate-900">We&apos;re sorry to hear that.</h2>
      <p className="text-slate-600">
        Please tell us what went wrong so we can fix it for next time.
      </p>

      <Textarea 
        placeholder="Tell us what happened..." 
        className="min-h-30 text-base p-4"
        value={comment}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
      />

      <Button 
        size="lg" 
        className="w-full" 
        onClick={handlePrivateSubmit}
        disabled={submitting}
      >
        {submitting ? "Sending..." : "Send Feedback"}
      </Button>
    </div>
  );
}
