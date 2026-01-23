import Link from 'next/link';
import { Button } from "@/components/ui/button"; 

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 bg-background">
      <h1 className="text-5xl font-extrabold tracking-tight text-foreground">ReBook 📅</h1>
      <p className="text-xl text-muted-foreground text-center max-w-lg">
        The &quot;Set-and-Forget&quot; Growth Engine for Local Service Businesses.
      </p>
      
      <div className="flex gap-4 mt-4">
        <Button asChild size="lg">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
     