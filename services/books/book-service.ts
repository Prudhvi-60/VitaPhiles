import { books } from '@/lib/mock-data';
import type { CatalogResult, ProviderResult } from '@/services/catalog-types';
import { searchGoogleBooks } from '@/services/books/providers/google-books';
import { searchOpenLibrary } from '@/services/books/providers/open-library';

function localBookResults(query: string): CatalogResult[] {
  const normalized = query.toLowerCase();
  return books
    .filter((book) => [book.title, book.author, ...book.genres, ...book.mood, book.description].join(' ').toLowerCase().includes(normalized))
    .map((book) => ({ id: `local-book-${book.id}`, kind: 'book' as const, title: book.title, creator: book.author, year: book.year, description: book.description, image: book.cover, rating: book.rating, provider: 'local' as const, externalId: String(book.id) }));
}

export async function searchBooks(query: string): Promise<ProviderResult> {
  const googleResult = await searchGoogleBooks(query);
  if (googleResult.results.length > 0) return googleResult;
  const fallbackResult = await searchOpenLibrary(query);
  return { ...fallbackResult, results: fallbackResult.results.length > 0 ? fallbackResult.results : localBookResults(query) };
}
