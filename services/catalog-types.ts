export type CatalogKind = 'movie' | 'book';

export type CatalogResult = {
  id: string;
  kind: CatalogKind;
  title: string;
  creator: string;
  year?: number;
  description: string;
  image?: string;
  rating?: number;
  provider: 'local' | 'tmdb' | 'google-books' | 'open-library';
  externalId?: string;
};

export type ProviderResult = {
  results: CatalogResult[];
  source: CatalogResult['provider'];
  stale?: boolean;
};
