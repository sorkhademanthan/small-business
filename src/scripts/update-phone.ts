import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';

const REAL_PHONE_NUMBER = '918454898626'; // <--- REPLACE THIS WITH YOUR REAL NUMBER (Format: CountryCode+Number, no + symbol)

async function main() {
  console.log(`📱 Updating customer phone to: ${REAL_PHONE_NUMBER}...`);

  // Update all customers to have your real number for testing
  await db.update(customers).set({
    phone: REAL_PHONE_NUMBER
  });

  console.log('✅ Phone numbers updated. Ready to test.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
