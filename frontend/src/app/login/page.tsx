"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { setToken, setUser } from "@/lib/utils";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api<{ user: { id: string; name: string; email: string; role: string }; token: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setToken(data.token);
      setUser(data.user);
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Log in to your Staylo account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-50">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Don&apos;t have an account? <Link href="/register" className="text-indigo-400 hover:text-indigo-300">Sign up</Link>
        </p>

        <div className="mt-6 border-t border-slate-700/50 pt-4">
          <p className="text-xs text-slate-500 text-center mb-2">Demo Accounts</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => { setEmail("guest@staylo.in"); setPassword("guest123"); }} className="btn-secondary !py-1.5 !px-2 !text-xs">Guest Login</button>
            <button onClick={() => { setEmail("partner@staylo.in"); setPassword("partner123"); }} className="btn-secondary !py-1.5 !px-2 !text-xs">Partner Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><div className="h-8 w-48 bg-slate-800 rounded animate-shimmer" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
