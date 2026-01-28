import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">Calendar</h3>
        <p className="text-sm text-muted-foreground">
          View your monthly schedule at a glance.
        </p>
      </div>
      
      <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <CalendarDays className="w-8 h-8 text-slate-400" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle>Coming Soon in v2</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground max-w-sm">
          For now, please manage individual appointments via the Dashboard or your Google Calendar integration.
        </CardContent>
      </Card>
    </div>
  );
}
