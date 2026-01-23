import { db } from '@/lib/db';
import { businesses, customers, appointments, visits } from '@/db/schema';
import { addHours, subDays } from 'date-fns';

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // 1. Clear existing data (in reverse order of dependencies)
    console.log('Cleaning up old data...');
    await db.delete(visits);
    await db.delete(appointments);
    await db.delete(customers);
    await db.delete(businesses);

    // 2. Create Business
    console.log('Creating Business...');
    const [business] = await db.insert(businesses).values({
      name: 'Gold Gym',
      ownerId: 'user_2s_placeholder', // Replace with your actual Clerk User ID later for testing
      timezone: 'Asia/Kolkata',
    }).returning();

    console.log(`Created business: ${business.name} (ID: ${business.id})`);

    // 3. Create Customers
    console.log('Creating Customers...');
    const [customer1] = await db.insert(customers).values({
      businessId: business.id,
      name: 'Rahul Sharma',
      phone: '+919876543210',
      email: 'rahul@example.com',
    }).returning();

    const [customer2] = await db.insert(customers).values({
      businessId: business.id,
      name: 'Priya Singh',
      phone: '+919988776655',
      email: 'priya@example.com',
    }).returning();

    // 4. Create Appointments
    console.log('Creating Appointments...');
    const now = new Date();

    await db.insert(appointments).values([
      {
        businessId: business.id,
        customerId: customer1.id,
        startTime: addHours(now, 2), // Today + 2h
        status: 'confirmed',
      },
      {
        businessId: business.id,
        customerId: customer2.id,
        startTime: addHours(now, 24), // Tomorrow
        status: 'confirmed',
      },
      {
        businessId: business.id,
        customerId: customer1.id,
        startTime: subDays(now, 1), // Yesterday (No Show)
        status: 'noshow',
      },
    ]);

    console.log('✅ Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
