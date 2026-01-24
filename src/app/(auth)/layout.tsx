'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Settings, 
  Menu,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', href: '/calendar', icon: CalendarDays },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const NavContent = ({ 
  pathname, 
  onLinkClick 
}: { 
  pathname: string; 
  onLinkClick?: () => void; 
}) => (
  <div className="flex flex-col h-full bg-white border-r border-slate-200">
    <div className="p-6 flex items-center gap-2 border-b border-slate-100">
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
        <Sparkles className="w-5 h-5" />
      </div>
      <span className="font-bold text-xl tracking-tight text-slate-900">ReBook</span>
    </div>
    
    <nav className="flex-1 px-3 py-6 space-y-1">
      {sidebarLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
              isActive 
                ? "bg-slate-100 text-slate-900 shadow-sm ring-1 ring-slate-200" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
            {link.name}
          </Link>
        );
      })}
    </nav>
    
    <div className="p-4 border-t border-slate-100">
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-xs font-medium text-slate-900 mb-1">Need help?</p>
        <p className="text-xs text-slate-500 mb-3">Contact our support team.</p>
        <Button variant="outline" size="sm" className="w-full text-xs h-8 bg-white" asChild>
          <a href="mailto:support@rebook.com">Support</a>
        </Button>
      </div>
    </div>
  </div>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-50">
        <NavContent pathname={pathname} />
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="flex items-center gap-4 md:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="w-6 h-6 text-slate-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-0">
                 <NavContent pathname={pathname} onLinkClick={() => setIsMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="font-bold text-lg">ReBook</span>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
             <div className="text-sm text-right hidden sm:block">
                <p className="font-medium text-slate-900">{user?.fullName || 'User'}</p>
                <p className="text-xs text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p>
             </div>
             <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page Content with Background Pattern */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
