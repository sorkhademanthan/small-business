import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { businesses, appointments } from '@/db/schema';
import { eq, and, gte, inArray } from 'drizzle-orm';
import { subDays } from 'date-fns';

export async function GET() {
  console.log('📊 Starting Weekly Report Job...');

  try {
    const sevenDaysAgo = subDays(new Date(), 7);

    // 1. Fetch all businesses
    // In a real app, you might chunk this if you have thousands of users
    const allBusinesses = await db.select().from(businesses);

    const reportResults = [];

    // 2. Loop through each business and calculate stats
    for (const business of allBusinesses) {
      const recoveredAppointments = await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.businessId, business.id),
            gte(appointments.startTime, sevenDaysAgo),
            eq(appointments.reminderSent, true),
            inArray(appointments.status, ['confirmed', 'completed'])
          )
        );

      const recoveredCount = recoveredAppointments.length;
      const revenueSaved = recoveredCount * 1000; // Assuming ₹1000 per slot

      // 3. Send "Email" (Simulated)
      if (recoveredCount > 0) {
        console.log(`
        ----------------------------------------------------
        📧 EMAIL SENT to: ${business.name} (Owner: ${business.ownerId})
        Subject: You saved ₹${revenueSaved} this week!
        
        Body:
        Hi Team ${business.name},
        
        ReBook prevented ${recoveredCount} potential no-shows this week.
        That represents approximately ₹${revenueSaved} in protected revenue.
        
        Keep up the great work!
        - The ReBook Team
        ----------------------------------------------------
        `);
        
        reportResults.push({ business: business.name, saved: revenueSaved });
      }
    }

    return NextResponse.json({ 
      success: true, 
      reports_generated: reportResults.length, 
      details: reportResults 
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Weekly Report Failed:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
