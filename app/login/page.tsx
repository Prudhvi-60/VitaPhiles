'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      router.push('/profile');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-[30px] border border-white/10 bg-[#11161b] p-6 sm:p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d6b77a]/50 bg-[#d6b77a]/10 text-lg font-bold text-[#f5efe7]">
            V
          </div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Welcome back</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#f7f2eb]">Sign in to VitaPhiles</h1>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-[#b9b0a2]">Username or Email</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-[#f5efe7] focus-within:border-[#d6b77a]/60">
              <User className="h-4 w-4 text-[#8f8779]" />
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="jordan or jordan@vitaphiles.com"
                required
                className="w-full bg-transparent text-sm text-[#f5efe7] placeholder:text-[#6e675b] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-[#b9b0a2]">Password</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-[#f5efe7] focus-within:border-[#d6b77a]/60">
              <Lock className="h-4 w-4 text-[#8f8779]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-transparent text-sm text-[#f5efe7] placeholder:text-[#6e675b] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d6b77a] py-3 text-sm font-semibold text-[#111318] transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#b9b0a2]">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-[#d6b77a] hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}
