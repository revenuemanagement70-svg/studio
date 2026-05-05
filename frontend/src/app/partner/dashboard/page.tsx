"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Hotel, Booking } from "@/lib/types";
import { formatPrice, formatDate, getToken } from "@/lib/utils";

export default function PartnerDashboardPage() {
  const [listings, setListings] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    Promise.all([
      api<{ listings: Hotel[] }>("/partners/listings", { token }).catch(() => ({ listings: [] })),
      api<{ bookings: Booking[] }>("/partners/bookings", { token }).catch(() => ({ bookings: [] })),
    ]).then(([l, b]) => {
      setListings(l.listings);
      setBookings(b.bookings);
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = bookings.filter(b => b.status !== 'CANCELLED').reduce((sum, b) => sum + b.totalPrice + b.taxes, 0);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Partner Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1,2,3].map(i => <div key={i} className="glass-card p-6"><div className="h-8 w-1/2 bg-slate-800 rounded animate-shimmer" /></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Partner Dashboard</h1>
        <Link href="/partner/onboard" className="btn-primary text-sm">+ Add Property</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6">
          <p className="text-slate-400 text-sm">Total Properties</p>
          <p className="text-3xl font-bold text-white">{listings.length}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-slate-400 text-sm">Total Bookings</p>
          <p className="text-3xl font-bold text-white">{bookings.length}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-slate-400 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-indigo-400">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Properties */}
      <h2 className="text-xl font-semibold text-white mb-4">Your Properties</h2>
      {listings.length === 0 ? (
        <div className="glass-card p-8 text-center mb-8">
          <p className="text-slate-400 mb-4">No properties listed yet.</p>
          <Link href="/partner/onboard" className="btn-primary text-sm">List Your First Property</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {listings.map(hotel => (
            <div key={hotel.id} className="glass-card p-5">
              <h3 className="text-white font-semibold mb-1">{hotel.name}</h3>
              <p className="text-slate-400 text-sm">{hotel.city} · {hotel.rooms?.length || 0} room types</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-amber-400">★ {hotel.rating}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Bookings */}
      <h2 className="text-xl font-semibold text-white mb-4">Recent Bookings</h2>
      {bookings.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-slate-400">No bookings yet. Share your listings to start receiving bookings!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.slice(0, 10).map(booking => (
            <div key={booking.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-white font-medium">{booking.hotelName}</p>
                <p className="text-slate-400 text-sm">{formatDate(booking.checkin)} → {formatDate(booking.checkout)} · {booking.guests} guests</p>
              </div>
              <div className="text-right">
                <p className="text-indigo-400 font-semibold">{formatPrice(booking.totalPrice + booking.taxes)}</p>
                <p className="text-xs text-slate-500">{booking.bookingRef}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
