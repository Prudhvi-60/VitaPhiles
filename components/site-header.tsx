import Link from 'next/link';
import { Search, UserRound } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0d10]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6b77a]/50 bg-[#d6b77a]/10 text-sm font-semibold text-[#f5efe7]">V</div>
            <div className="text-sm font-medium uppercase tracking-[0.28em] text-[#f7e8c7]">VitaPhiles</div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-[#e7dfd0] md:flex" aria-label="Primary navigation">
            {[
              ['Discover', '/discover'],
              ['Movies', '/movies'],
              ['Books', '/books'],
              ['Library', '/library'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-[#d6b77a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0d10]">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/search" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#f5efe7] transition hover:border-[#d6b77a]/50 hover:text-[#d6b77a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a]" aria-label="Search">
            <Search className="h-4 w-4" />
          </Link>
          <Link href="/profile" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#f5efe7] transition hover:border-[#d6b77a]/50 hover:text-[#d6b77a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a]">
            <UserRound className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto border-t border-white/5 px-4 py-2 text-xs text-[#c9c0ad] md:hidden" aria-label="Mobile navigation">
        {[
          ['Discover', '/discover'],
          ['Movies', '/movies'],
          ['Books', '/books'],
          ['Library', '/library'],
        ].map(([label, href]) => (
          <Link key={href} href={href} className="whitespace-nowrap rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-[#d6b77a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a]">
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
