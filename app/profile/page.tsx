import { SectionHeader } from '@/components/section-header';
import { books, movies } from '@/lib/mock-data';

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[30px] border border-white/10 bg-[#11161b] p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#d6b77a]/40 bg-[radial-gradient(circle,_rgba(214,183,122,0.18),_rgba(17,19,24,1))] text-2xl font-semibold text-[#f5efe7]">JD</div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Profile</div>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-[#f7f2eb]">Jordan D.</h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-[#b9b0a2]">A reader of worlds, a watcher of futures, and a collector of the stories that leave a mark.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['127', 'Movies Watched'],
              ['43', 'Books Read'],
              ['4.2', 'Avg Movie Rating'],
              ['4.5', 'Avg Book Rating'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-[#0d1117] p-3 text-center">
                <div className="text-xl font-semibold text-[#f5efe7]">{value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#b7ae9b]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <SectionHeader eyebrow="Recent activity" title="What you’ve been loving" />
          <div className="space-y-3">
            {[
              'Jordan rated Dune ★★★★★',
              'Jordan reviewed Interstellar',
              'Jordan added 5 books to “2026 Reading”',
              'Jordan followed Priya',
            ].map((item) => (
              <div key={item} className="rounded-[22px] border border-white/10 bg-[#11161b] p-4 text-[#f1ebdf]">{item}</div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Favorites" title="High-signal picks" />
          <div className="space-y-3">
            {[...movies.slice(0, 2), ...books.slice(0, 2)].map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-[#11161b] p-3">
                <img src={'poster' in item ? item.poster : item.cover} alt={item.title} className="h-20 w-16 rounded-xl object-cover" />
                <div>
                  <div className="font-medium text-[#f5efe7]">{item.title}</div>
                  <div className="text-sm text-[#b9b0a2]">{'director' in item ? item.director : item.author}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
