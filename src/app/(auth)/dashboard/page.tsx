import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getDashboardStats } from "@/server/queries";
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
import { CalendarDays, Users, AlertCircle } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) return redirect("/login");

  // Fetch data (using the user's ID)
  // Logic inside getDashboardStats handles fetching for this user
  let data;
  try {
     data = await getDashboardStats(user.id);
  } catch (err) {
    // If business fails to load or doesn't exist, we might want to redirect to onboarding
    // For MVP, we'll return a basic empty state or error
    console.error("Failed to load dashboard data", err);
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <h2 className="text-xl font-semibold">Welcome to ReBook</h2>
            <p className="text-muted-foreground">Please complete your business setup.</p>
        </div>
    )
  }

  const { metrics, schedule } = data;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        {/* Fixed unescaped entity */}
        <h2 className="text-3xl font-bold tracking-tight">Today&apos;s Overview</h2>
        <div className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              No-Shows
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.noShows}</div>
            <p className="text-xs text-muted-foreground">
              Missed appointments (Monthly)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
             {/* We can add a real count for unique customers later */}
            <div className="text-2xl font-bold">-</div> 
            <p className="text-xs text-muted-foreground">
              Total database
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Table */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {schedule.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                    No appointments scheduled for today.
                </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schedule.map((apt) => (
                    <TableRow key={apt.id}>
                        <TableCell className="font-medium">
                        {format(apt.time, "h:mm a")}
                        </TableCell>
                        <TableCell>{apt.customerName}</TableCell>
                        <TableCell>{apt.phone}</TableCell>
                        <TableCell>
                        <Badge
                            variant={
                            apt.status === "confirmed"
                                ? "default" // Black in shadcn default, looks clean
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
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
