"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUser, getToken, removeToken, removeUser } from "@/lib/utils";

export default function Header() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    removeToken();
    removeUser();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 glass-card !rounded-none border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              S
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Staylo
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Search Hotels
            </Link>
            <Link href="/partner" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Partner With Us
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/my-bookings" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                  My Bookings
                </Link>
                {user.role === 'PARTNER' && (
                  <Link href="/partner/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-indigo-400">{user.name}</span>
                  <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-red-400 transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="btn-secondary !py-2 !px-5 text-sm">
                  Login
                </Link>
                <Link href="/register" className="btn-primary !py-2 !px-5 text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button className="md:hidden text-slate-300 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700/50 flex flex-col gap-3">
            <Link href="/search" className="text-slate-300 hover:text-white py-2 text-sm">Search Hotels</Link>
            <Link href="/partner" className="text-slate-300 hover:text-white py-2 text-sm">Partner With Us</Link>
            {user ? (
              <>
                <Link href="/my-bookings" className="text-slate-300 hover:text-white py-2 text-sm">My Bookings</Link>
                <button onClick={handleLogout} className="text-left text-red-400 py-2 text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-300 hover:text-white py-2 text-sm">Login</Link>
                <Link href="/register" className="text-indigo-400 hover:text-indigo-300 py-2 text-sm font-medium">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
