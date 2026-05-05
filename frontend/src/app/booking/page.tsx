"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { formatPrice, getToken, nightsBetween } from "@/lib/utils";

function BookingContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hotelName = params.get("hotelName") || "";
  const roomType = params.get("roomType") || "";
  const roomId = params.get("roomId") || "";
  const price = Number(params.get("price") || 0);
  const checkin = params.get("checkin") || "";
  const checkout = params.get("checkout") || "";
  const guests = Number(params.get("guests") || 2);

  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 1;
  const subtotal = price * nights;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + taxes;

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const booking = await api<{ booking: { id: string; bookingRef: string } }>("/bookings", {
        method: "POST",
        token: token || "",
        body: { roomId, checkin, checkout, guests },
      });
      router.push("/booking/confirmation?ref=" + booking.booking.bookingRef + "&id=" + booking.booking.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">Complete Your Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Booking Details */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Booking Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Hotel</span>
                <span className="text-white font-medium">{hotelName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Room Type</span>
                <span className="text-white">{roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Check-in</span>
                <span className="text-white">{checkin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Check-out</span>
                <span className="text-white">{checkout}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Guests</span>
                <span className="text-white">{guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration</span>
                <span className="text-white">{nights} night{nights > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">Price Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{formatPrice(price)} x {nights} night{nights > 1 ? 's' : ''}</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Taxes & fees (18% GST)</span>
                <span className="text-white">{formatPrice(taxes)}</span>
              </div>
              <div className="border-t border-slate-700/50 pt-3 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-indigo-400 font-bold text-xl">{formatPrice(total)}</span>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button onClick={handleConfirm} disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-50">
              {loading ? "Processing..." : "Confirm Booking"}
            </button>

            <p className="text-slate-500 text-xs mt-3 text-center">
              Free cancellation up to 24 hours before check-in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8"><div className="h-8 w-48 bg-slate-800 rounded animate-shimmer" /></div>}>
      <BookingContent />
    </Suspense>
  );
}
