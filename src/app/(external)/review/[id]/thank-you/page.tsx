import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const appointment = await db.query.appointments.findFirst({
    where: eq(appointments.id, id),
    with: {
      customer: true,
      business: true,
    },
  });

  if (!appointment) return notFound();

  const referralCode = appointment.customer.phone.replace(/[^0-9]/g, '');
  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/ref/${referralCode}`;
  const whatsappText = `Hey! I just visited ${appointment.business.name} and loved it. Use my link to get 10% off your first visit: ${referralLink}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Thanks for your review!</CardTitle>
          <CardDescription>
            Your feedback helps local businesses grow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-100 p-6 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2 text-lg">🎁 Gift for you &amp; a friend</h3>
            <p className="text-sm text-slate-600 mb-4">
              Invite a friend to <strong>{appointment.business.name}</strong>. They get 10% off, and you get 10% off your next visit!
            </p>
            <Input value={referralLink} readOnly className="bg-white text-center text-xs" />
          </div>

          <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-12 text-lg">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Share2 className="w-5 h-5 mr-2" />
              Share on WhatsApp
            </a>
          </Button>
          
          <p className="text-xs text-slate-400">
            Clicking share opens WhatsApp with a pre-written message.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}