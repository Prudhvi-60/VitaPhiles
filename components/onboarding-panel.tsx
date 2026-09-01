'use client';

import { useState } from 'react';
import { Check, SlidersHorizontal, X } from 'lucide-react';
import type { TasteProfile } from '@/lib/recommendations';

const movieGenres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'Western'];
const bookGenres = ['Fiction', 'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 'Horror', 'Historical Fiction', 'Literary Fiction', 'Philosophy', 'Psychology', 'Biography', 'Self-help', 'Classics', 'Poetry'];
const creators = ['Christopher Nolan', 'Denis Villeneuve', 'Jane Austen', 'Frank Herbert', 'Umberto Eco', 'Damien Chazelle'];
const contentPreferences = ['Classics', 'New releases', 'Slow-burn stories', 'Fast-paced stories', 'Fiction', 'Non-fiction', 'Hidden gems', 'Popular releases'];

export function OnboardingPanel({ initialProfile, onComplete }: { initialProfile: TasteProfile; onComplete: (profile: TasteProfile) => void }) {
  const [profile, setProfile] = useState(initialProfile);
  const [step, setStep] = useState(0);
  const toggle = (key: 'favoriteMovieGenres' | 'favoriteBookGenres' | 'favoriteCreators', value: string) => {
    setProfile((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }));
  };

  const options = step === 0 ? movieGenres : step === 1 ? bookGenres : step === 2 ? creators : contentPreferences;
  const key = step === 0 ? 'favoriteMovieGenres' : step === 1 ? 'favoriteBookGenres' : 'favoriteCreators';
  const preferenceSelected = (option: string) => ({
    Classics: profile.preferences.classics,
    'New releases': !profile.preferences.classics,
    'Slow-burn stories': profile.preferences.slowBurn,
    'Fast-paced stories': !profile.preferences.slowBurn,
    Fiction: profile.preferences.fiction,
    'Non-fiction': !profile.preferences.fiction,
    'Hidden gems': profile.preferences.hiddenGems,
    'Popular releases': !profile.preferences.hiddenGems,
  })[option] ?? false;
  const togglePreference = (option: string) => setProfile((current) => ({ ...current, preferences: { ...current.preferences, ...(option === 'Classics' || option === 'New releases' ? { classics: option === 'Classics' } : {}), ...(option === 'Slow-burn stories' || option === 'Fast-paced stories' ? { slowBurn: option === 'Slow-burn stories' } : {}), ...(option === 'Fiction' || option === 'Non-fiction' ? { fiction: option === 'Fiction' } : {}), ...(option === 'Hidden gems' || option === 'Popular releases' ? { hiddenGems: option === 'Hidden gems' } : {}) } }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090b]/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[#d6b77a]/30 bg-[#11161b] p-6 shadow-2xl md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div><div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Taste setup · {step + 1}/4</div><h2 id="onboarding-title" className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Tune your story compass.</h2><p className="mt-2 text-sm leading-6 text-[#b9b0a2]">Optional. Pick a few signals and we will shape your first recommendations.</p></div>
          <button type="button" onClick={() => onComplete(profile)} aria-label="Skip taste setup" className="rounded-full p-2 text-[#b9b0a2] hover:bg-white/5 hover:text-[#f5efe7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a]"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {options.map((option) => { const selected = step === 3 ? preferenceSelected(option) : profile[key].includes(option); return <button key={option} type="button" onClick={() => step === 3 ? togglePreference(option) : toggle(key, option)} aria-pressed={selected} className={`flex min-h-11 items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a] ${selected ? 'border-[#d6b77a]/70 bg-[#d6b77a]/15 text-[#f7e7b9]' : 'border-white/10 bg-white/[0.03] text-[#d0c7b9] hover:border-white/25'}`}>{option}{selected && <Check className="h-4 w-4" />}</button>; })}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5"><button type="button" onClick={() => onComplete(profile)} className="inline-flex items-center gap-2 text-sm text-[#b9b0a2] hover:text-[#f5efe7]">Skip for now</button><div className="flex gap-2"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="rounded-full border border-white/10 px-4 py-2 text-sm text-[#d0c7b9] disabled:opacity-30">Back</button><button type="button" onClick={() => step < 3 ? setStep((current) => current + 1) : onComplete(profile)} className="inline-flex items-center gap-2 rounded-full bg-[#d6b77a] px-4 py-2 text-sm font-semibold text-[#111318]">{step < 3 ? 'Continue' : 'See my picks'} <SlidersHorizontal className="h-4 w-4" /></button></div></div>
      </div>
    </div>
  );
}