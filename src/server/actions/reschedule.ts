'use server';

import { db } from '@/lib/db';
import { appointments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function rescheduleAppointment(appointmentId: string, newTime: Date) {
  try {
    // 1. Update the appointment
    await db
      .update(appointments)
      .set({
        startTime: newTime,
        status: 'confirmed',
        reminderSent: false, // Reset reminder so they get a new one for the new time
      })
      .where(eq(appointments.id, appointmentId));

    // 2. Revalidate cache
    revalidatePath(`/book/${appointmentId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error("Reschedule Error:", error);
    return { success: false, error: 'Failed to update appointment' };
  }
}
