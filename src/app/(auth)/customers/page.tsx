import { db } from '@/lib/db';
import { customers, businesses, appointments } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddCustomerDialog } from './_components/add-customer-dialog';

export default async function CustomersPage() {
  const user = await currentUser();
  if (!user) return redirect('/login');

  // 1. Get Business
  let business = await db.query.businesses.findFirst({
      where: eq(businesses.ownerId, user.id)
  });

  // DEV FALLBACK (same pattern)
  if (!business) {
      const all = await db.select().from(businesses).limit(1);
      if (all.length > 0) business = all[0];
  }

  if (!business) return <div>Please finish setup first.</div>;

  // 2. Get Customers with basic visit count logic
  // Note: Drizzle's relational queries are great, or we just do raw array fetch for MVP
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage your client database and history.
          </p>
        </div>
        <AddCustomerDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers ({customerList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerList.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No customers found. Add your first one!
                    </TableCell>
                </TableRow>
              ) : (
                 customerList.map((c) => (
                    <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.phone}</TableCell>
                        <TableCell>{c.email || '-'}</TableCell>
                        <TableCell>{c.createdAt?.toLocaleDateString()}</TableCell>
                    </TableRow>
                 ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
