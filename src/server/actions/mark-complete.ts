'use server';

import { db } from '@/lib/db';
import { appointments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { revalidatePath } from 'next/cache';

export async function markAppointmentComplete(appointmentId: string) {
  try {
    // 1. Update status to 'completed'
    // Returns the updated row so we can access businessId/customerId immediately
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ status: 'completed' })
      .where(eq(appointments.id, appointmentId))
      .returning();

    if (!updatedAppointment) {
      return { success: false, error: 'Appointment not found' };
    }

    // 2. Fetch Customer and Business details for the message
    const appointmentDetails = await db.query.appointments.findFirst({
        where: eq(appointments.id, appointmentId),
        with: {
            customer: true,
            business: true
        }
    });

    if (!appointmentDetails) return { success: false, error: 'Details not found' };

    const { customer, business } = appointmentDetails;
    
    // 3. Construct the Smart Review Link
    const reviewLink = `${process.env.NEXT_PUBLIC_APP_URL}/review/${appointmentId}`;

    // 4. Send WhatsApp
    const response = await sendWhatsAppMessage(
        customer.phone,
        'review_request_v1',
        [
            {
                type: 'body',
                parameters: [
                    { type: 'text', text: customer.name }, // {{1}}
                    { type: 'text', text: business.name }, // {{2}}
                    { type: 'text', text: reviewLink },    // {{3}}
                ]
            }
        ]
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