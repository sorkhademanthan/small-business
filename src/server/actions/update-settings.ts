'use server';

import { db } from '@/lib/db';
import { businesses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const settingsSchema = z.object({
  googleReviewLink: z.string().url().or(z.literal('')),
});

export async function updateSettings(formData: FormData) {
  const user = await currentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const rawLink = formData.get('googleReviewLink') as string;
  const result = settingsSchema.safeParse({ googleReviewLink: rawLink });

  if (!result.success) {
    return { success: false, error: "Invalid URL format" };
  }

  try {
    // 1. Find business
    const business = await db.query.businesses.findFirst({
        where: eq(businesses.ownerId, user.id)
    });

    if (!business) return { success: false, error: "Business not found" };

    // 2. Update
    await db.update(businesses)
      .set({ googleReviewLink: result.data.googleReviewLink })
      .where(eq(businesses.id, business.id));

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error("Settings Update Error:", error);
    return { success: false, error: "Database error" };
  }
}
