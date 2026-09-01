import { searchBooks } from '@/services/books/book-service';
import type { CatalogResult } from '@/services/catalog-types';
import { searchMovies } from '@/services/movies/movie-service';

const isbnPattern = /^(?:97[89])?\d{9}[\dX]$/;

function deduplicate(results: CatalogResult[]) {
  const seen = new Set<string>();
  return results.filter((result) => {
    const key = `${result.kind}:${result.externalId ?? result.title.toLowerCase()}:${result.year ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function searchCatalog(rawQuery: string) {
  const query = rawQuery.trim().replace(/\s+/g, ' ');
  if (query.length < 2) return { query, results: [], sources: [] as string[], stale: false };

  const isIsbn = isbnPattern.test(query.replace(/[-\s]/g, ''));
  const bookQuery = isIsbn ? `isbn:${query.replace(/[-\s]/g, '')}` : query;
  const [movieResult, bookResult] = await Promise.all([searchMovies(query), searchBooks(bookQuery)]);
  const results = deduplicate([...movieResult.results, ...bookResult.results]).sort((left, right) => (right.rating ?? 0) - (left.rating ?? 0));
  return {
    query,
    results,
    sources: [movieResult.source, bookResult.source].filter((source, index, all) => all.indexOf(source) === index),
    stale: Boolean(movieResult.stale || bookResult.stale),
  };
}
