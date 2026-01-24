import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Advanced Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Deep dive into your business performance.
        </p>
      </div>

      <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-slate-400" />
        </div>
        <CardHeader>
          <CardTitle>Detailed Reports Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground max-w-sm">
         Your core ROI and &quot;Revenue Saved&quot; metrics are available on your main Dashboard.
        </CardContent>
      </Card>
    </div>
  );
}
