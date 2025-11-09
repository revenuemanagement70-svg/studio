'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, Home, Star, Map, Tags, Phone, LogOut, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';

const navLinks = [
  { href: '#home', label: 'Home', icon: <Home /> },
  { href: '#features', label: 'Features', icon: <Star /> },
  { href: '#destinations', label: 'Destinations', icon: <Map /> },
  { href: '#offers', label: 'Offers', icon: <Tags /> },
  { href: '#contact', label: 'Contact', icon: <Phone /> },
];

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, loading } = useUser();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setMobileMenuOpen(false);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm transition-all duration-300',
        scrolled ? 'py-2 shadow-lg' : 'py-4'
      )}
      role="navigation"
      aria-label="Main"
    >
      <div className="container mx-auto flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-black gradient-text font-headline">
            Staylo
          </Link>
          <div className="hidden text-sm text-muted-foreground md:block">
            Call: <a href="tel:+919899308683" className="font-bold text-primary hover:underline">+91-98993-08683</a>
          </div>
        </div>

        <nav className="hidden lg:flex">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">
                  {React.cloneElement(link.icon, { className: 'size-4' })}
                  {link.label}
                </Link>
              </li>
            ))}
             {user && (
              <li>
                <Link href="/favorites" className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">
                  <Heart className="size-4" />
                  My Favorites
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2">
            {loading ? null : user ? (
              <Button onClick={handleLogout} variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary rounded-md">
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary rounded-md">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-primary to-accent text-white font-bold rounded-md">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-background p-0">
                <SheetHeader className="p-6">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <div className="flex justify-between items-center border-b pb-4">
                        <Link href="/" className="text-2xl font-black gradient-text font-headline" onClick={() => setMobileMenuOpen(false)}>
                            Staylo
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                            <X className="size-6" />
                        </Button>
                    </div>
                </SheetHeader>
                <div className="flex flex-col h-full p-6 pt-0">
                    <nav className="mt-8 flex-grow">
                        <ul className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-foreground hover:text-primary transition-colors">
                                {React.cloneElement(link.icon, { className: 'size-5' })}
                                {link.label}
                                </Link>
                            </li>
                        ))}
                        {user && (
                            <li>
                                <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-semibold text-foreground hover:text-primary transition-colors">
                                    <Heart className="size-5" />
                                    My Favorites
                                </Link>
                            </li>
                        )}
                        </ul>
                    </nav>
                    <div className="mt-auto border-t pt-6 flex flex-col gap-4">
                      {loading ? null : user ? (
                        <Button onClick={handleLogout} variant="outline" className="w-full border-primary text-primary rounded-md">
                          <LogOut className="size-4 mr-2" />
                          Logout
                        </Button>
                      ) : (
                        <>
                          <Button asChild variant="outline" className="w-full border-primary text-primary rounded-md">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                          </Button>
                          <Button asChild className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold rounded-md">
                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                          </Button>
                        </>
                      )}
                        <a href="tel:+919899308683" className="text-center font-bold text-primary hover:underline mt-2">Call +91-98993-08683</a>
                    </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
