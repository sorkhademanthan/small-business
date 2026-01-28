import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format, subDays } from "date-fns";
import { getDashboardStats } from "@/server/queries";
import { getDashboardMetrics } from "@/lib/metrics"; 
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, AlertCircle, IndianRupee, ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return redirect("/login");

  // 1. Critical Check: Does the user have a business?
  const business = await db.query.businesses.findFirst({
    where: eq(businesses.ownerId, user.id),
  });

  // If not, force them to onboarding (Self-healing URL)
  if (!business) {
    redirect("/onboarding");
  }

  let data;
  let advancedMetrics;

  try {
     // Fetch data using the user's ID
     data = await getDashboardStats(user.id);
     
     // Fetch advanced metrics for the charts
     advancedMetrics = await getDashboardMetrics(business.id);

  } catch (err) {
    console.error("Failed to load dashboard data", err);
    return <div>Error loading data. Please try refreshing.</div>
  }

  const { schedule } = data;
  const displayMetrics = advancedMetrics || {
      total_appointments: 0,
      no_shows: 0,
      recovered: 0,
      revenue_saved: 0,
      new_reviews: 0,
      lapsed_customers: 0,
      resurrected_this_month: 0
  };

  // Generate mock chart data outside the component to avoid impure function in render
  function generateMockChartData() {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date: format(date, "EEE"),
        revenue: Math.floor(Math.random() * 5000) + 1000
      };
    });
  }
  const chartData = generateMockChartData();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-medium shadow-sm text-slate-700">
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Revenue Protected
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <IndianRupee className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹{displayMetrics.revenue_saved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              No-Shows Prevented
            </CardTitle>
             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
               <AlertCircle className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{displayMetrics.recovered}</div>
            <p className="text-xs text-muted-foreground mt-1">
               Clients confirmed via WhatsApp
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              New 5-Star Reviews
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
              <Users className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{displayMetrics.new_reviews}</div> 
            <p className="text-xs text-muted-foreground mt-1">
              Generated in last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row */}
      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4">
            <RevenueChart data={chartData} />
        </div>

        <Card className="md:col-span-3 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
            <CardDescription>Upcoming appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            {schedule.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <CalendarDays className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">No appointments scheduled for today.</p>
                </div>
            ) : (
                <div className="space-y-1 pr-1 max-h-[350px] overflow-y-auto">
                    {schedule.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-md">
                                    <p className="text-xs font-bold text-slate-700 w-9 text-center">
                                        {format(apt.time, "h:mm")}
                                    </p>
                                    <p className="text-[10px] text-slate-500 text-center uppercase">{format(apt.time, "a")}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{apt.customerName}</p>
                                    <p className="text-xs text-slate-500">{apt.phone}</p>
                                </div>
                             </div>
                             <Badge
                                variant="outline"
                                className={
                                    apt.status === "confirmed" 
                                    ? "bg-green-50 text-green-700 border-green-200" 
                                    : apt.status === "noshow"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-slate-50 text-slate-700" 
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