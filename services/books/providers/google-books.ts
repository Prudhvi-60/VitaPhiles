import type { ProviderResult } from '@/services/catalog-types';

type GoogleBooksResponse = {
  items?: Array<{
    id: string;
    volumeInfo?: {
      title?: string;
      authors?: string[];
      publishedDate?: string;
      description?: string;
      imageLinks?: { thumbnail?: string };
      averageRating?: number;
      ratingsCount?: number;
    };
  }>;
};

function normalizeImage(image?: string) {
  return image?.replace(/^http:/, 'https:').replace('zoom=1', 'zoom=2');
}

export async function searchGoogleBooks(query: string): Promise<ProviderResult> {
  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.set('q', query);
  url.searchParams.set('maxResults', '12');
  if (process.env.GOOGLE_BOOKS_API_KEY) url.searchParams.set('key', process.env.GOOGLE_BOOKS_API_KEY);

  try {
    const response = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(4500) });
    if (!response.ok) return { source: 'google-books', results: [], stale: true };
    const data = (await response.json()) as GoogleBooksResponse;
    return {
      source: 'google-books',
      results: (data.items ?? []).flatMap((item) => {
        const info = item.volumeInfo;
        if (!info?.title) return [];
        return [{
          id: `google-books-${item.id}`,
          kind: 'book' as const,
          title: info.title,
          creator: info.authors?.join(', ') || 'Unknown author',
          year: info.publishedDate ? Number(info.publishedDate.slice(0, 4)) : undefined,
          description: info.description || 'No description is available from Google Books.',
          image: normalizeImage(info.imageLinks?.thumbnail),
          rating: info.averageRating,
          provider: 'google-books' as const,
          externalId: item.id,
        }];
      }),
    };
  } catch {
    return { source: 'google-books', results: [], stale: true };
  }
}
