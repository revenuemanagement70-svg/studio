
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
import { useRouter, usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const [isVerified, setIsVerified] = React.useState(false);

  React.useEffect(() => {
    // WORKAROUND: Bypass login for development.
    setIsVerified(true);
    return;

    // // If auth state is still loading, do nothing.
    // if (loading) return;
    
    // // If the user is on the login page, we don't need to do any checks.
    // if (pathname === '/admin/login') {
    //   setIsVerified(true);
    //   return;
    // }

    // // If there's no user, redirect to login.
    // if (!user) {
    //   router.replace('/admin/login');
    //   return;
    // }
    
    // // If there is a user, check for the admin claim.
    // user.getIdTokenResult().then(idTokenResult => {
    //   const isAdminClaim = !!idTokenResult.claims.admin;
    //   if (isAdminClaim) {
    //     setIsVerified(true);
    //   } else {
    //     // If not an admin, redirect to login.
    //     router.replace('/admin/login');
    //   }
    // });

  }, [user, loading, router, pathname]);

  // While we're checking, show a loading spinner.
  if (!isVerified) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="animate-spin size-8 text-primary" />
        </div>
    );
  }

  // If on the login page, just render children without the admin sidebar.
  if (pathname === '/admin/login') {
      return <>{children}</>;
  }

  // If verified and not on the login page, show the admin dashboard with sidebar.
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main className="p-4 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
