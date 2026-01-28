import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/login");

  const business = await db.query.businesses.findFirst({
    where: eq(businesses.ownerId, user.id),
  });

  if (!business) return <div>Business not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Settings</h1>
        <p className="mt-2 text-base text-zinc-500 max-w-2xl">
          Manage your business configuration, integrations, and automation preferences.
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-200" />

      {/* Section 1: Reputation */}
      <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-2">
          <h2 className="text-lg font-semibold text-zinc-900">Review Destination</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            This is the most critical setting. When a customer rates you 5 stars, we redirect them here.
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <SettingsForm initialLink={business.googleReviewLink} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-200" />

      {/* Section 2: Integrations */}
      <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-2">
          <h2 className="text-lg font-semibold text-zinc-900">Integrations</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Status of your third-party connections. These are managed via your environment variables.
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-medium text-zinc-900">WhatsApp Business API</h3>
                  {process.env.WHATSAPP_PHONE_NUMBER_ID && (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      v21.0
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-500">
                  {process.env.WHATSAPP_PHONE_NUMBER_ID 
                    ? "Connected to Meta Cloud API."
                    : "Not configured. Check environment variables."}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                {process.env.WHATSAPP_PHONE_NUMBER_ID ? (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-inset ring-zinc-200/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone Number ID</span>
                  <div className="font-mono text-sm text-zinc-900">
                    {process.env.WHATSAPP_PHONE_NUMBER_ID || "Not Configured"}
                  </div>
                </div>
                {process.env.WHATSAPP_PHONE_NUMBER_ID && (
                    <div className="text-xs text-zinc-400 flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Operational
                    </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
}