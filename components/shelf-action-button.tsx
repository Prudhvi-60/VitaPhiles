'use client';

import { useState } from 'react';
import { Bookmark, Check, ChevronDown } from 'lucide-react';

export type ShelfKind = 'book' | 'movie';

const bookStatuses = [
  { key: 'want_to_read', label: 'Want to Read' },
  { key: 'currently_reading', label: 'Currently Reading' },
  { key: 'read', label: 'Read' },
];

const movieStatuses = [
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'watched', label: 'Watched' },
];

export function ShelfActionButton({
  kind,
  mediaItemId,
  externalId,
  title,
  creator,
  year,
  description,
  image,
  genres,
  initialStatus,
}: {
  kind: ShelfKind;
  mediaItemId?: string;
  externalId?: string;
  title: string;
  creator: string;
  year?: number;
  description?: string;
  image?: string;
  genres?: string[];
  initialStatus?: string | null;
}) {
  const [currentStatus, setCurrentStatus] = useState<string | null>(initialStatus || null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statuses = kind === 'book' ? bookStatuses : movieStatuses;
  const currentLabel = statuses.find((s) => s.key === currentStatus)?.label;

  const handleSelectStatus = async (statusKey: string) => {
    setOpen(false);
    setLoading(true);

    const isRemoving = currentStatus === statusKey;
    const targetStatus = isRemoving ? null : statusKey;
    setCurrentStatus(targetStatus);

    try {
      const response = await fetch('/api/user/shelf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaItemId,
          kind,
          externalId,
          provider: 'local',
          title,
          creator,
          year,
          description,
          image,
          genres,
          status: targetStatus,
          action: isRemoving ? 'remove' : 'upsert',
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        throw new Error('Failed to update shelf');
      }
    } catch {
      setCurrentStatus(initialStatus || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a] ${
          currentStatus
            ? 'border border-[#d6b77a] bg-[#d6b77a]/15 text-[#f7e7b9]'
            : 'bg-[#d6b77a] text-[#111318] hover:brightness-110'
        }`}
      >
        <Bookmark className="h-4 w-4" />
        <span>{loading ? 'Saving...' : currentLabel || (kind === 'book' ? 'Add to shelf' : 'Add to watchlist')}</span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 z-50 w-48 rounded-2xl border border-white/10 bg-[#11161b] p-1.5 shadow-2xl backdrop-blur-xl">
          {statuses.map((s) => {
            const isSelected = currentStatus === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => handleSelectStatus(s.key)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                  isSelected ? 'bg-[#d6b77a]/20 text-[#f7e7b9] font-medium' : 'text-[#d0c7b9] hover:bg-white/5'
                }`}
              >
                <span>{s.label}</span>
                {isSelected && <Check className="h-4 w-4 text-[#d6b77a]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
