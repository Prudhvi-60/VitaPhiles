'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MediaCard } from '@/components/media-card';
import { SearchBar } from '@/components/search-bar';
import { SectionHeader } from '@/components/section-header';
import { movies } from '@/lib/mock-data';

export default function MoviesPage() {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredMovies = movies.filter((movie) =>
    [movie.title, movie.director, ...movie.genres, ...movie.mood, movie.description]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#d6b77a]">Movies</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-[#f7f2eb]">Browse the cinematic archive.</h1>
        </div>
        <div className="w-full max-w-xl">
          <SearchBar value={query} onChange={setQuery} placeholder="Search for movies, directors, moods..." />
        </div>
      </div>

      <SectionHeader eyebrow="Popular picks" title="Farmed from your favorites and the community" action={<Link href="/search" className="rounded-full border border-white/10 px-4 py-2 text-sm text-[#f2eee8] transition hover:border-[#d6b77a]/50 hover:text-[#d6b77a]">Search catalog</Link>} />

      {filteredMovies.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-white/15 bg-[#11161b] p-8 text-center text-[#b9b0a2]">No movies matched “{query}”. Try a title, director, genre, or mood.</div>
      ) : (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {filteredMovies.map((movie) => (
          <MediaCard
            key={movie.id}
            title={movie.title}
            subtitle={`${movie.year} • ${movie.director}`}
            description={movie.description}
            image={movie.poster}
            rating={movie.rating}
            href={`/movies/${movie.id}`}
          />
        ))}
      </div>
      )}
    </main>
  );
}
