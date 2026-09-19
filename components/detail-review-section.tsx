'use client';

import { useState } from 'react';
import { MessageSquarePlus, Star } from 'lucide-react';
import { RatingReviewModal } from '@/components/rating-review-modal';

type ReviewItem = {
  id: string;
  content: string;
  rating?: number | null;
  createdAt: string | Date;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string | null;
  };
};

export function DetailReviewSection({
  mediaItemId,
  title,
  existingReviews = [],
}: {
  mediaItemId: string;
  title: string;
  existingReviews?: ReviewItem[];
}) {
  const [reviews, setReviews] = useState<ReviewItem[]>(existingReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshReviews = async () => {
    if (!mediaItemId) return;
    try {
      const res = await fetch(`/api/reviews?mediaItemId=${mediaItemId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="mt-10 rounded-[30px] border border-white/10 bg-[#11161b] p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Community & Journal</div>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.05em] text-[#f7f2eb]">
            Reviews & Ratings ({reviews.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#d6b77a]/15 border border-[#d6b77a]/40 px-5 py-2 text-xs font-semibold text-[#f7e7b9] hover:bg-[#d6b77a]/25 transition"
        >
          <MessageSquarePlus className="h-4 w-4 text-[#d6b77a]" /> Write a Review
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-[#b9b0a2] italic">
            No written reviews yet for {title}. Be the first to share your thoughts!
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-white/10 bg-[#0d1117] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d6b77a]/20 text-xs font-bold text-[#d6b77a]">
                    {r.user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#f5efe7]">{r.user.name}</div>
                    <div className="text-[10px] text-[#8f8779]">@{r.user.username}</div>
                  </div>
                </div>

                {r.rating && (
                  <div className="flex items-center gap-1 text-xs text-[#d6b77a]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{r.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <p className="mt-3 text-sm leading-6 text-[#c9c0ad]">{r.content}</p>
            </div>
          ))
        )}
      </div>

      <RatingReviewModal
        mediaItemId={mediaItemId}
        title={title}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitted={refreshReviews}
      />
    </section>
  );
}
