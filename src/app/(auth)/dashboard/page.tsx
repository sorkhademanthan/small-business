import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format, subDays } from "date-fns";
import { getDashboardStats } from "@/server/queries";
import { getDashboardMetrics } from "@/lib/metrics"; // Import new metrics utility
import { RevenueChart } from "@/components/dashboard/revenue-chart"; // Import chart
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, AlertCircle, IndianRupee } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) return redirect("/login");

  // Fetch data (using the user's ID)
  // Logic inside getDashboardStats handles fetching for this user
  let data;
  let advancedMetrics;
  let businessId = null;

  try {
     data = await getDashboardStats(user.id);
     
     // We need to fetch the business ID again briefly or refactor queries.ts to return it
     // For speed, let's assume queries.ts returns the businessName, so let's just grab the metrics
     // actually queries.ts finds the business internally. 
     // Let's rely on getDashboardStats for the schedule, and call metrics separately if we had the ID.
     // To keep it simple, we will trust the data.metrics returned by getDashboardStats for the basics,
     // and maybe extend getDashboardMetrics to accept an ID if we have it. 
     
     // Update: Ideally passed from parent. For now, let's re-fetch the business ID quickly to use the new metrics lib.
     const { db } = await import('@/lib/db');
     const { businesses } = await import('@/db/schema');
     const { eq } = await import('drizzle-orm');
     
     let business = await db.query.businesses.findFirst({
        where: eq(businesses.ownerId, user.id),
      });
      // Fallback
      if (!business) {
        const all = await db.select().from(businesses).limit(1);
        if (all.length > 0) business = all[0];
      }

      if (business) {
        businessId = business.id;
        advancedMetrics = await getDashboardMetrics(business.id);
      }

  } catch (err) {
    console.error("Failed to load dashboard data", err);
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <h2 className="text-xl font-semibold">Welcome to ReBook</h2>
            <p className="text-muted-foreground">Please complete your business setup.</p>
        </div>
    )
  }

  const { schedule } = data; // We use schedule from the old query, metrics from the new one if available
  const displayMetrics = advancedMetrics || {
      // Fallback defaults
      total_appointments: 0,
      no_shows: 0,
      recovered: 0,
      revenue_saved: 0,
      new_reviews: 0
  };

  // Mock Data for the Chart (Last 7 days)
  // In a real app, you'd aggregate this from the DB.
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
        date: format(date, "EEE"), // Mon, Tue
        revenue: Math.floor(Math.random() * 5000) + 1000 // Randomized fake revenue for demo visual
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Today&apos;s Overview</h2>
        <div className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </div>
      </div>

      {/* Top Cards Row - UPDATED WITH ROI */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue Protected
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{displayMetrics.revenue_saved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Recovered from {displayMetrics.recovered} potential no-shows
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              No-Shows prevented
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayMetrics.recovered}</div>
            <p className="text-xs text-muted-foreground">
               Clients confirmed via WhatsApp
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New 5-Star Reviews
            </CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayMetrics.new_reviews}</div> 
            <p className="text-xs text-muted-foreground">
              Generated in last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row: Charts & Tables */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Chart Component */}
        <div className="col-span-3 md:col-span-2">
            <RevenueChart data={chartData} />
        </div>

        {/* Schedule Table (Compressed to side or bottom) */}
        <Card className="col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle>Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {schedule.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                    No appointments today.
                </div>
            ) : (
                <div className="space-y-4">
                    {schedule.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between border-b pb-2 last:border-0 hover:bg-slate-50 p-2 rounded">
                             <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{apt.customerName}</p>
                                <p className="text-xs text-muted-foreground">{format(apt.time, "h:mm a")}</p>
                             </div>
                             <Badge
                                variant={
                                apt.status === "confirmed"
                                    ? "default"
                                    : apt.status === "noshow"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className={
                                    apt.status === "confirmed" 
                                    ? "bg-green-600 hover:bg-green-700" 
                                    : "" 
                                }
                            >
                                {apt.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            )}
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
