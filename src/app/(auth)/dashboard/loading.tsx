import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Top Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium"><Skeleton className="h-4 w-24" /></CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle Row: Chart & Schedule */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-3 md:col-span-2">
            <CardHeader>
                <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[300px] w-full rounded-xl" />
            </CardContent>
        </Card>

        <Card className="col-span-3 md:col-span-1">
            <CardHeader>
                <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                         <div key={i} className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-6 w-16 rounded-full" />
                         </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
