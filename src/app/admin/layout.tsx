
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
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';

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
  const router = useRouter();
  const { user, loading } = useUser();
  const [isVerified, setIsVerified] = React.useState(false);

  React.useEffect(() => {
    if (loading) {
      return; // Wait for the user state to be determined
    }

    if (!user) {
      // If there's no user and they aren't on the login page, redirect them.
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
      // If they are on the login page, we don't need to do anything.
      // We also don't set isVerified to true here.
      return;
    }
    
    // If there is a user, check if they are an admin.
    user.getIdTokenResult()
      .then((idTokenResult) => {
        const isAdminClaim = !!idTokenResult.claims.admin;
        if (isAdminClaim) {
          setIsVerified(true);
          // If a verified admin is on the login page, redirect them to the dashboard.
          if (pathname === '/admin/login') {
            router.replace('/admin');
          }
        } else {
          // If not an admin, redirect to login.
          router.replace('/admin/login');
        }
      })
      .catch(() => {
        // If there's an error getting the token, redirect to login.
        router.replace('/admin/login');
      });

  }, [user, loading, pathname, router]);

  // While loading user state or if user is null (and we're not on login page), show loader.
  // We also want to show the loader until verification is complete.
  if (loading || (!isVerified && pathname !== '/admin/login')) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  // If the user is on the login page, just show the content (the login form).
  if (pathname === '/admin/login') {
    return <main className="flex min-h-screen items-center justify-center p-4 bg-secondary/30">{children}</main>;
  }

  // If verified, show the admin layout.
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main className="p-4 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
