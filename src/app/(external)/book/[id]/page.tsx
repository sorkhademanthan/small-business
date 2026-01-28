import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { addDays, setHours, setMinutes, format } from "date-fns";
import { RescheduleOptions } from "./_components/reschedule-options";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Fetch Appointment with Business details
  const appointment = await db.query.appointments.findFirst({
    where: eq(appointments.id, id),
    with: {
      business: true,
    },
  });

  if (!appointment) {
    return notFound();
  }

  // 2. Mock "Next Available Slots"
  const tomorrow = addDays(new Date(), 1);
  const dayAfter = addDays(new Date(), 2);

  const slots = [
    setMinutes(setHours(tomorrow, 10), 0),
    setMinutes(setHours(tomorrow, 14), 0),
    setMinutes(setHours(dayAfter, 11), 0),
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center">
          <h1 className="text-xl font-bold">{appointment.business.name}</h1>
          <p className="text-slate-400 text-sm">Reschedule Appointment</p>
        </div>

        {/* Current Details */}
        <div className="p-6 border-b bg-slate-50/50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Currently Scheduled
          </p>
          <div className="flex items-baseline gap-2">
             <p className="text-3xl font-bold text-slate-900">
                {format(new Date(appointment.startTime), "d MMM")}
             </p>
             <p className="text-xl text-slate-600">
                {format(new Date(appointment.startTime), "h:mm a")}
             </p>
          </div>
        </div>

        {/* Interactive Slots Component */}
        <div className="p-6">
          <RescheduleOptions 
            appointmentId={id} 
            slots={slots} 
          />
        </div>
      </div>
    </div>
  );
}

