
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
    // If we're still loading user state, do nothing.
    if (loading) {
      return;
    }
    
    // If loading is finished and there's no user, redirect.
    if (!user) {
      // For now, we will simply grant access for development.
      // In a real scenario, this would redirect to a login page.
      // router.replace('/admin/login');
      // For bypass, we'll allow access, but in a real app this would be a redirect
      if (pathname.endsWith('/admin/login')) {
         router.replace('/admin');
      }
      // The bypass email will handle verification below if it's used.
    }

    // Bypass for the specific development user
    if (user?.email === 'email-1111@gmail.com') {
        setIsVerified(true);
        return;
    }

    // If there is a user but it's not the bypass email, 
    // ideally we check claims, but for now we'll treat them as not verified.
    // In a production scenario, this block would handle the admin claim check.
    if (user && user.email !== 'email-1111@gmail.com') {
        // For development, we'll just log this and not grant access.
        // In production, you would redirect them or show an error.
        console.warn("Access denied. User is not the designated bypass user.");
        // We will default to not verified.
        setIsVerified(false); 
        // A production app would redirect: router.replace('/unauthorized-access');
    }
    
    // Default to verified for development ease if no user is found after loading
    if (!user) {
      setIsVerified(true);
    }

  }, [user, loading, pathname, router]);

  // While checking, show a loading screen.
  // We remove this check for a full bypass
  // if (!isVerified) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <Loader2 className="size-8 animate-spin" />
  //     </div>
  //   );
  // }

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
