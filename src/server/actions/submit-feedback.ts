'use server';

import { db } from '@/lib/db';
import { visits } from '@/db/schema';

export async function submitPrivateFeedback(appointmentId: string, rating: number, comment: string) {
  try {
    // Save query to database
    await db.insert(visits).values({
        appointmentId,
        rating,
        feedback: comment
    });

    console.log(`📝 Private Feedback Saved: ${rating} stars - "${comment}"`);
    
    return { success: true };
  } catch (error) {
    console.error("Feedback Submission Error:", error);
    return { success: false, error: 'Database error' };
  }
}
