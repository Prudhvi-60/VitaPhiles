import { SectionHeader } from '@/components/section-header';
import { InsightsPanel } from '@/components/insights-panel';
import { getCurrentUser } from '@/lib/auth';
import { defaultTasteProfile, type TasteProfile } from '@/lib/recommendations';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  const name = user?.name || 'Jordan D.';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const bio = user?.bio || 'A reader of worlds, a watcher of futures, and a collector of stories that leave a mark.';

  const watchedCount = user?.libraries?.filter((l) => l.status === 'watched').length || 12;
  const readCount = user?.libraries?.filter((l) => l.status === 'read').length || 7;
  const totalRatings = user?.ratings?.length || 0;
  const avgRating = totalRatings > 0 ? user!.ratings.reduce((acc, r) => acc + r.score, 0) / totalRatings : 4.6;

  let tasteProfile: TasteProfile = defaultTasteProfile;
  if (user?.tasteProfile) {
    try {
      tasteProfile = {
        favoriteMovieGenres: JSON.parse(user.tasteProfile.favoriteMovieGenres),
        favoriteBookGenres: JSON.parse(user.tasteProfile.favoriteBookGenres),
        favoriteCreators: JSON.parse(user.tasteProfile.favoriteCreators),
        preferences: JSON.parse(user.tasteProfile.preferences),
        consumedMovieIds: [],
        consumedBookIds: [],
      };
    } catch {
      tasteProfile = defaultTasteProfile;
    }
  }

  const activities = user?.reviews && user.reviews.length > 0
    ? user.reviews.map((r) => `${user.name} reviewed "${r.mediaItem.title}" — ★ ${r.rating || 5}`)
    : [
        `${name} rated Dune ★★★★★`,
        `${name} reviewed Interstellar`,
        `${name} logged 3 books in "Currently Reading"`,
      ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[30px] border border-white/10 bg-[#11161b] p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#d6b77a]/40 bg-[radial-gradient(circle,_rgba(214,183,122,0.18),_rgba(17,19,24,1))] text-2xl font-semibold text-[#f5efe7]">
              {initials}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Profile</div>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-[#f7f2eb]">{name}</h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-[#b9b0a2]">{bio}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [String(watchedCount), 'Movies Watched'],
              [String(readCount), 'Books Read'],
              [avgRating.toFixed(1), 'Avg Rating'],
              [String(user?.lists?.length || 1), 'Lists Created'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-[#0d1117] p-3 text-center">
                <div className="text-xl font-semibold text-[#f5efe7]">{value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#b7ae9b]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <section className="space-y-6">
          <div>
            <SectionHeader eyebrow="Recent activity" title="What you’ve logged" />
            <div className="space-y-3">
              {activities.map((item, idx) => (
                <div key={idx} className="rounded-[22px] border border-white/10 bg-[#11161b] p-4 text-[#f1ebdf] text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {user?.reviews && user.reviews.length > 0 && (
            <div>
              <SectionHeader eyebrow="Journal" title="Your written reviews" />
              <div className="space-y-3">
                {user.reviews.map((rev) => (
                  <div key={rev.id} className="rounded-[22px] border border-white/10 bg-[#11161b] p-4">
                    <div className="flex items-center justify-between text-xs text-[#d6b77a]">
                      <span className="font-semibold">{rev.mediaItem.title}</span>
                      <span>★ {rev.rating || 5}</span>
                    </div>
                    <p className="mt-2 text-xs text-[#c9c0ad]">{rev.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <InsightsPanel
            profile={tasteProfile}
            watchedCount={watchedCount}
            readCount={readCount}
            avgRating={avgRating}
          />
        </section>
      </div>
    </main>
  );
}
