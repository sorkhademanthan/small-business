import { db } from '@/lib/db';
import { customers, businesses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CustomersTable } from './_components/customers-table'; 

export default async function CustomersPage() {
  const user = await currentUser();
  if (!user) return redirect('/login');

  // 1. Get Business
  let business = await db.query.businesses.findFirst({
      where: eq(businesses.ownerId, user.id)
  });

  if (!business) {
      const all = await db.select().from(businesses).limit(1);
      if (all.length > 0) business = all[0];
  }

  if (!business) return <div className="p-8 text-center text-muted-foreground">Please finish setup first.</div>;

  // 2. Get Customers
  const customerList = await db
    .select({
        id: customers.id,
        name: customers.name,
        phone: customers.phone,
        email: customers.email,
        createdAt: customers.createdAt
    })
    .from(customers)
    .where(eq(customers.businessId, business.id))
    .orderBy(desc(customers.createdAt));

  // 3. Render Client Component
  // Filter out customers with null createdAt to satisfy the type requirement
  return <CustomersTable data={customerList.filter((c): c is typeof c & { createdAt: Date } => c.createdAt !== null)} />;
}