'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, Hotel, PlusCircle, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';

function AdminSidebar() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/properties', label: 'Properties', icon: Hotel },
    { href: '/admin/properties/add', label: 'Add Property', icon: PlusCircle },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return null; // Or a loading skeleton
  }

  if (!user) {
    return (
        <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">You need to be logged in to access the admin panel.</p>
            <Button asChild className="w-full">
                <Link href="/login?redirect=/admin">Login</Link>
            </Button>
        </div>
    );
  }

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
                isActive={pathname === item.href}
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
        <Button asChild variant="ghost">
            <Link href="/">
                <LogOut className="size-5" />
                <span>Back to Site</span>
            </Link>
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
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main className="p-4 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
