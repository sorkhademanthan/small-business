"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rescheduleAppointment } from "@/server/actions/reschedule";
import { cn } from "@/lib/utils";

interface RescheduleOptionsProps {
  appointmentId: string;
  slots: Date[];
}

export function RescheduleOptions({
  appointmentId,
  slots,
}: RescheduleOptionsProps) {
  const [loading, setLoading] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSlotClick = async (date: Date, index: number) => {
    setLoading(index);

    const res = await rescheduleAppointment(appointmentId, date);

    if (res.success) {
      setSuccess(true);
      setLoading(null);
    } else {
      alert("Something went wrong. Please call the business.");
      setLoading(null);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">All Set!</h3>
        <p className="text-slate-600 mt-2">
          Your appointment has been successfully updated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-slate-900">Select a new time:</p>
      <div className="grid gap-3">
        {slots.map((date, idx) => (
          <Button
            key={idx}
            variant="outline"
            className={cn(
              "justify-start h-auto py-4 px-4 border-slate-200 hover:border-slate-900 hover:bg-white transition-all",
              loading === idx && "opacity-70"
            )}
            disabled={loading !== null}
            onClick={() => handleSlotClick(date, idx)}
          >
            {loading === idx ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin text-slate-400" />
            ) : (
              <div className="w-5 h-5 mr-3 rounded-full border-2 border-slate-300" />
            )}
            <div className="text-left">
              <div className="font-semibold text-slate-900">
                {format(date, "EEEE, MMMM d")}
              </div>
              <div className="text-sm text-slate-500">
                {format(date, "h:mm a")}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
           