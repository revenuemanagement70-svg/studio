"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { setToken, setUser } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("GUEST");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api<{ user: { id: string; name: string; email: string; role: string }; token: string }>("/auth/register", {
        method: "POST",
        body: { name, email, password, role },
      });
      setToken(data.token);
      setUser(data.user);
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400 text-sm">Join Staylo and start booking</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="John Doe" required />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="Min 6 characters" required minLength={6} />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Account Type</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="input-field">
              <option value="GUEST">Guest — Book hotels</option>
              <option value="PARTNER">Partner — List your property</option>
            </select>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Log in</Link>
        </p>
      </div>
    </div>
  );
}
