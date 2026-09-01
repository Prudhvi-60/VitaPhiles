'use client';

import { SearchBar } from '@/components/search-bar';
import Link from 'next/link';
import { SectionHeader } from '@/components/section-header';
import { MediaCard } from '@/components/media-card';
import { books, movies, moods } from '@/lib/mock-data';

export default function DiscoverPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-12 rounded-[30px] border border-[#d6b77a]/20 bg-[linear-gradient(135deg,rgba(141,47,61,0.12),rgba(17,19,24,0.86),rgba(214,183,122,0.08))] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#d6b77a]">Discovery</div>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-[-0.06em] text-[#f7f2eb] md:text-5xl">Find your next obsession.</h1>
          </div>
          <div className="w-full max-w-xl">
            <SearchBar value="" onChange={() => undefined} placeholder="Search Dune, Gatsby, sci-fi, dark romance..." />
          </div>
        </div>
      </div>

      <section className="mb-12">
        <SectionHeader eyebrow="Trending now" title="Stories everyone is talking about" action={<Link href="/search" className="rounded-full border border-white/10 px-4 py-2 text-sm text-[#f2eee8] transition hover:border-[#d6b77a]/50 hover:text-[#d6b77a]">Explore catalog</Link>} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {movies.map((movie) => (
            <MediaCard
              key={movie.id}
              title={movie.title}
              subtitle={`${movie.year} • ${movie.genres[0]}`}
              description={movie.description}
              image={movie.poster}
              rating={movie.rating}
              href="/movies"
            />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader eyebrow="Hidden gems" title="Underrated, unforgettable, worth the detour" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {books.map((book) => (
            <MediaCard
              key={book.id}
              title={book.title}
              subtitle={`${book.author} • ${book.year}`}
              description={book.description}
              image={book.cover}
              rating={book.rating}
              href="/books"
            />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader eyebrow="Mood discovery" title="Choose the feeling you want next" />
        <div className="flex flex-wrap gap-3">
          {moods.map((mood) => (
            <Link key={mood} href={`/search?query=${encodeURIComponent(mood)}`} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#f3efe7] transition hover:border-[#d6b77a]/50 hover:text-[#d6b77a]">
              {mood}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
