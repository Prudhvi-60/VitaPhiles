'use client';

import { SearchBar } from '@/components/search-bar';
import { books, movies } from '@/lib/mock-data';
import { useEffect, useState } from 'react';
import type { CatalogResult } from '@/services/catalog-types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [liveResults, setLiveResults] = useState<CatalogResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [stale, setStale] = useState(false);
  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get('query');
    if (initialQuery) setQuery(initialQuery);
  }, []);
  const normalizedQuery = query.trim().toLowerCase();
  const localResults: CatalogResult[] = [
    ...movies.map((movie) => ({ ...movie, kind: 'Movie' as const, href: `/movies/${movie.id}`, creator: movie.director, image: movie.poster })),
    ...books.map((book) => ({ ...book, kind: 'Book' as const, href: `/books/${book.id}`, creator: book.author, image: book.cover })),
  ].filter((result) => [result.title, result.creator, ...result.genres, ...result.mood, result.description].join(' ').toLowerCase().includes(normalizedQuery)).map((result) => ({ id: `${result.kind}-${result.id}`, kind: result.kind.toLowerCase() as 'movie' | 'book', title: result.title, creator: result.creator, year: result.year, description: result.description, image: result.image, rating: result.rating, provider: 'local' as const, externalId: String(result.id) }));

  useEffect(() => {
    if (query.trim().length < 2) {
      setLiveResults([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Search request failed');
        const data = (await response.json()) as { results: CatalogResult[]; stale: boolean };
        setLiveResults(data.results);
        setStale(data.stale);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLiveResults([]);
        setStale(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [query]);

  const results = query.trim().length >= 2 ? liveResults : localResults;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Search</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-[#f7f2eb]">One search for every story.</h1>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="Search movies, books, lists, people..." />

      {loading ? (
        <div className="mt-8 rounded-[24px] border border-white/10 bg-[#11161b] p-10 text-center text-[#b9b0a2]">Searching verified movie and book sources…</div>
      ) : results.length === 0 ? (
        <div className="mt-8 rounded-[24px] border border-dashed border-white/15 bg-[#11161b] p-10 text-center text-[#b9b0a2]">No verified stories matched “{query}”. Try a title, creator, ISBN, genre, or mood.</div>
      ) : (
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.map((result) => (
          <a key={`${result.provider}-${result.id}`} href={result.provider === 'local' ? `/${result.kind}s/${result.externalId}` : `/search?q=${encodeURIComponent(result.title)}`} className="rounded-[24px] border border-white/10 bg-[#11161b] p-4 transition hover:-translate-y-1 hover:border-[#d6b77a]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a]">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full border border-[#d6b77a]/30 bg-[#d6b77a]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-[#f7e7b9]">{result.kind} · {result.provider === 'local' ? 'local' : 'live'}</span>
              {result.rating ? <span className="text-sm text-[#d6b77a]">★ {result.rating.toFixed(1)}</span> : <span className="text-xs text-[#8f8779]">No rating</span>}
            </div>
            <div className="flex gap-4">
              <img src={result.image} alt={`${result.title} cover`} className="h-28 w-20 rounded-xl object-cover" />
              <div>
                <div className="text-xl font-semibold tracking-[-0.04em] text-[#f4efe9]">{result.title}</div>
                <div className="mt-1 text-sm text-[#bbaea2]">{result.creator}</div>
                <p className="mt-3 text-sm leading-6 text-[#c5bcae]">{result.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      )}
      {stale && query.trim().length >= 2 && <p className="mt-4 text-xs text-[#8f8779]">Some live sources were unavailable. Results shown may be incomplete.</p>}
    </main>
  );
}
