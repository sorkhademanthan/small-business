'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { customers, businesses } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const addCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  email: z.string().email().optional().or(z.literal('')),
});

export async function addCustomer(item: unknown) {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const result = addCustomerSchema.safeParse(item);

  if (!result.success) {
    let errorMessage = '';
    result.error.issues.forEach((issue) => {
      errorMessage += issue.message + '. ';
    });
    return { success: false, error: errorMessage };
  }

  try {
    // 1. Find the business for this user
    let business = await db.query.businesses.findFirst({
        where: eq(businesses.ownerId, user.id)
    });

    // DEV FALLBACK: Just like in dashboard queries
    if (!business) {
        const all = await db.select().from(businesses).limit(1);
        if (all.length > 0) business = all[0];
    }
    
    if (!business) {
        return { success: false, error: 'No business found' };
    }

    // 2. Create customer
    await db.insert(customers).values({
        businessId: business.id,
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email || null,
    });

    revalidatePath('/customers');
    revalidatePath('/dashboard');
    return { success: true };

  } catch (e) {
    console.error(e);
    return { success: false, error: 'Database error' };
  }
}
