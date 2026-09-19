'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Search } from 'lucide-react';

type UserSession = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
} | null;

export function SiteHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0d10]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6b77a]/50 bg-[#d6b77a]/10 text-sm font-semibold text-[#f5efe7]">
              V
            </div>
            <div className="text-sm font-medium uppercase tracking-[0.28em] text-[#f7e8c7]">
              VitaPhiles
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-[#e7dfd0] md:flex" aria-label="Primary navigation">
            {[
              ['Discover', '/discover'],
              ['Movies', '/movies'],
              ['Books', '/books'],
              ['Library', '/library'],
              ['Lists', '/lists'],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="transition hover:text-[#d6b77a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0d10]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#f5efe7] transition hover:border-[#d6b77a]/50 hover:text-[#d6b77a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a]"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>

          {!loading && user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-[#d6b77a]/40 bg-[#d6b77a]/10 px-3 py-1.5 text-sm text-[#f7e7b9] transition hover:bg-[#d6b77a]/20"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d6b77a] text-[10px] font-bold text-[#111318]">
                  {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline font-medium">{user.name}</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#8f8779] transition hover:border-rose-500/40 hover:text-rose-400"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : !loading ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-xs font-medium text-[#c9c0ad] hover:text-[#f5efe7]"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[#d6b77a] px-4 py-2 text-xs font-semibold text-[#111318] transition hover:brightness-110"
              >
                Get Started
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <nav
        className="mx-auto flex max-w-7xl gap-2 overflow-x-auto border-t border-white/5 px-4 py-2 text-xs text-[#c9c0ad] md:hidden"
        aria-label="Mobile navigation"
      >
        {[
          ['Discover', '/discover'],
          ['Movies', '/movies'],
          ['Books', '/books'],
          ['Library', '/library'],
          ['Lists', '/lists'],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="whitespace-nowrap rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-[#d6b77a]"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
