"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ConfirmationContent() {
  const params = useSearchParams();
  const bookingRef = params.get("ref") || "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="glass-card p-10 sm:p-16">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
        <p className="text-slate-400 mb-6">Your reservation has been successfully made.</p>

        <div className="bg-slate-800/50 rounded-xl p-6 mb-8 inline-block">
          <p className="text-slate-400 text-sm mb-1">Booking Reference</p>
          <p className="text-2xl font-bold text-indigo-400 tracking-wider">{bookingRef}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/my-bookings" className="btn-primary">
            View My Bookings
          </Link>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-16"><div className="h-8 w-48 mx-auto bg-slate-800 rounded animate-shimmer" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
