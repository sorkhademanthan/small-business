'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Settings, 
  Menu 
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

// Defined outside to prevent re-creation on render
const NavContent = ({ 
  pathname, 
  onLinkClick 
}: { 
  pathname: string; 
  onLinkClick?: () => void; 
}) => (
  <div className="flex flex-col h-full bg-slate-900 text-white">
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight text-white">ReBook</h1>
    </div>
    <nav className="flex-1 px-4 space-y-2">
      {sidebarLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
              isActive 
                ? "bg-slate-800 text-white" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
          >
            <Icon className="w-5 h-5" />
            {link.name}
          </Link>
        );
      })}
    </nav>
    <div className="p-4 border-t border-slate-800">
      <p className="text-xs text-slate-500">© 2024 ReBook Inc.</p>
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

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <NavContent pathname={pathname} />
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 border-b bg-white shadow-sm">
          <div className="flex items-center gap-4 md:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-0">
                 <NavContent pathname={pathname} onLinkClick={() => setIsMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="font-bold text-lg">ReBook</span>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
             <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
