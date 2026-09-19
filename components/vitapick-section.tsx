'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import type { CatalogResult } from '@/services/catalog-types';

export function VitaPickSection({
  pick,
  reason,
}: {
  pick: CatalogResult;
  reason: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[30px] border border-[#d6b77a]/30 bg-[linear-gradient(135deg,rgba(141,47,61,0.2),rgba(17,19,24,0.95),rgba(214,183,122,0.12))] p-6 shadow-2xl md:p-10">
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 bg-[radial-gradient(circle_at_top_right,rgba(214,183,122,0.15),transparent_70%)]" />

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d6b77a]/40 bg-[#d6b77a]/15 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#f7e7b9]">
              <Sparkles className="h-3.5 w-3.5 text-[#d6b77a]" /> VitaPick · Today’s algorithm pick
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#f7f2eb] md:text-5xl">
              {pick.title}
            </h2>
            <div className="mt-2 text-sm text-[#d6b77a]">
              {pick.kind === 'movie' ? 'Movie' : 'Book'} · {pick.creator} {pick.year ? `(${pick.year})` : ''}
            </div>
            <p className="mt-4 text-sm leading-6 text-[#c9c0ad]">{pick.description}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-[#d6b77a]">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{reason}</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            {pick.image && (
              <img
                src={pick.image}
                alt={pick.title}
                className="h-44 w-32 rounded-2xl object-cover shadow-lg border border-white/10"
              />
            )}
            <Link
              href={pick.kind === 'movie' ? `/movies/${pick.externalId || pick.id}` : `/books/${pick.externalId || pick.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#d6b77a] px-6 py-3 text-sm font-semibold text-[#111318] transition hover:brightness-110"
            >
              Meet your pick <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
