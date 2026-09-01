export type Movie = {
  id: number;
  title: string;
  year: number;
  genres: string[];
  rating: number;
  director: string;
  poster: string;
  description: string;
  mood: string[];
};

export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  genres: string[];
  rating: number;
  cover: string;
  description: string;
  mood: string[];
};

export const movies: Movie[] = [
  {
    id: 1,
    title: 'Dune: Part Two',
    year: 2024,
    genres: ['Science Fiction', 'Epic'],
    rating: 4.8,
    director: 'Denis Villeneuve',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
    description: 'A gripping continuation of a mythic struggle for power, memory, and destiny.',
    mood: ['Intense', 'Philosophical', 'Escapist'],
  },
  {
    id: 2,
    title: 'Interstellar',
    year: 2014,
    genres: ['Science Fiction', 'Adventure'],
    rating: 4.9,
    director: 'Christopher Nolan',
    poster: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80',
    description: 'A cosmic voyage that turns the search for home into something deeply human.',
    mood: ['Emotional', 'Thought-provoking', 'Hopeful'],
  },
  {
    id: 3,
    title: 'The Prestige',
    year: 2006,
    genres: ['Drama', 'Mystery'],
    rating: 4.7,
    director: 'Christopher Nolan',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    description: 'A duel of obsession, illusion, and sacrifice told through precision and yearning.',
    mood: ['Dark', 'Mystery', 'Intense'],
  },
  {
    id: 4,
    title: 'La La Land',
    year: 2016,
    genres: ['Romance', 'Musical'],
    rating: 4.5,
    director: 'Damien Chazelle',
    poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    description: 'An elegant love letter to ambition, art, and the painful beauty of choice.',
    mood: ['Romantic', 'Emotional', 'Hopeful'],
  },
];

export const books: Book[] = [
  {
    id: 1,
    title: 'Dune',
    author: 'Frank Herbert',
    year: 1965,
    genres: ['Science Fiction', 'Epic'],
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    description: 'A vast desert planet becomes the stage for prophecy, politics, and profound ecological thought.',
    mood: ['Thought-provoking', 'Dark', 'Escapist'],
  },
  {
    id: 2,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genres: ['Classic', 'Drama'],
    rating: 4.4,
    cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
    description: 'An intoxicating glimpse into glamour, longing, and the emptiness at the heart of desire.',
    mood: ['Romantic', 'Dark', 'Intense'],
  },
  {
    id: 3,
    title: 'The Name of the Rose',
    author: 'Umberto Eco',
    year: 1980,
    genres: ['Historical', 'Mystery'],
    rating: 4.6,
    cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
    description: 'A medieval abbey braces for murder while theology, logic, and evidence intertwine.',
    mood: ['Mystery', 'Philosophical', 'Dark'],
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: 1813,
    genres: ['Classic', 'Romance'],
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
    description: 'A bright, beautifully wry study of intelligence, pride, and the slow archaeology of love.',
    mood: ['Romantic', 'Funny', 'Thoughtful'],
  },
];

export const communityLists = [
  'Best Psychological Films',
  'Books That Destroyed Me Emotionally',
  'Rainy Day Movies',
  'Quiet Science Fiction',
];

export const moods = [
  'Comfort',
  'Dark',
  'Romantic',
  'Thought-provoking',
  'Funny',
  'Emotional',
  'Suspenseful',
  'Philosophical',
  'Escapist',
  'Mind-bending',
];
