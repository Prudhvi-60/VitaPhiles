'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpenText, Check, Clapperboard, Compass, EyeOff, Sparkles } from 'lucide-react';
import { MediaCard } from '@/components/media-card';
import { books, movies } from '@/lib/mock-data';
import { defaultTasteProfile, recommendBooks, recommendMovies, type TasteProfile } from '@/lib/recommendations';
import { OnboardingPanel } from '@/components/onboarding-panel';
import { VitaPickSection } from '@/components/vitapick-section';
import { CrossoverSection } from '@/components/crossover-section';
import { InsightsPanel } from '@/components/insights-panel';

const storageKey = 'vitaphiles-taste-profile';

export function PersonalizedHome() {
  const [profile, setProfile] = useState<TasteProfile>(defaultTasteProfile);
  const [userName, setUserName] = useState('Jordan');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [personalized, setPersonalized] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Check logged in user session
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          if (data.user.name) setUserName(data.user.name.split(' ')[0]);
          if (data.user.tasteProfile) {
            try {
              const tp = data.user.tasteProfile;
              setProfile({
                favoriteMovieGenres: JSON.parse(tp.favoriteMovieGenres),
                favoriteBookGenres: JSON.parse(tp.favoriteBookGenres),
                favoriteCreators: JSON.parse(tp.favoriteCreators),
                preferences: JSON.parse(tp.preferences),
                consumedMovieIds: [],
                consumedBookIds: [],
              });
              setHydrated(true);
              return;
            } catch {
              // fallback
            }
          }
        }
        // LocalStorage fallback for guests
        const savedProfile = window.localStorage.getItem(storageKey);
        if (savedProfile) {
          try {
            setProfile(JSON.parse(savedProfile) as TasteProfile);
          } catch {
            window.localStorage.removeItem(storageKey);
          }
        } else {
          setShowOnboarding(true);
        }
        setHydrated(true);
      })
      .catch(() => {
        setHydrated(true);
      });
  }, []);

  const completeOnboarding = async (nextProfile: TasteProfile) => {
    setProfile(nextProfile);
    window.localStorage.setItem(storageKey, JSON.stringify(nextProfile));
    setShowOnboarding(false);

    try {
      await fetch('/api/user/taste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextProfile),
      });
    } catch {
      // Ignored if unauthenticated guest
    }
  };

  const movieRecommendations = recommendMovies(movies, profile);
  const bookRecommendations = recommendBooks(books, profile);
  const topMovie = movieRecommendations[0]?.item ?? movies[0];
  const topBook = bookRecommendations[0]?.item ?? books[0];
  const selectedMovie = personalized ? topMovie : movies[0];
  const selectedBook = personalized ? topBook : books[0];

  const pickResult = {
    id: `local-movie-${selectedMovie.id}`,
    kind: 'movie' as const,
    title: selectedMovie.title,
    creator: selectedMovie.director,
    year: selectedMovie.year,
    description: selectedMovie.description,
    image: selectedMovie.poster,
    rating: selectedMovie.rating,
    provider: 'local' as const,
    externalId: String(selectedMovie.id),
  };

  const pickReason = personalized
    ? movieRecommendations[0]?.reason || 'High signal match for your genres and creators.'
    : 'A considered starting point from the catalog.';

  return (
    <main className="relative overflow-hidden pb-24 text-[#f5efe7]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(214,183,122,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(141,47,61,0.14),_transparent_28%)]" />

      {/* Hero Header */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d6b77a]/35 bg-[#d6b77a]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-[#f7e7b9]">
              <Sparkles className="h-3.5 w-3.5" /> Your story compass
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
              Good evening, {userName}.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#c9c0ad]">
              A quieter way to find what belongs in your next chapter.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowOnboarding(true)}
              className="rounded-full border border-[#d6b77a]/40 px-4 py-2 text-sm text-[#f1e8d9] transition hover:bg-[#d6b77a]/10"
            >
              Tune my taste
            </button>
            <button
              type="button"
              onClick={() => setPersonalized((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-[#b9b0a2] transition hover:border-white/25"
            >
              {personalized ? <Check className="h-4 w-4 text-[#d6b77a]" /> : <EyeOff className="h-4 w-4" />}
              Personalized {personalized ? 'on' : 'off'}
            </button>
          </div>
        </div>
      </section>

      {/* Currently In Progress */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Continue your journey</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Still carrying these stories?</h2>
          </div>
          <Link href="/library" className="text-sm text-[#d6b77a] hover:text-[#f7e7b9]">
            Open library <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/movies/2"
            className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#11161b] p-5 transition hover:border-[#d6b77a]/50"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(141,47,61,0.3),transparent_50%)]" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d6b77a]/30 bg-[#d6b77a]/10 text-[#d6b77a]">
                <Clapperboard className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#d6b77a]">Currently watching</div>
                <div className="mt-1 text-xl font-semibold">Interstellar</div>
                <div className="mt-1 text-sm text-[#b9b0a2]">Pick up where you left off · 68%</div>
              </div>
            </div>
          </Link>

          <Link
            href="/books/1"
            className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#11161b] p-5 transition hover:border-[#d6b77a]/50"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,183,122,0.18),transparent_50%)]" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d6b77a]/30 bg-[#d6b77a]/10 text-[#d6b77a]">
                <BookOpenText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#d6b77a]">Currently reading</div>
                <div className="mt-1 text-xl font-semibold">Dune</div>
                <div className="mt-1 text-sm text-[#b9b0a2]">Continue your desert journey · 41%</div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* VitaPick Recommendation Feature */}
      <VitaPickSection pick={pickResult} reason={pickReason} />

      {/* Page to Screen Crossover Discovery */}
      <CrossoverSection />

      {/* Considered Next Steps */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Recommended for you</div>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">A few considered next steps.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {(personalized
            ? movieRecommendations
            : movies.map((item) => ({ item, score: item.rating, reason: 'Popular in the VitaPhiles catalog' }))
          )
            .slice(0, 4)
            .map(({ item, reason }) => (
              <div key={item.id} className="space-y-3">
                <MediaCard
                  title={item.title}
                  subtitle={`${item.year} · ${item.director}`}
                  description={item.description}
                  image={item.poster}
                  rating={item.rating}
                  href={`/movies/${item.id}`}
                />
                <p className="px-1 text-xs text-[#b9b0a2]">
                  <Compass className="mr-1 inline h-3.5 w-3.5 text-[#d6b77a]" />
                  {reason}
                </p>
              </div>
            ))}
        </div>
      </section>

      {/* Story DNA & Next Read Grid */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pt-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-6">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Your next read</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">A literary bridge from your screen.</h2>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-[#11161b] p-5">
            <div className="flex gap-4">
              <img
                src={selectedBook.cover}
                alt={`${selectedBook.title} cover`}
                className="h-40 w-28 rounded-xl object-cover"
              />
              <div>
                <div className="text-2xl font-semibold">{selectedBook.title}</div>
                <div className="mt-1 text-sm text-[#b9b0a2]">
                  {selectedBook.author} · {selectedBook.year}
                </div>
                <p className="mt-4 text-sm leading-6 text-[#c9c0ad]">{selectedBook.description}</p>
                <p className="mt-4 text-xs text-[#d6b77a]">
                  {personalized ? bookRecommendations[0]?.reason : 'A starting point from the catalog'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <InsightsPanel profile={profile} />
        </div>
      </section>

      {!hydrated ? null : showOnboarding && <OnboardingPanel initialProfile={profile} onComplete={completeOnboarding} />}
    </main>
  );
}
