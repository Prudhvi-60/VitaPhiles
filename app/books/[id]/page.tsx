import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Star } from 'lucide-react';
import { books } from '@/lib/mock-data';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ShelfActionButton } from '@/components/shelf-action-button';
import { DetailReviewSection } from '@/components/detail-review-section';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const localBook = books.find((entry) => String(entry.id) === id);
  return {
    title: localBook ? `${localBook.title} — VitaPhiles` : 'Book Details — VitaPhiles',
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  let book: {
    id?: string;
    externalId: string;
    title: string;
    author: string;
    year?: number;
    description: string;
    cover: string;
    rating: number;
    genres: string[];
    mood: string[];
  } | null = null;

  // 1. Check DB first
  const dbItem = await db.mediaItem.findFirst({
    where: {
      kind: 'book',
      OR: [{ id }, { externalId: id }],
    },
    include: {
      ratings: true,
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, username: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (dbItem) {
    let parsedGenres: string[] = [];
    let parsedMood: string[] = [];
    try { parsedGenres = JSON.parse(dbItem.genres); } catch { parsedGenres = []; }
    try { parsedMood = JSON.parse(dbItem.mood); } catch { parsedMood = []; }

    book = {
      id: dbItem.id,
      externalId: dbItem.externalId || dbItem.id,
      title: dbItem.title,
      author: dbItem.creator,
      year: dbItem.year || undefined,
      description: dbItem.description,
      cover: dbItem.image || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
      rating: dbItem.averageRating || 4.7,
      genres: parsedGenres.length > 0 ? parsedGenres : ['Literature'],
      mood: parsedMood.length > 0 ? parsedMood : ['Thought-provoking'],
    };
  } else {
    // 2. Check local mock data
    const local = books.find((b) => String(b.id) === id);
    if (local) {
      book = {
        externalId: String(local.id),
        title: local.title,
        author: local.author,
        year: local.year,
        description: local.description,
        cover: local.cover,
        rating: local.rating,
        genres: local.genres,
        mood: local.mood,
      };
    }
  }

  if (!book) notFound();

  // Find user's current shelf status for this book if authenticated
  let userStatus: string | null = null;
  if (user && dbItem) {
    const userLib = await db.userLibrary.findFirst({
      where: { userId: user.id, mediaItemId: dbItem.id },
    });
    if (userLib) userStatus = userLib.status;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/books"
        className="mb-8 inline-flex items-center gap-2 text-sm text-[#b9b0a2] transition hover:text-[#d6b77a]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to books
      </Link>

      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#11161b]">
        <div className="grid gap-8 p-5 md:grid-cols-[280px_1fr] md:p-8">
          <img
            src={book.cover}
            alt={`${book.title} cover`}
            className="aspect-[3/4] w-full rounded-[22px] object-cover shadow-2xl"
          />
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">
              <BookOpen className="h-4 w-4" /> Book profile
            </div>
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#f7f2eb] md:text-6xl">
              {book.title}
            </h1>
            <p className="mt-3 text-[#b9b0a2]">
              {book.year ? `${book.year} · ` : ''}{book.author}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {book.genres.map((genre) => (
                <span key={genre} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#d8d0c4]">
                  {genre}
                </span>
              ))}
            </div>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d2c8b9]">{book.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d6b77a]/30 bg-[#d6b77a]/10 px-4 py-2.5 text-[#f7e7b9]">
                <Star className="h-4 w-4 fill-current" /> {book.rating.toFixed(1)} rating
              </div>

              <ShelfActionButton
                kind="book"
                mediaItemId={book.id}
                externalId={book.externalId}
                title={book.title}
                creator={book.author}
                year={book.year}
                description={book.description}
                image={book.cover}
                genres={book.genres}
                initialStatus={userStatus}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 border-t border-white/10 bg-[#0d1117] p-5 sm:grid-cols-3 md:p-8">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-[#d6b77a]">Mood</div>
            <div className="mt-2 text-sm text-[#d4cabc]">{book.mood.join(' · ')}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-[#d6b77a]">Your status</div>
            <div className="mt-2 text-sm text-[#d4cabc]">
              {userStatus ? userStatus.replace(/_/g, ' ').toUpperCase() : 'Not on shelf'}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-[#d6b77a]">Cinematic Adaptation</div>
            <Link href="/movies/1" className="mt-2 inline-block text-sm text-[#f5efe7] hover:text-[#d6b77a]">
              Watch Dune: Part Two →
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews & Ratings Section */}
      <DetailReviewSection
        mediaItemId={book.id || ''}
        title={book.title}
        existingReviews={dbItem?.reviews || []}
      />
    </main>
  );
}
