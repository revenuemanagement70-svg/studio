
'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, Hotel, PlusCircle, Settings, LogOut, Book, BedDouble, CalendarCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

function AdminSidebar() {
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <Home /> },
    { href: '/admin/properties', label: 'Properties', icon: <Hotel /> },
    { href: '/admin/bookings', label: 'Bookings', icon: <BedDouble /> },
    { href: '/admin/availability', label: 'Availability', icon: <CalendarCheck /> },
    { href: '/admin/finance', label: 'Finance', icon: <TrendingUp /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings /> },
  ];

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Link href="/admin" className="text-2xl font-black gradient-text font-headline">
                Staylo
            </Link>
            <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md">Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  {React.cloneElement(item.icon, { className: 'size-5' })}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/">
                <LogOut className="size-5" />
                <span>Back to Site</span>
            </Link>
        </Button>
         <Button onClick={handleLogout} variant="ghost" className="w-full justify-start">
             <LogOut className="size-5" />
             <span>Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If on the login page, just render children without the admin sidebar.
  if (pathname === '/admin/login') {
      return <>{children}</>;
  }

  // WORKAROUND: Login is bypassed for development.
  // The original authentication logic has been removed.
  // To re-enable it, please ask me to "secure the admin dashboard".
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main className="p-4 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
