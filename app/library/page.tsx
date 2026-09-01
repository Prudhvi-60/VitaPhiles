import { SectionHeader } from '@/components/section-header';
import { books, movies, communityLists } from '@/lib/mock-data';

const libraryStats = [
  { label: 'Movies watched', value: '127' },
  { label: 'Books read', value: '43' },
  { label: 'Average rating', value: '4.3' },
  { label: 'Lists created', value: '12' },
];

export default function LibraryPage() {
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
            {movies.map((movie) => (
              <div key={movie.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0c1117] p-3">
                <img src={movie.poster} alt={movie.title} className="h-20 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-[#f5efe7]">{movie.title}</div>
                  <div className="text-sm text-[#b9b0a2]">{movie.genres.join(' • ')}</div>
                </div>
                <div className="text-sm text-[#d6b77a]">★ {movie.rating.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#11161b] p-5">
          <div className="mb-4 text-xs uppercase tracking-[0.26em] text-[#d6b77a]">Books</div>
          <div className="space-y-3">
            {books.map((book) => (
              <div key={book.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0c1117] p-3">
                <img src={book.cover} alt={book.title} className="h-20 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-[#f5efe7]">{book.title}</div>
                  <div className="text-sm text-[#b9b0a2]">{book.author}</div>
                </div>
                <div className="text-sm text-[#d6b77a]">★ {book.rating.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10 rounded-[28px] border border-white/10 bg-[#11161b] p-5">
        <div className="mb-4 text-xs uppercase tracking-[0.26em] text-[#d6b77a]">Collections</div>
        <div className="flex flex-wrap gap-3">
          {communityLists.map((item) => (
            <span key={item} className="rounded-full border border-[#d6b77a]/25 bg-[#d6b77a]/5 px-4 py-2 text-sm text-[#f6efe7]">{item}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
