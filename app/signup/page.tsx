'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      router.push('/profile');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during account creation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[85vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-[30px] border border-white/10 bg-[#11161b] p-6 sm:p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d6b77a]/50 bg-[#d6b77a]/10 text-lg font-bold text-[#f5efe7]">
            V
          </div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Join the community</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#f7f2eb]">Create your VitaPhiles profile</h1>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-[#b9b0a2]">Full Name</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-[#f5efe7] focus-within:border-[#d6b77a]/60">
              <User className="h-4 w-4 text-[#8f8779]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Vance"
                required
                className="w-full bg-transparent text-sm text-[#f5efe7] placeholder:text-[#6e675b] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-[#b9b0a2]">Username</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-[#f5efe7] focus-within:border-[#d6b77a]/60">
              <User className="h-4 w-4 text-[#8f8779]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="jordanvance"
                required
                className="w-full bg-transparent text-sm text-[#f5efe7] placeholder:text-[#6e675b] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-[#b9b0a2]">Email Address</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-[#f5efe7] focus-within:border-[#d6b77a]/60">
              <Mail className="h-4 w-4 text-[#8f8779]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@example.com"
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
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full bg-transparent text-sm text-[#f5efe7] placeholder:text-[#6e675b] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d6b77a] py-3 text-sm font-semibold text-[#111318] transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#b9b0a2]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#d6b77a] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
