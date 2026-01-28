'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { businesses } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const createBusinessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  google_review_link: z.string().url().optional().or(z.literal('')),
  timezone: z.string().default('UTC'),
});

export async function createBusiness(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    return { error: 'Unauthorized - please sign in' };
  }

  const rawData = {
    name: formData.get('name') as string,
    google_review_link: formData.get('google_review_link') as string || '',
    timezone: formData.get('timezone') as string || 'UTC',
  };

  const result = createBusinessSchema.safeParse(rawData);

  if (!result.success) {
    // FIX: Use .issues instead of .errors
    return { error: result.error.issues[0].message };
  }

  try {
    // Insert the new business
    await db.insert(businesses).values({
      ownerId: user.id,
      name: result.data.name,
      googleReviewLink: result.data.google_review_link || null,
      timezone: result.data.timezone,
    });
  } catch (error) {
    console.error('Business creation error:', error);
    return { error: 'Failed to create business. Please try again.' };
  }

  // FIX: redirect() throws a special error that Next.js catches
  // We must NOT wrap it in try-catch, place it outside
  redirect('/dashboard');
}
