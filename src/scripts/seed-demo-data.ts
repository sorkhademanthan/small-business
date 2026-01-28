import { db } from '@/lib/db';
import { businesses, customers, appointments } from '@/db/schema';
import { addDays, setHours } from 'date-fns';

async function main() {
  console.log('🌱 Seeding demo data...');

  // Create demo business
  const [demoBiz] = await db.insert(businesses).values({
    ownerId: 'demo_user_id', // Replace with your Clerk user ID
    name: 'Elite Fitness Club',
    googleReviewLink: 'https://g.page/r/demo',
    timezone: 'Asia/Kolkata',
  }).returning();

  // Create 5 demo customers
  const customerNames = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh'];
  
  for (const name of customerNames) {
    const [customer] = await db.insert(customers).values({
      businessId: demoBiz.id,
      name,
      phone: '919876543210',
      lastVisitAt: addDays(new Date(), -Math.random() * 30),
    }).returning();

    // Create appointment for tomorrow
    await db.insert(appointments).values({
      businessId: demoBiz.id,
      customerId: customer.id,
      startTime: setHours(addDays(new Date(), 1), 10 + Math.floor(Math.random() * 8)),
      status: Math.random() > 0.5 ? 'confirmed' : 'noshow',
      reminderSent: false,
    });
  }

  console.log('✅ Demo data created!');
  process.exit(0);
}

main();
