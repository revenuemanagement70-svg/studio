
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
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
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
  const { user, loading } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [checking, setChecking] = React.useState(true);
  
  React.useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/admin/login');
      return;
    }

    user.getIdTokenResult().then(idTokenResult => {
      const isAdminClaim = !!idTokenResult.claims.admin;
      setIsAdmin(isAdminClaim);
      setChecking(false);
      if (!isAdminClaim) {
        router.replace('/admin/login');
      }
    });

  }, [user, loading, router]);


  if (loading || checking || !isAdmin) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="animate-spin size-8 text-primary" />
        </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main className="p-4 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
