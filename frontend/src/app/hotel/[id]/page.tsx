"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Hotel, Room } from "@/lib/types";
import { formatPrice, getToken, getUser } from "@/lib/utils";

export default function HotelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    api<{ hotel: Hotel }>("/hotels/" + id)
      .then((d) => setHotel(d.hotel))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = (room: Room) => {
    const user = getUser();
    if (!user || !getToken()) {
      router.push("/login?redirect=/hotel/" + id);
      return;
    }
    const params = new URLSearchParams({
      hotelId: String(id),
      roomId: room.id,
      roomType: room.type,
      hotelName: hotel?.name || "",
      price: String(room.averagePrice || room.basePrice),
      checkin: checkin || new Date().toISOString().split("T")[0],
      checkout: checkout || new Date(Date.now() + 86400000).toISOString().split("T")[0],
      guests: String(guests),
    });
    router.push("/booking?" + params.toString());
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="h-80 bg-slate-800 rounded-2xl animate-shimmer" />
        <div className="h-8 w-1/2 bg-slate-800 rounded animate-shimmer" />
        <div className="h-4 w-1/3 bg-slate-800 rounded animate-shimmer" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Hotel not found</h2>
        <p className="text-slate-400">This hotel may no longer be available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="h-72 sm:h-96 rounded-2xl overflow-hidden">
          <img src={hotel.images[selectedImage]} alt={hotel.name} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {hotel.images.slice(0, 4).map((img, i) => (
            <div key={i} onClick={() => setSelectedImage(i)} className={"h-44 rounded-xl overflow-hidden cursor-pointer border-2 transition-all " + (i === selectedImage ? "border-indigo-500" : "border-transparent opacity-70 hover:opacity-100")}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">★ {hotel.rating}</span>
              <span className="text-slate-400 text-sm">{hotel.city}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{hotel.name}</h1>
            <p className="text-slate-400">{hotel.address}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">About</h3>
            <p className="text-slate-400 leading-relaxed">{hotel.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map(a => (
                <span key={a} className="bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-lg text-sm border border-slate-700/50">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Rooms */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Available Rooms</h3>
            <div className="space-y-4">
              {hotel.rooms.map((room) => (
                <div key={room.id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-white font-semibold text-lg">{room.type}</h4>
                    <p className="text-slate-400 text-sm">Up to {room.capacity} guests</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {room.amenities.slice(0, 4).map(a => (
                        <span key={a} className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-indigo-400 font-bold text-xl">{formatPrice(room.averagePrice || room.basePrice)}</div>
                    <div className="text-xs text-slate-500 mb-2">per night + taxes</div>
                    <button onClick={() => handleBook(room)} className="btn-primary !py-2 !px-6 text-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Booking */}
        <div>
          <div className="glass-card p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">Plan Your Stay</h3>
            <div className="space-y-3">
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
                <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="input-field text-sm">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>
            <div className="border-t border-slate-700/50 mt-4 pt-4">
              <div className="text-center text-slate-400 text-sm">
                Select a room above to book
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
