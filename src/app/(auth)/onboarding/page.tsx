import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OnboardingForm } from "./onboarding-form";
import { Check } from "lucide-react";

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) return redirect("/login");

  // Check if business already exists
  const existingBusiness = await db.query.businesses.findFirst({
    where: eq(businesses.ownerId, user.id),
  });

  if (existingBusiness) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Visual & Value Prop (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              R
            </div>
            ReBook
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h2 className="text-4xl font-bold tracking-tight">
            Automate your growth engine.
          </h2>
          <p className="text-zinc-400 text-lg">
            Join other local businesses stopping no-shows and getting 5-star reviews on autopilot.
          </p>
          <ul className="space-y-4 pt-4">
            {[
              "Reduce no-shows by up to 40%",
              "Automated Google Review requests",
              "WhatsApp & SMS reminders",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-zinc-300">
                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          © 2026 ReBook Inc.
        </div>
      </div>

      {/* Right Side - The Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Setup your workspace
            </h1>
            <p className="text-zinc-500">
              Enter your business details to get started. You can change these anytime.
            </p>
          </div>
          
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}