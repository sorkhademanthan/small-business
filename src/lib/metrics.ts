import { db } from "@/lib/db";
import { appointments, visits } from "@/db/schema";
import { eq, and, gte, inArray } from "drizzle-orm";
import { subDays } from "date-fns";

export async function getDashboardMetrics(businessId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);

  // 1. Fetch Appointments for this business (Last 30 days)
  const recentAppointments = await db
    .select({
      id: appointments.id,
      status: appointments.status,
      reminderSent: appointments.reminderSent,
    })
    .from(appointments)
    .where(
      and(
        eq(appointments.businessId, businessId),
        gte(appointments.startTime, thirtyDaysAgo)
      )
    );

  // 2. Fetch Reviews linked to these appointments
  // We filter visits where the appointment ID is in the list of recent appointments
  const appointmentIds = recentAppointments.map((a) => a.id);
  
  let new_reviews = 0;

  if (appointmentIds.length > 0) {
    const recentVisits = await db
      .select({
        rating: visits.rating,
      })
      .from(visits)
      .where(inArray(visits.appointmentId, appointmentIds));

    // Filter for 4 or 5 stars
    new_reviews = recentVisits.filter((v) => v.rating !== null && v.rating >= 4).length;
  }

  // 3. Calculate Metrics
  const total_appointments = recentAppointments.length;
  
  const no_shows = recentAppointments.filter((a) => a.status === "noshow").length;

  // "Recovered" = Confirmed (or Completed) AND Reminder Sent
  // Logic: We reminded them, and they didn't cancel/no-show.
  const recovered = recentAppointments.filter(
    (a) => (a.status === "confirmed" || a.status === "completed") && a.reminderSent === true
  ).length;

  // "Revenue Saved" = Recovered * Avg Value (Assume 1000 INR per visit)
  const revenue_saved = recovered * 1000;

  return {
    total_appointments,
    no_shows,
    recovered,
    revenue_saved,
    new_reviews,
  };
}
