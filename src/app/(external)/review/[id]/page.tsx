import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ReviewForm } from "./_components/review-form";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Fetch data
  const appointment = await db.query.appointments.findFirst({
    where: eq(appointments.id, id),
    with: {
      business: true,
      customer: true
    },
  });

  if (!appointment) return notFound();

  // 2. Render the interactive form
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-8">
        <ReviewForm 
          appointmentId={id}
          businessName={appointment.business.name} 
          customerName={appointment.customer.name}
          // Fallback if they haven't set a link yet
          googleReviewLink={appointment.business.googleReviewLink || "https://google.com"} 
        />
      </div>
    </div>
  );
}
