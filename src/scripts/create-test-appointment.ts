import { db } from '@/lib/db';
import { appointments, customers } from '@/db/schema';
import { addHours, addMinutes } from 'date-fns';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🧪 Creating test data for Cron Job...');

  // 1. Get the first business
  const business = await db.query.businesses.findFirst();
  if (!business) throw new Error("No business found. Run db-setup.sh first.");

  // 2. Get a customer (should now have your real phone from update-phone.ts)
  const customer = await db.query.customers.findFirst({
    where: eq(customers.businessId, business.id)
  });
  if (!customer) throw new Error("No customer found.");

  console.log(`📱 Customer phone in DB: ${customer.phone}`);

  // 3. Create an appointment exactly 24 hours + 30 mins from now
  const futureDate = addMinutes(addHours(new Date(), 24), 30);

  const [newApt] = await db.insert(appointments).values({
    businessId: business.id,
    customerId: customer.id,
    startTime: futureDate,
    status: 'confirmed',
    reminderSent: false
  }).returning();

  console.log('✅ Appointment Created!');
  console.log(`ID: ${newApt.id}`);
  console.log(`Time: ${futureDate.toLocaleString()}`);
  console.log('\n👉 Now go to: http://localhost:3000/api/cron/reminders');
  
  process.exit(0);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
  