import { db } from "@/lib/db";
import { appointments, visits, customers } from "@/db/schema";
import { eq, and, gte, lt, inArray } from "drizzle-orm";
import { subDays } from "date-fns";

export async function getDashboardMetrics(businessId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const sixtyDaysAgo = subDays(new Date(), 60);

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

  // 2. Fetch Reviews
  const appointmentIds = recentAppointments.map((a) => a.id);
  
  let new_reviews = 0;

  if (appointmentIds.length > 0) {
    const recentVisits = await db
      .select({ rating: visits.rating })
      .from(visits)
      .where(inArray(visits.appointmentId, appointmentIds));

    new_reviews = recentVisits.filter((v) => v.rating !== null && v.rating >= 4).length;
  }

  // 3. Calculate Core Metrics
  const total_appointments = recentAppointments.length;
  const no_shows = recentAppointments.filter((a) => a.status === "noshow").length;
  const recovered = recentAppointments.filter(
    (a) => (a.status === "confirmed" || a.status === "completed") && a.reminderSent === true
  ).length;
  const revenue_saved = recovered * 1000;

  // 4. Win-Back Metrics
  const lapsedCustomers = await db
    .select({ id: customers.id })
    .from(customers)
    .where(
      and(
        eq(customers.businessId, businessId),
        lt(customers.lastVisitAt, sixtyDaysAgo)
      )
    );

  const resurrectedCustomers = await db
    .select({ id: customers.id })
    .from(customers)
    .where(
      and(
        eq(customers.businessId, businessId),
        gte(customers.lastWinbackSentAt, thirtyDaysAgo)
      )
    );

  return {
    total_appointments,
    no_shows,
    recovered,
    revenue_saved,
    new_reviews,
    lapsed_customers: lapsedCustomers.length,
    resurrected_this_month: resurrectedCustomers.length,
  };
}
