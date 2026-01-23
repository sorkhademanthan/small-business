import { db } from '@/lib/db';
import { appointments, customers, businesses } from '@/db/schema';
import { eq, and, sql, gte, lt } from 'drizzle-orm';
import { startOfDay, endOfDay } from 'date-fns';

export async function getDashboardStats(identifier: string) {
  // 1. Get Business ID
  let business = await db.query.businesses.findFirst({
    where: eq(businesses.ownerId, identifier),
  });

  // FALLBACK FOR DEV: If no business found for current user, use the first one in DB
  // This allows the Seed Data to be visible immediately without complex onboarding
  if (!business) {
    const allBusinesses = await db.select().from(businesses).limit(1);
    if (allBusinesses.length > 0) {
        business = allBusinesses[0];
    }
  }

  if (!business) throw new Error('Business not found');

  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  // 2. Fetch Today's Schedule
  const todaysAppointments = await db
    .select({
      id: appointments.id,
      customerName: customers.name,
      time: appointments.startTime,
      status: appointments.status,
      phone: customers.phone,
    })
    .from(appointments)
    .innerJoin(customers, eq(appointments.customerId, customers.id))
    .where(
      and(
        eq(appointments.businessId, business.id),
        gte(appointments.startTime, startOfToday),
        lt(appointments.startTime, endOfToday)
      )
    )
    .orderBy(appointments.startTime);

  // 3. Calculate Stats (Revenue at Risk vs Recovered)
  // Logic: "Revenue at Risk" = upcoming appointments * avg value (assume $50)
  // "No-Shows" = status 'noshow' in last 30 days
  
  const stats = await db
    .select({
      totalAppointments: sql<number>`count(*)`,
      noShows: sql<number>`sum(case when ${appointments.status} = 'noshow' then 1 else 0 end)`,
    })
    .from(appointments)
    .where(eq(appointments.businessId, business.id));

  return {
    businessName: business.name,
    schedule: todaysAppointments,
    metrics: {
        totalAppointments: stats[0]?.totalAppointments || 0,
        noShows: stats[0]?.noShows || 0,
        // Mocking revenue for now as we don't have a 'price' column yet
        revenueAtRisk: todaysAppointments.length * 50, 
    }
  };
}
