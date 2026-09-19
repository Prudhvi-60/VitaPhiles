'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, User } from 'lucide-react';

type ListData = {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  user: {
    name: string;
    username: string;
  };
  items: Array<{
    id: string;
    mediaItem: {
      id: string;
      title: string;
      image?: string;
      kind: string;
    };
  }>;
};

export default function ListsPage() {
  const [lists, setLists] = useState<ListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await fetch('/api/lists');
      if (res.ok) {
        const data = await res.json();
        setLists(data.lists || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    setCreating(true);

    try {
      const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newListTitle, description: newListDesc }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        throw new Error('Failed to create list');
      }

      setNewListTitle('');
      setNewListDesc('');
      setShowCreateModal(false);
      fetchLists();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">Curated Collections</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-[#f7f2eb]">Personal Lists</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#d6b77a] px-5 py-2.5 text-sm font-semibold text-[#111318] transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Create New List
        </button>
      </div>

      {loading ? (
        <div className="rounded-[24px] border border-white/10 bg-[#11161b] p-10 text-center text-[#b9b0a2]">
          Loading community and personal lists…
        </div>
      ) : lists.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-white/15 bg-[#11161b] p-10 text-center text-[#b9b0a2]">
          No personal lists created yet. Be the first to build a collection!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Link
              key={list.id}
              href={`/lists/${list.id}`}
              className="group flex flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-[#11161b] p-6 transition hover:-translate-y-1 hover:border-[#d6b77a]/50"
            >
              <div>
                <div className="mb-3 flex items-center justify-between text-xs text-[#b9b0a2]">
                  <span className="flex items-center gap-1.5 text-[#d6b77a]">
                    <User className="h-3.5 w-3.5" /> {list.user.name}
                  </span>
                  <span>{list.items.length} items</span>
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#f5efe7] group-hover:text-[#d6b77a]">
                  {list.title}
                </h3>
                {list.description && (
                  <p className="mt-2 text-sm leading-6 text-[#c7bdab] line-clamp-2">{list.description}</p>
                )}
              </div>

              {list.items.length > 0 && (
                <div className="mt-6 flex -space-x-3 overflow-hidden pt-2 border-t border-white/5">
                  {list.items.slice(0, 4).map((item) => (
                    <img
                      key={item.id}
                      src={item.mediaItem.image || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80'}
                      alt={item.mediaItem.title}
                      className="inline-block h-14 w-11 rounded-lg border-2 border-[#11161b] object-cover"
                    />
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090b]/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[28px] border border-[#d6b77a]/30 bg-[#11161b] p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold text-[#f7f2eb]">Create a Personal List</h2>
            <form onSubmit={handleCreateList} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.16em] text-[#b9b0a2]">Title</label>
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="e.g. Rain-soaked mysteries"
                  required
                  className="mt-1.5 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-[#f5efe7] focus:border-[#d6b77a]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.16em] text-[#b9b0a2]">Description</label>
                <textarea
                  rows={3}
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="What binds these stories together?"
                  className="mt-1.5 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-[#f5efe7] focus:border-[#d6b77a]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs text-[#b9b0a2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-full bg-[#d6b77a] px-5 py-2 text-xs font-semibold text-[#111318]"
                >
                  {creating ? 'Creating...' : 'Create List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
