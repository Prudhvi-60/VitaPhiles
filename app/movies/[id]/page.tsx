import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clapperboard, Star } from 'lucide-react';
import { movies } from '@/lib/mock-data';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getTmdbMovieById } from '@/services/movies/providers/tmdb';
import { ShelfActionButton } from '@/components/shelf-action-button';
import { DetailReviewSection } from '@/components/detail-review-section';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const localMovie = movies.find((entry) => String(entry.id) === id);
  return {
    title: localMovie ? `${localMovie.title} — VitaPhiles` : 'Movie Details — VitaPhiles',
  };
}

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  let movie: {
    id?: string;
    externalId: string;
    title: string;
    director: string;
    year?: number;
    description: string;
    poster: string;
    rating: number;
    genres: string[];
    mood: string[];
  } | null = null;

  // 1. Try DB first
  const dbItem = await db.mediaItem.findFirst({
    where: {
      kind: 'movie',
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

    movie = {
      id: dbItem.id,
      externalId: dbItem.externalId || dbItem.id,
      title: dbItem.title,
      director: dbItem.creator,
      year: dbItem.year || undefined,
      description: dbItem.description,
      poster: dbItem.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
      rating: dbItem.averageRating || 4.5,
      genres: parsedGenres.length > 0 ? parsedGenres : ['Drama', 'Cinema'],
      mood: parsedMood.length > 0 ? parsedMood : ['Thought-provoking'],
    };
  } else {
    // 2. Check local mock data
    const local = movies.find((m) => String(m.id) === id);
    if (local) {
      movie = {
        externalId: String(local.id),
        title: local.title,
        director: local.director,
        year: local.year,
        description: local.description,
        poster: local.poster,
        rating: local.rating,
        genres: local.genres,
        mood: local.mood,
      };
    } else {
      // 3. Try TMDB Provider lookup if id starts with tmdb- or numeric
      const cleanId = id.replace(/^tmdb-/, '');
      const tmdbRes = await getTmdbMovieById(cleanId);
      if (tmdbRes) {
        movie = {
          externalId: tmdbRes.externalId || cleanId,
          title: tmdbRes.title,
          director: tmdbRes.creator,
          year: tmdbRes.year,
          description: tmdbRes.description,
          poster: tmdbRes.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
          rating: tmdbRes.rating || 4.0,
          genres: ['Movie'],
          mood: ['Cinematic'],
        };
      }
    }
  }

  if (!movie) notFound();

  // Find user's current shelf status for this movie if authenticated
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
        href="/movies"
        className="mb-8 inline-flex items-center gap-2 text-sm text-[#b9b0a2] transition hover:text-[#d6b77a]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to movies
      </Link>

      <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#11161b]">
        <div className="grid gap-8 p-5 md:grid-cols-[280px_1fr] md:p-8">
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            className="aspect-[3/4] w-full rounded-[22px] object-cover shadow-2xl"
          />
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">
              <Clapperboard className="h-4 w-4" /> Movie profile
            </div>
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#f7f2eb] md:text-6xl">
              {movie.title}
            </h1>
            <p className="mt-3 text-[#b9b0a2]">
              {movie.year ? `${movie.year} · ` : ''}Directed by {movie.director}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span key={genre} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#d8d0c4]">
                  {genre}
                </span>
              ))}
            </div>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d2c8b9]">{movie.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d6b77a]/30 bg-[#d6b77a]/10 px-4 py-2.5 text-[#f7e7b9]">
                <Star className="h-4 w-4 fill-current" /> {movie.rating.toFixed(1)} rating
              </div>

              <ShelfActionButton
                kind="movie"
                mediaItemId={movie.id}
                externalId={movie.externalId}
                title={movie.title}
                creator={movie.director}
                year={movie.year}
                description={movie.description}
                image={movie.poster}
                genres={movie.genres}
                initialStatus={userStatus}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 border-t border-white/10 bg-[#0d1117] p-5 sm:grid-cols-3 md:p-8">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-[#d6b77a]">Mood</div>
            <div className="mt-2 text-sm text-[#d4cabc]">{movie.mood.join(' · ')}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-[#d6b77a]">Your status</div>
            <div className="mt-2 text-sm text-[#d4cabc]">
              {userStatus ? userStatus.replace('_', ' ').toUpperCase() : 'Not in watchlist'}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-[#d6b77a]">Literary Connection</div>
            <Link href="/books/1" className="mt-2 inline-block text-sm text-[#f5efe7] hover:text-[#d6b77a]">
              Read Dune by Frank Herbert →
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews & Ratings Section */}
      <DetailReviewSection
        mediaItemId={movie.id || ''}
        title={movie.title}
        existingReviews={dbItem?.reviews || []}
      />
    </main>
  );
}
