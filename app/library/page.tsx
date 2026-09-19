import Link from 'next/link';
import { SectionHeader } from '@/components/section-header';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { books as mockBooks, movies as mockMovies, communityLists } from '@/lib/mock-data';

export default async function LibraryPage() {
  const user = await getCurrentUser();

  let userMovies: Array<{ id: string; title: string; image: string; creator: string; rating: number; status: string }> = [];
  let userBooks: Array<{ id: string; title: string; image: string; creator: string; rating: number; status: string }> = [];
  let watchedCount = 0;
  let readCount = 0;
  let avgRating = 4.5;
  let listCount = 0;

  if (user) {
    const userLibraries = await db.userLibrary.findMany({
      where: { userId: user.id },
      include: { mediaItem: true },
      orderBy: { updatedAt: 'desc' },
    });

    const userRatings = await db.rating.findMany({
      where: { userId: user.id },
    });

    if (userRatings.length > 0) {
      avgRating = userRatings.reduce((acc, r) => acc + r.score, 0) / userRatings.length;
    }

    listCount = await db.personalList.count({ where: { userId: user.id } });

    userLibraries.forEach((entry) => {
      const item = entry.mediaItem;
      const formatted = {
        id: item.externalId || item.id,
        title: item.title,
        creator: item.creator,
        image: item.image || '',
        rating: item.averageRating || 4.5,
        status: entry.status.replace(/_/g, ' '),
      };

      if (item.kind === 'movie') {
        userMovies.push(formatted);
        if (entry.status === 'watched') watchedCount++;
      } else {
        userBooks.push(formatted);
        if (entry.status === 'read') readCount++;
      }
    });
  }

  // Fallback display if user has no DB entries yet or guest
  if (userMovies.length === 0) {
    userMovies = mockMovies.map((m) => ({
      id: String(m.id),
      title: m.title,
      creator: m.director,
      image: m.poster,
      rating: m.rating,
      status: 'watched',
    }));
    watchedCount = 127;
  }

  if (userBooks.length === 0) {
    userBooks = mockBooks.map((b) => ({
      id: String(b.id),
      title: b.title,
      creator: b.author,
      image: b.cover,
      rating: b.rating,
      status: 'currently reading',
    }));
    readCount = 43;
  }

  const libraryStats = [
    { label: 'Movies watched', value: String(watchedCount) },
    { label: 'Books read', value: String(readCount) },
    { label: 'Average rating', value: avgRating.toFixed(1) },
    { label: 'Lists created', value: String(listCount || 12) },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Personal library" title="Your story archive" />

      <div className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {libraryStats.map((stat) => (
          <div key={stat.label} className="rounded-[24px] border border-white/10 bg-[#11161b] p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#d6b77a]">{stat.label}</div>
            <div className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#f5efe7]">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-[28px] border border-white/10 bg-[#11161b] p-5">
          <div className="mb-4 text-xs uppercase tracking-[0.26em] text-[#d6b77a]">Movies</div>
          <div className="space-y-3">
            {userMovies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0c1117] p-3 transition hover:border-[#d6b77a]/40"
              >
                <img src={movie.image} alt={movie.title} className="h-20 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-[#f5efe7]">{movie.title}</div>
                  <div className="text-sm text-[#b9b0a2]">{movie.creator}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#d6b77a]">
                    {movie.status}
                  </div>
                </div>
                <div className="text-sm text-[#d6b77a]">★ {movie.rating.toFixed(1)}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#11161b] p-5">
          <div className="mb-4 text-xs uppercase tracking-[0.26em] text-[#d6b77a]">Books</div>
          <div className="space-y-3">
            {userBooks.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0c1117] p-3 transition hover:border-[#d6b77a]/40"
              >
                <img src={book.image} alt={book.title} className="h-20 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-[#f5efe7]">{book.title}</div>
                  <div className="text-sm text-[#b9b0a2]">{book.creator}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#d6b77a]">
                    {book.status}
                  </div>
                </div>
                <div className="text-sm text-[#d6b77a]">★ {book.rating.toFixed(1)}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10 rounded-[28px] border border-white/10 bg-[#11161b] p-5">
        <div className="mb-4 text-xs uppercase tracking-[0.26em] text-[#d6b77a]">Featured Collections</div>
        <div className="flex flex-wrap gap-3">
          {communityLists.map((item) => (
            <Link
              key={item}
              href="/lists"
              className="rounded-full border border-[#d6b77a]/25 bg-[#d6b77a]/5 px-4 py-2 text-sm text-[#f6efe7] hover:bg-[#d6b77a]/15 transition"
            >
              {item}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
