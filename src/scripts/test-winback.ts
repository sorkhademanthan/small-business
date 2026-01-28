import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { subDays } from 'date-fns';

async function main() {
  console.log('🧪 Setting up Win-Back test data...');

  // Set first customer's last visit to 90 days ago
  const ninetyDaysAgo = subDays(new Date(), 90);

  const [updated] = await db
    .update(customers)
    .set({ 
      lastVisitAt: ninetyDaysAgo,
      lastWinbackSentAt: null, // Reset so they can be messaged
      marketingOptIn: true 
    })
    .returning();

  if (updated) {
    console.log(`✅ Customer "${updated.name}" marked as lapsed (last visit: ${ninetyDaysAgo.toLocaleDateString()})`);
    console.log('\n👉 Now visit: http://localhost:3000/api/cron/winback');
  } else {
    console.log('❌ No customers found to update');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
