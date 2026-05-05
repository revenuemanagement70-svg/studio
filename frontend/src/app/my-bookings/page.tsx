"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Booking } from "@/lib/types";
import { formatPrice, formatDate, getToken } from "@/lib/utils";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    api<{ bookings: Booking[] }>("/bookings/my", { token })
      .then((d) => setBookings(d.bookings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    const token = getToken();
    try {
      await api("/bookings/" + id + "/cancel", { method: "PATCH", token: token || "" });
      setBookings(b => b.map(booking => booking.id === id ? { ...booking, status: 'CANCELLED' } : booking));
    } catch {}
  };

  const statusColors: Record<string, string> = {
    CONFIRMED: "bg-green-500/20 text-green-400",
    PENDING: "bg-amber-500/20 text-amber-400",
    CANCELLED: "bg-red-500/20 text-red-400",
    COMPLETED: "bg-blue-500/20 text-blue-400",
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">My Bookings</h1>
        {[1,2,3].map(i => (
          <div key={i} className="glass-card p-6 mb-4">
            <div className="h-6 w-1/3 bg-slate-800 rounded animate-shimmer mb-2" />
            <div className="h-4 w-1/4 bg-slate-800 rounded animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-xl text-white font-semibold mb-2">No bookings yet</h3>
          <p className="text-slate-400 mb-6">Start exploring and book your perfect stay!</p>
          <Link href="/search" className="btn-primary">Browse Hotels</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold text-lg">{booking.hotelName}</h3>
                    <span className={"px-2.5 py-0.5 rounded-full text-xs font-medium " + (statusColors[booking.status] || "bg-slate-700 text-slate-300")}>{booking.status}</span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {booking.room?.type} · {formatDate(booking.checkin)} → {formatDate(booking.checkout)} · {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">Ref: {booking.bookingRef}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-indigo-400 font-bold text-lg">{formatPrice(booking.totalPrice + booking.taxes)}</div>
                  {booking.status === 'CONFIRMED' && (
                    <button onClick={() => handleCancel(booking.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
