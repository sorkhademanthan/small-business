'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { businesses } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const createBusinessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export async function createBusiness(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const result = createBusinessSchema.safeParse({ name });

  if (!result.success) {
    return { error: 'Invalid name' };
  }

  try {
    await db.insert(businesses).values({
      ownerId: user.id,
      name: name,
      timezone: 'UTC', // Default for now
    });
  } catch (error) {
    console.error('Failed to create business:', error);
    return { error: 'Database error' };
  }

  // Redirect to dashboard after success
  redirect('/dashboard');
}
