import { movies } from '@/lib/mock-data';
import type { CatalogResult, ProviderResult } from '@/services/catalog-types';
import { searchTmdb } from '@/services/movies/providers/tmdb';

function localMovieResults(query: string): CatalogResult[] {
  const normalized = query.toLowerCase();
  return movies
    .filter((movie) => [movie.title, movie.director, ...movie.genres, ...movie.mood, movie.description].join(' ').toLowerCase().includes(normalized))
    .map((movie) => ({ id: `local-movie-${movie.id}`, kind: 'movie' as const, title: movie.title, creator: movie.director, year: movie.year, description: movie.description, image: movie.poster, rating: movie.rating, provider: 'local' as const, externalId: String(movie.id) }));
}

export async function searchMovies(query: string): Promise<ProviderResult> {
  const providerResult = await searchTmdb(query);
  return { ...providerResult, results: providerResult.results.length > 0 ? providerResult.results : localMovieResults(query) };
}
