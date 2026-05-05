"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Hotel, SearchResult } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

function SearchContent() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    params.set("page", String(pagination.page));
    params.set("limit", "12");

    setLoading(true);
    api<SearchResult>("/hotels/search?" + params.toString())
      .then((d) => {
        setHotels(d.hotels);
        setPagination(d.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [city, pagination.page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {city ? "Hotels in " + city : "All Hotels"}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{pagination.total} properties found</p>
        </div>
        <div className="flex gap-3">
          <select value={city} onChange={e => { setCity(e.target.value); setPagination(p => ({...p, page: 1})); }} className="input-field !w-auto text-sm">
            <option value="">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Goa">Goa</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Bangalore">Bangalore</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field !w-auto text-sm">
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card overflow-hidden">
              <div className="h-52 bg-slate-800 animate-shimmer" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-slate-800 rounded animate-shimmer" />
                <div className="h-4 w-1/2 bg-slate-800 rounded animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : hotels.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => {
              const minPrice = hotel.rooms?.length > 0
                ? Math.min(...hotel.rooms.map(r => r.basePrice))
                : 0;
              return (
                <Link key={hotel.id} href={"/hotel/" + hotel.id} className="glass-card overflow-hidden group">
                  <div className="h-52 bg-gradient-to-br from-indigo-900/40 to-purple-900/30 relative overflow-hidden">
                    <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-sm font-medium text-amber-400 flex items-center gap-1">
                      <span>★</span> {hotel.rating}
                    </div>
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {hotel.amenities.slice(0, 3).map(a => (
                        <span key={a} className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-indigo-300 transition-colors">{hotel.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">{hotel.city} · {hotel.rooms?.length || 0} room types</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <div>
                        <span className="text-xs text-slate-500">Starting from</span>
                        <div className="text-indigo-400 font-bold text-lg">{minPrice > 0 ? formatPrice(minPrice) : 'View'}<span className="text-xs text-slate-500 font-normal">/night</span></div>
                      </div>
                      <span className="btn-primary !py-2 !px-4 text-sm">View Details</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPagination(prev => ({...prev, page: p}))}
                  className={"px-4 py-2 rounded-lg text-sm font-medium transition-all " + (p === pagination.page ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏨</div>
          <h3 className="text-xl text-white font-semibold mb-2">No hotels found</h3>
          <p className="text-slate-400">Try adjusting your filters or search for a different city.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="h-8 w-48 bg-slate-800 rounded animate-shimmer" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
