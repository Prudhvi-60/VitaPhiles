import type { ProviderResult } from '@/services/catalog-types';

type OpenLibraryResponse = {
  docs?: Array<{
    key?: string;
    title?: string;
    author_name?: string[];
    first_publish_year?: number;
    subject?: string[];
    cover_i?: number;
  }>;
};

export async function searchOpenLibrary(query: string): Promise<ProviderResult> {
  const url = new URL('https://openlibrary.org/search.json');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '12');
  url.searchParams.set('fields', 'key,title,author_name,first_publish_year,subject,cover_i');

  try {
    const response = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(4500) });
    if (!response.ok) return { source: 'open-library', results: [], stale: true };
    const data = (await response.json()) as OpenLibraryResponse;
    return {
      source: 'open-library',
      results: (data.docs ?? []).flatMap((book) => {
        if (!book.title) return [];
        return [{
          id: `open-library-${book.key ?? book.title}`,
          kind: 'book' as const,
          title: book.title,
          creator: book.author_name?.join(', ') || 'Unknown author',
          year: book.first_publish_year,
          description: book.subject?.slice(0, 3).join(' · ') || 'No description is available from Open Library.',
          image: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : undefined,
          provider: 'open-library' as const,
          externalId: book.key,
        }];
      }),
    };
  } catch {
    return { source: 'open-library', results: [], stale: true };
  }
}
