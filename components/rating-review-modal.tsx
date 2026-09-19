'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';

export function RatingReviewModal({
  mediaItemId,
  title,
  isOpen,
  onClose,
  onSubmitted,
}: {
  mediaItemId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaItemId,
          rating,
          content,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      onClose();
      if (onSubmitted) onSubmitted();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090b]/85 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-[28px] border border-[#d6b77a]/30 bg-[#11161b] p-6 shadow-2xl md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Your review</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.05em] text-[#f7f2eb]">Rate & Log "{title}"</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#b9b0a2] hover:bg-white/5 hover:text-[#f5efe7]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-center text-xs text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-[#b9b0a2]">Rating</label>
            <div className="mt-2 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-7 w-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-[#d6b77a] text-[#d6b77a]'
                        : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-[#f7e7b9]">
                {(hoverRating || rating).toFixed(1)} / 5.0
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-[#b9b0a2]">Review & Thoughts</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What made this story unforgettable?"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-[#f5efe7] placeholder:text-[#6e675b] focus:border-[#d6b77a]/60 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 px-4 py-2 text-xs text-[#b9b0a2] hover:text-[#f5efe7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#d6b77a] px-5 py-2 text-xs font-semibold text-[#111318] hover:brightness-110 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Save Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
