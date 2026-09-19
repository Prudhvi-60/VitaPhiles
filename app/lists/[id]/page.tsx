'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clapperboard, Trash2, User } from 'lucide-react';

type ListDetail = {
  id: string;
  title: string;
  description?: string;
  user: {
    name: string;
    username: string;
  };
  items: Array<{
    id: string;
    note?: string;
    mediaItem: {
      id: string;
      kind: string;
      externalId?: string;
      title: string;
      creator: string;
      year?: number;
      description: string;
      image?: string;
      averageRating?: number;
    };
  }>;
};

export default function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [list, setList] = useState<ListDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, [id]);

  const fetchList = async () => {
    try {
      const res = await fetch(`/api/lists/${id}`);
      if (res.ok) {
        const data = await res.json();
        setList(data.list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (mediaItemId: string) => {
    try {
      const res = await fetch(`/api/lists/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaItemId, action: 'remove_item' }),
      });
      if (res.ok) {
        fetchList();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 text-center text-[#b9b0a2]">
        Loading collection details…
      </main>
    );
  }

  if (!list) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 text-center text-[#b9b0a2]">
        Collection not found.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/lists"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#b9b0a2] transition hover:text-[#d6b77a]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to lists
      </Link>

      <section className="rounded-[30px] border border-white/10 bg-[#11161b] p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs text-[#d6b77a]">
          <User className="h-4 w-4" /> Curated by {list.user.name} (@{list.user.username})
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#f7f2eb] md:text-5xl">
          {list.title}
        </h1>
        {list.description && <p className="mt-3 max-w-2xl text-base leading-7 text-[#c9c0ad]">{list.description}</p>}
      </section>

      <section className="mt-8 space-y-4">
        {list.items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/15 bg-[#11161b] p-8 text-center text-[#b9b0a2]">
            No items in this collection yet.
          </div>
        ) : (
          list.items.map((item) => {
            const m = item.mediaItem;
            const href = m.kind === 'movie' ? `/movies/${m.externalId || m.id}` : `/books/${m.externalId || m.id}`;
            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-[#11161b] p-4 sm:flex-row sm:items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={m.image || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80'}
                    alt={m.title}
                    className="h-24 w-18 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#d6b77a]">
                      {m.kind === 'movie' ? <Clapperboard className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                      {m.kind}
                    </div>
                    <Link href={href} className="text-xl font-semibold text-[#f5efe7] hover:text-[#d6b77a]">
                      {m.title}
                    </Link>
                    <div className="text-xs text-[#b9b0a2]">
                      {m.creator} {m.year ? `(${m.year})` : ''}
                    </div>
                    {item.note && (
                      <p className="mt-2 text-xs italic text-[#d6b77a]/90">"{item.note}"</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(m.id)}
                  className="self-end sm:self-center p-2 text-[#8f8779] hover:text-rose-400"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}
