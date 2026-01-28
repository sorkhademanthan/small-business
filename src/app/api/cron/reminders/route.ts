import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appointments, customers, businesses } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { addHours, addMinutes, format } from 'date-fns';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function GET() {
  console.log('⏳ Cron Job Started: Checking for appointments in 24h...');

  try {
    const now = new Date();
    // Define the window: Appointments starting between 24h and 25h from now
    const startWindow = addHours(now, 24);
    const endWindow = addMinutes(startWindow, 60);

    // 1. Query DB for upcoming confirmed appointments
    const upcomingAppointments = await db
      .select({
        id: appointments.id,
        startTime: appointments.startTime,
        customerName: customers.name,
        customerPhone: customers.phone,
        businessName: businesses.name,
      })
      .from(appointments)
      .innerJoin(customers, eq(appointments.customerId, customers.id))
      .innerJoin(businesses, eq(appointments.businessId, businesses.id))
      .where(
        and(
          eq(appointments.status, 'confirmed'),
          eq(appointments.reminderSent, false), // Only those not yet reminded
          gte(appointments.startTime, startWindow),
          lte(appointments.startTime, endWindow)
        )
      );

    if (upcomingAppointments.length === 0) {
      return NextResponse.json({ success: true, message: 'No appointments to remind.' });
    }

    // 2. Loop and Send Messages
    const results = await Promise.all(
      upcomingAppointments.map(async (apt) => {
        const formattedTime = format(apt.startTime, 'h:mm a');
        const rescheduleLink = `${process.env.NEXT_PUBLIC_APP_URL}/book/${apt.id}`;

        // Send WhatsApp - Using hello_world as fallback
        const response = await sendWhatsAppMessage(
          apt.customerPhone,
          'hello_world', // Generic template (no variables)
          [], // No parameters needed
          apt.id // Idempotency key
        );

        if (response.success) {
          // 3. Update DB to mark reminder as sent
          await db
            .update(appointments)
            .set({ reminderSent: true })
            .where(eq(appointments.id, apt.id));
          return { id: apt.id, status: 'sent' };
        } else {
          console.error(`Failed to send to ${apt.id}:`, response.error);
          return { id: apt.id, status: 'failed', error: response.error };
        }
      })
    );

    return NextResponse.json({
      success: true,
      processed: results.length,
      details: results,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Cron Job Failed:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
      success: true,
      processed: results.length,
      details: results,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Cron Job Failed:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
