'use server';

import { db } from '@/lib/db';
import { appointments, customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { revalidatePath } from 'next/cache';

export async function markAppointmentComplete(appointmentId: string) {
  try {
    // 1. Update status to 'completed'
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ status: 'completed' })
      .where(eq(appointments.id, appointmentId))
      .returning();

    if (!updatedAppointment) {
      return { success: false, error: 'Appointment not found' };
    }

    // 2. Fetch Customer and Business details
    const appointmentDetails = await db.query.appointments.findFirst({
        where: eq(appointments.id, appointmentId),
        with: {
            customer: true,
            business: true
        }
    });

    if (!appointmentDetails) return { success: false, error: 'Details not found' };

    const { customer, business } = appointmentDetails;

    // --- NEW: Update Customer's Last Visit Date ---
    await db
      .update(customers)
      .set({ lastVisitAt: new Date() })
      .where(eq(customers.id, customer.id));
    
    // 3. Construct the Smart Review Link
    const reviewLink = `${process.env.NEXT_PUBLIC_APP_URL}/review/${appointmentId}`;

    // 4. Send WhatsApp - Using hello_world template
    const response = await sendWhatsAppMessage(
        customer.phone,
        'hello_world', // Generic template
        [],
        appointmentId // Idempotency key
    );

    if (!response.success) {
        console.error("Failed to send review request:", response.error);
    }

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    console.error('Error marking complete:', error);
    return { success: false, error: 'Server error' };
  }
}