import type { CatalogResult, ProviderResult } from '@/services/catalog-types';

type TmdbSearchResponse = {
  results?: Array<{
    id: number;
    title?: string;
    release_date?: string;
    overview?: string;
    poster_path?: string | null;
    vote_average?: number;
  }>;
};

type TmdbMovieDetail = {
  id: number;
  title?: string;
  release_date?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  genres?: Array<{ id: number; name: string }>;
  runtime?: number;
};

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

async function fetchWithTimeout(url: string | URL, options?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    return await fetch(url, { ...options, signal: controller.signal, next: { revalidate: 3600 } });
  } finally {
    clearTimeout(timeout);
  }
}

export async function searchTmdb(query: string): Promise<ProviderResult> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return { source: 'tmdb', results: [] };

  try {
    const url = new URL('https://api.themoviedb.org/3/search/movie');
    url.searchParams.set('query', query);
    url.searchParams.set('include_adult', 'false');
    url.searchParams.set('language', 'en-US');
    url.searchParams.set('api_key', apiKey);
    const response = await fetchWithTimeout(url);
    if (!response.ok) return { source: 'tmdb', results: [], stale: true };
    const data = (await response.json()) as TmdbSearchResponse;
    return {
      source: 'tmdb',
      results: (data.results ?? []).slice(0, 12).flatMap((movie) => {
        if (!movie.title) return [];
        return [{
          id: `tmdb-${movie.id}`,
          kind: 'movie' as const,
          title: movie.title,
          creator: 'TMDB movie record',
          year: movie.release_date ? Number(movie.release_date.slice(0, 4)) : undefined,
          description: movie.overview || 'No overview is available from TMDB.',
          image: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : undefined,
          rating: movie.vote_average,
          provider: 'tmdb' as const,
          externalId: String(movie.id),
        }];
      }),
    };
  } catch {
    return { source: 'tmdb', results: [], stale: true };
  }
}

export async function getTmdbMovieById(externalId: string): Promise<CatalogResult | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const url = new URL(`https://api.themoviedb.org/3/movie/${externalId}`);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('language', 'en-US');
    const response = await fetchWithTimeout(url);
    if (!response.ok) return null;
    const movie = (await response.json()) as TmdbMovieDetail;
    if (!movie.title) return null;

    return {
      id: `tmdb-${movie.id}`,
      kind: 'movie',
      title: movie.title,
      creator: movie.genres?.map((g) => g.name).join(' · ') || 'TMDB Record',
      year: movie.release_date ? Number(movie.release_date.slice(0, 4)) : undefined,
      description: movie.overview || 'No overview is available from TMDB.',
      image: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : undefined,
      rating: movie.vote_average,
      provider: 'tmdb',
      externalId: String(movie.id),
    };
  } catch {
    return null;
  }
}
