import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers, businesses } from '@/db/schema';
import { eq, and, lt, or, isNull } from 'drizzle-orm';
import { subDays } from 'date-fns';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function GET() {
  console.log('🔄 Win-Back Cron Started: Finding lapsed customers...');

  try {
    const now = new Date();
    const lapsedDate = subDays(now, 60);
    const cooldownDate = subDays(now, 30);

    const lapsedCustomers = await db
      .select({
        id: customers.id,
        name: customers.name,
        phone: customers.phone,
        businessId: customers.businessId,
      })
      .from(customers)
      .where(
        and(
          eq(customers.marketingOptIn, true),
          lt(customers.lastVisitAt, lapsedDate),
          or(
            isNull(customers.lastWinbackSentAt),
            lt(customers.lastWinbackSentAt, cooldownDate)
          )
        )
      );

    if (lapsedCustomers.length === 0) {
      return NextResponse.json({ success: true, message: 'No lapsed customers found.' });
    }

    console.log(`Found ${lapsedCustomers.length} lapsed customers.`);

    const results = await Promise.all(
      lapsedCustomers.map(async (customer) => {
        const business = await db.query.businesses.findFirst({
          where: eq(businesses.id, customer.businessId),
        });

        if (!business) return { id: customer.id, status: 'skipped', reason: 'No business' };

        const response = await sendWhatsAppMessage(
          customer.phone,
          'hello_world',
          []
        );

        if (response.success) {
          await db
            .update(customers)
            .set({ lastWinbackSentAt: new Date() })
            .where(eq(customers.id, customer.id));

          return { id: customer.id, name: customer.name, status: 'sent' };
        } else {
          return { id: customer.id, status: 'failed', error: response.error };
        }
      })
    );

    const sentCount = results.filter(r => r.status === 'sent').length;

    return NextResponse.json({
      success: true,
      resurrected_count: sentCount,
      details: results,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Win-Back Cron Failed:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
