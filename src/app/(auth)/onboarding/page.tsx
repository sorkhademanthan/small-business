import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) return redirect("/login");

  // Check if business exists for this user
  const existingBusiness = await db.query.businesses.findFirst({
    where: eq(businesses.ownerId, user.id),
  });

  if (existingBusiness) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to ReBook</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Let&apos;s get your business profile set up.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
