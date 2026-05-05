"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getToken, getUser } from "@/lib/utils";

export default function OnboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", city: "", address: "", description: "",
    images: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    amenities: "Wi-Fi, AC, Pool, Restaurant",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = getUser();
    const token = getToken();
    if (!user || !token) { router.push("/login"); return; }
    if (user.role !== 'PARTNER' && user.role !== 'ADMIN') {
      setError("Only Partner accounts can list properties. Register as a Partner.");
      return;
    }

    setLoading(true); setError("");
    try {
      await api("/partners/onboard", {
        method: "POST",
        token,
        body: {
          name: form.name,
          city: form.city,
          address: form.address,
          description: form.description,
          images: form.images.split(",").map(s => s.trim()),
          amenities: form.amenities.split(",").map(s => s.trim()),
          rooms: [
            { type: "Standard", capacity: 2, basePrice: 2500, totalRooms: 10, amenities: ["Wi-Fi", "AC", "TV"] },
            { type: "Deluxe", capacity: 3, basePrice: 4500, totalRooms: 5, amenities: ["Wi-Fi", "AC", "TV", "Mini Bar"] },
          ],
        },
      });
      router.push("/partner/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit listing");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">List Your Property</h1>
      <p className="text-slate-400 mb-8">Fill in the details below to submit your hotel listing.</p>

      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-4">
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Hotel Name</label>
          <input value={form.name} onChange={e => update("name", e.target.value)} className="input-field" required minLength={2} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">City</label>
            <input value={form.city} onChange={e => update("city", e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Address</label>
            <input value={form.address} onChange={e => update("address", e.target.value)} className="input-field" required minLength={5} />
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Description</label>
          <textarea value={form.description} onChange={e => update("description", e.target.value)} className="input-field !h-24 resize-none" required minLength={10} />
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Image URLs (comma-separated)</label>
          <input value={form.images} onChange={e => update("images", e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Amenities (comma-separated)</label>
          <input value={form.amenities} onChange={e => update("amenities", e.target.value)} className="input-field" />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Listing"}
        </button>
      </form>
    </div>
  );
}
