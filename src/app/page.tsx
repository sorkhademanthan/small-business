import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-6 mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <span className="text-lg font-bold tracking-tight">ReBook</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 pt-2">Login</Link>
            <Button asChild size="sm">
                <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 px-6">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200 mb-6">
             ✨ Automate your growth
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Stop Losing Money on <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
               No-Shows & Empty Slots.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            The &quot;Set-and-Forget&quot; engine that automatically confirms appointments via WhatsApp and turns happy visits into 5-star Google Reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/signup">Start Free Trial <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
              <Link href="/login">Live Demo</Link>
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Trusted by local businesses</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
                {/* Mock Logos */}
                <div className="font-bold text-xl text-slate-400">GymFit</div>
                <div className="font-bold text-xl text-slate-400">SalonLuxe</div>
                <div className="font-bold text-xl text-slate-400">DentalCare</div>
                <div className="font-bold text-xl text-slate-400">PhysioPro</div>
            </div>
        </div>
      </section>
    </div>
  );
}