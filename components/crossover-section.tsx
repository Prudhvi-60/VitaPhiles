'use client';

import Link from 'next/link';
import { BookOpen, Clapperboard } from 'lucide-react';

export type CrossoverPair = {
  id: string;
  title: string;
  book: {
    id: string;
    title: string;
    author: string;
    year?: number;
    cover: string;
    description: string;
  };
  movie: {
    id: string;
    title: string;
    director: string;
    year?: number;
    poster: string;
    description: string;
  };
  notes?: string;
};

export const sampleCrossoverPairs: CrossoverPair[] = [
  {
    id: 'dune-crossover',
    title: 'Dune: From Page to Screen',
    book: {
      id: '1',
      title: 'Dune',
      author: 'Frank Herbert',
      year: 1965,
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
      description: 'The definitive sci-fi masterpiece exploring desert power, religion, and ecology.',
    },
    movie: {
      id: '1',
      title: 'Dune: Part Two',
      director: 'Denis Villeneuve',
      year: 2024,
      poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
      description: 'Denis Villeneuve’s breathtaking cinematic adaptation of Arrakis and Paul Atreides.',
    },
    notes: 'A rare adaptation that honors the intricate world-building of the source novel.',
  },
  {
    id: 'gatsby-crossover',
    title: 'The Great Gatsby: Literary & Cinematic Romance',
    book: {
      id: '2',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      year: 1925,
      cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
      description: 'An intoxicating glimpse into glamour, longing, and American desire.',
    },
    movie: {
      id: '4',
      title: 'La La Land',
      director: 'Damien Chazelle',
      year: 2016,
      poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      description: 'A contemporary cinematic companion piece on dreamers, passion, and longing.',
    },
    notes: 'Shared thematic DNA exploring longing, ambition, and nostalgia.',
  },
];

export function CrossoverSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Cross-medium connections</div>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#f7f2eb]">
          Page ↔ Screen Crossovers
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[#b9b0a2]">
          Discover books adapted into memorable cinema, and movies born from literary classics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sampleCrossoverPairs.map((pair) => (
          <div
            key={pair.id}
            className="overflow-hidden rounded-[26px] border border-white/10 bg-[#11161b] p-5 transition hover:border-[#d6b77a]/40"
          >
            <div className="mb-4 text-xs font-semibold text-[#d6b77a]">{pair.title}</div>

            <div className="grid grid-cols-2 gap-4">
              {/* Book Column */}
              <Link href={`/books/${pair.book.id}`} className="group flex flex-col gap-2 rounded-2xl bg-white/[0.03] p-3 transition hover:bg-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-[#d6b77a]">
                  <BookOpen className="h-3.5 w-3.5" /> Book
                </div>
                <img src={pair.book.cover} alt={pair.book.title} className="h-32 w-full rounded-xl object-cover" />
                <div className="font-semibold text-sm text-[#f5efe7] group-hover:text-[#d6b77a]">{pair.book.title}</div>
                <div className="text-xs text-[#b9b0a2]">{pair.book.author}</div>
              </Link>

              {/* Movie Column */}
              <Link href={`/movies/${pair.movie.id}`} className="group flex flex-col gap-2 rounded-2xl bg-white/[0.03] p-3 transition hover:bg-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-[#d6b77a]">
                  <Clapperboard className="h-3.5 w-3.5" /> Movie
                </div>
                <img src={pair.movie.poster} alt={pair.movie.title} className="h-32 w-full rounded-xl object-cover" />
                <div className="font-semibold text-sm text-[#f5efe7] group-hover:text-[#d6b77a]">{pair.movie.title}</div>
                <div className="text-xs text-[#b9b0a2]">{pair.movie.director}</div>
              </Link>
            </div>

            {pair.notes && (
              <p className="mt-4 text-xs leading-5 text-[#8f8779] border-t border-white/5 pt-3">
                {pair.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
