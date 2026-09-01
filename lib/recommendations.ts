import type { Book, Movie } from '@/lib/mock-data';

export type TasteProfile = {
  favoriteMovieGenres: string[];
  favoriteBookGenres: string[];
  favoriteCreators: string[];
  preferences: {
    classics: boolean;
    hiddenGems: boolean;
    slowBurn: boolean;
    longForm: boolean;
    fiction: boolean;
  };
  consumedMovieIds: number[];
  consumedBookIds: number[];
};

export type Recommendation<T> = {
  item: T;
  score: number;
  reason: string;
};

export const defaultTasteProfile: TasteProfile = {
  favoriteMovieGenres: ['Science Fiction', 'Drama'],
  favoriteBookGenres: ['Science Fiction', 'Philosophy'],
  favoriteCreators: ['Christopher Nolan', 'Frank Herbert'],
  preferences: { classics: false, hiddenGems: true, slowBurn: true, longForm: true, fiction: true },
  consumedMovieIds: [2],
  consumedBookIds: [],
};

const overlap = (values: string[], preferences: string[]) =>
  values.filter((value) => preferences.some((preference) => value.toLowerCase() === preference.toLowerCase())).length;

const recommendationReason = (genres: string[], creator: string, profile: TasteProfile, crossMedium = false) => {
  const matchingGenre = genres.find((genre) =>
    [...profile.favoriteMovieGenres, ...profile.favoriteBookGenres].some((preference) => preference.toLowerCase() === genre.toLowerCase()),
  );
  if (profile.favoriteCreators.some((favorite) => favorite.toLowerCase() === creator.toLowerCase())) return `Because you follow ${creator}`;
  if (matchingGenre) return crossMedium ? `A bridge from your love of ${matchingGenre}` : `You frequently choose ${matchingGenre}`;
  if (profile.preferences.hiddenGems) return 'A quieter match beyond the obvious picks';
  return 'A strong community-rated match for your taste';
};

export function recommendMovies(movies: Movie[], profile: TasteProfile): Recommendation<Movie>[] {
  return movies
    .filter((movie) => !profile.consumedMovieIds.includes(movie.id))
    .map((movie) => {
      const genreScore = overlap(movie.genres, profile.favoriteMovieGenres) * 0.3;
      const creatorScore = profile.favoriteCreators.some((creator) => creator.toLowerCase() === movie.director.toLowerCase()) ? 0.2 : 0;
      const moodScore = profile.preferences.slowBurn && movie.mood.includes('Philosophical') ? 0.12 : 0;
      const classicScore = profile.preferences.classics && movie.year < 2000 ? 0.1 : 0;
      const hiddenGemScore = profile.preferences.hiddenGems ? (5 - movie.rating) * 0.03 : movie.rating * 0.02;
      return {
        item: movie,
        score: genreScore + creatorScore + moodScore + classicScore + hiddenGemScore,
        reason: recommendationReason(movie.genres, movie.director, profile),
      };
    })
    .sort((left, right) => right.score - left.score);
}

export function recommendBooks(books: Book[], profile: TasteProfile): Recommendation<Book>[] {
  return books
    .filter((book) => !profile.consumedBookIds.includes(book.id))
    .map((book) => {
      const genreScore = overlap(book.genres, profile.favoriteBookGenres) * 0.3;
      const creatorScore = profile.favoriteCreators.some((creator) => creator.toLowerCase() === book.author.toLowerCase()) ? 0.2 : 0;
      const moodScore = profile.preferences.slowBurn && book.mood.includes('Philosophical') ? 0.12 : 0;
      const classicScore = profile.preferences.classics && book.year < 2000 ? 0.1 : 0;
      const hiddenGemScore = profile.preferences.hiddenGems ? (5 - book.rating) * 0.03 : book.rating * 0.02;
      return {
        item: book,
        score: genreScore + creatorScore + moodScore + classicScore + hiddenGemScore,
        reason: recommendationReason(book.genres, book.author, profile, true),
      };
    })
    .sort((left, right) => right.score - left.score);
}

export function tasteSignals(profile: TasteProfile) {
  return [...new Set([...profile.favoriteMovieGenres, ...profile.favoriteBookGenres])].map((genre, index) => ({
    genre,
    value: Math.max(34, 94 - index * 11),
  }));
}