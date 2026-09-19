'use client';

import { tasteSignals, type TasteProfile } from '@/lib/recommendations';
import { BookOpen, Clapperboard, Sparkles, Star } from 'lucide-react';

export function InsightsPanel({
  profile,
  watchedCount = 0,
  readCount = 0,
  avgRating = 4.5,
}: {
  profile: TasteProfile;
  watchedCount?: number;
  readCount?: number;
  avgRating?: number;
}) {
  const signals = tasteSignals(profile);

  return (
    <div className="rounded-[30px] border border-white/10 bg-[#11161b] p-6 shadow-2xl md:p-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">
            <Sparkles className="h-3.5 w-3.5" /> Story DNA & Personal Insights
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.05em] text-[#f7f2eb]">Your Taste Breakdown</h2>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-4 text-center">
          <Clapperboard className="mx-auto h-5 w-5 text-[#d6b77a]" />
          <div className="mt-2 text-2xl font-semibold text-[#f5efe7]">{watchedCount}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#b9b0a2]">Movies Watched</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-4 text-center">
          <BookOpen className="mx-auto h-5 w-5 text-[#d6b77a]" />
          <div className="mt-2 text-2xl font-semibold text-[#f5efe7]">{readCount}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#b9b0a2]">Books Read</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-4 text-center">
          <Star className="mx-auto h-5 w-5 fill-current text-[#d6b77a]" />
          <div className="mt-2 text-2xl font-semibold text-[#f5efe7]">{avgRating.toFixed(1)}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#b9b0a2]">Avg Rating</div>
        </div>
      </div>

      <div className="mt-7">
        <div className="text-xs uppercase tracking-[0.2em] text-[#d6b77a]">Genre Affinity Signals</div>
        <div className="mt-4 space-y-3.5">
          {signals.slice(0, 5).map(({ genre, value }) => (
            <div key={genre}>
              <div className="mb-1 flex justify-between text-xs text-[#e7dfd0]">
                <span>{genre}</span>
                <span className="text-[#b9b0a2]">{value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#d6b77a] transition-all duration-500"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
