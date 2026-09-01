import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Bookmark, Star } from 'lucide-react';
import { books } from '@/lib/mock-data';

export function generateStaticParams() {
  return books.map((book) => ({ id: String(book.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = books.find((entry) => entry.id === Number(id));
  return { title: book ? `${book.title} — VitaPhiles` : 'Book not found — VitaPhiles', description: book?.description };
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = books.find((entry) => entry.id === Number(id));
  if (!book) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/books" className="mb-8 inline-flex items-center gap-2 text-sm text-[#b9b0a2] transition hover:text-[#d6b77a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a]"><ArrowLeft className="h-4 w-4" /> Back to books</Link>
      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#11161b]">
        <div className="grid gap-8 p-5 md:grid-cols-[280px_1fr] md:p-8">
          <Image src={book.cover} alt={`${book.title} cover`} width={900} height={1200} priority className="aspect-[3/4] w-full rounded-[22px] object-cover" />
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]"><BookOpen className="h-4 w-4" /> Book profile</div>
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#f7f2eb] md:text-6xl">{book.title}</h1>
            <p className="mt-3 text-[#b9b0a2]">{book.year} · {book.author}</p>
            <div className="mt-5 flex flex-wrap gap-2">{book.genres.map((genre) => <span key={genre} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#d8d0c4]">{genre}</span>)}</div>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d2c8b9]">{book.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d6b77a]/30 bg-[#d6b77a]/10 px-4 py-2 text-[#f7e7b9]"><Star className="h-4 w-4 fill-current" /> {book.rating.toFixed(1)} community rating</div>
              <Link href="/library" className="inline-flex items-center gap-2 rounded-full bg-[#d6b77a] px-4 py-2 text-sm font-semibold text-[#111318] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a]"><Bookmark className="h-4 w-4" /> Open your library</Link>
            </div>
          </div>
        </div>
        <div className="grid gap-5 border-t border-white/10 bg-[#0d1117] p-5 sm:grid-cols-3 md:p-8">
          <div><div className="text-[10px] uppercase tracking-[0.24em] text-[#d6b77a]">Mood</div><div className="mt-2 text-sm text-[#d4cabc]">{book.mood.join(' · ')}</div></div>
          <div><div className="text-[10px] uppercase tracking-[0.24em] text-[#d6b77a]">Your status</div><div className="mt-2 text-sm text-[#d4cabc]">Not logged yet</div></div>
          <div><div className="text-[10px] uppercase tracking-[0.24em] text-[#d6b77a]">Watch next</div><Link href="/movies/1" className="mt-2 inline-block text-sm text-[#f5efe7] hover:text-[#d6b77a]">Watch Dune: Part Two →</Link></div>
        </div>
      </section>
    </main>
  );
}
