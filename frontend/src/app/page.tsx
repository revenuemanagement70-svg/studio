"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Hotel } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const POPULAR_CITIES = ["Mumbai", "Delhi", "Goa", "Jaipur", "Bangalore"];

const TRUST_STATS = [
  { num: "10K+", label: "Happy Guests" },
  { num: "500+", label: "Hotels" },
  { num: "50+", label: "Cities" },
  { num: "4.8", label: "Avg Rating" },
];

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("2");
  const [featured, setFeatured] = useState<Hotel[]>([]);

  useEffect(() => {
    api<{ hotels: Hotel[] }>("/hotels/featured")
      .then((d) => setFeatured(d.hotels))
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (guests) params.set("guests", guests);
    router.push("/search?" + params.toString());
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/60" />
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(79,70,229,0.3), transparent 60%), radial-gradient(circle at 75% 75%, rgba(168,85,247,0.2), transparent 60%)'}} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Your Perfect Stay
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Awaits You
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Discover India&apos;s finest hotels. From luxury suites in Mumbai to heritage havelis in Jaipur.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="glass-card max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-1">
                <label className="text-xs text-slate-400 mb-1 block">City</label>
                <select value={city} onChange={e => setCity(e.target.value)} className="input-field text-sm">
                  <option value="">All Cities</option>
                  {POPULAR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Check-in</label>
                <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} className="input-field text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Check-out</label>
                <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} className="input-field text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Guests</label>
                <select value={guests} onChange={e => setGuests(e.target.value)} className="input-field text-sm">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full text-sm !py-3">
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Popular Cities */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <span className="text-slate-500 text-sm mt-1">Popular:</span>
            {POPULAR_CITIES.map(c => (
              <Link key={c} href={"/search?city=" + c} className="px-4 py-1.5 rounded-full text-sm bg-slate-800/50 text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-300 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-16 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {TRUST_STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{s.num}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Featured Hotels</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Handpicked properties with exceptional ratings and service</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((hotel, i) => (
              <Link key={hotel.id} href={"/hotel/" + hotel.id} className="glass-card overflow-hidden group animate-fade-in-up" style={{animationDelay: i * 0.1 + 's'}}>
                <div className="h-48 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 relative overflow-hidden">
                  <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-amber-400 flex items-center gap-1">
                    <span>★</span> {hotel.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">{hotel.name}</h3>
                  <p className="text-slate-400 text-xs mb-3">{hotel.city}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-400 font-semibold text-sm">
                      {hotel.rooms?.[0] ? formatPrice(hotel.rooms[0].basePrice) : 'View'}{hotel.rooms?.[0] ? '/night' : ''}
                    </span>
                    <span className="text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {featured.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500">No featured hotels available. Start the backend and seed the database!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">List Your Property</h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Join India&apos;s fastest-growing hotel platform. Reach thousands of travelers and grow your business.
              </p>
              <Link href="/partner" className="btn-primary inline-block text-lg px-10 py-4">
                Become a Partner →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
