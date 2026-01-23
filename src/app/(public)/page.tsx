import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 bg-white">
      <h1 className="text-4xl font-bold tracking-tight">ReBook 📅</h1>
      <p className="text-xl text-slate-600">
        The &quot;Set-and-Forget&quot; Growth Engine for Local Business.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          Login
        </Link>
        <Link 
          href="/signup" 
          className="rounded-md border border-slate-200 px-6 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
