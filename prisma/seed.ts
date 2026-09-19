import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding VitaPhiles database...');

  // 1. Create Demo User
  const hashedPassword = await hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'jordan@vitaphiles.com' },
    update: {},
    create: {
      email: 'jordan@vitaphiles.com',
      username: 'jordan',
      passwordHash: hashedPassword,
      name: 'Jordan D.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'A reader of worlds, a watcher of futures, and a collector of stories that leave a mark.',
      tasteProfile: {
        create: {
          favoriteMovieGenres: JSON.stringify(['Science Fiction', 'Drama', 'Mystery']),
          favoriteBookGenres: JSON.stringify(['Science Fiction', 'Philosophy', 'Classic']),
          favoriteCreators: JSON.stringify(['Christopher Nolan', 'Frank Herbert', 'Denis Villeneuve']),
          preferences: JSON.stringify({
            classics: false,
            hiddenGems: true,
            slowBurn: true,
            longForm: true,
            fiction: true,
          }),
        },
      },
    },
  });

  // 2. Seed Movies
  const movieDune = await prisma.mediaItem.upsert({
    where: { kind_externalId: { kind: 'movie', externalId: '1' } },
    update: {},
    create: {
      kind: 'movie',
      externalId: '1',
      provider: 'local',
      title: 'Dune: Part Two',
      creator: 'Denis Villeneuve',
      year: 2024,
      description: 'A gripping continuation of a mythic struggle for power, memory, and destiny on Arrakis.',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
      genres: JSON.stringify(['Science Fiction', 'Epic', 'Adventure']),
      mood: JSON.stringify(['Intense', 'Philosophical', 'Escapist']),
      averageRating: 4.8,
    },
  });

  const movieInterstellar = await prisma.mediaItem.upsert({
    where: { kind_externalId: { kind: 'movie', externalId: '2' } },
    update: {},
    create: {
      kind: 'movie',
      externalId: '2',
      provider: 'local',
      title: 'Interstellar',
      creator: 'Christopher Nolan',
      year: 2014,
      description: 'A cosmic voyage through wormholes that turns the search for home into something deeply human.',
      image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80',
      genres: JSON.stringify(['Science Fiction', 'Adventure', 'Drama']),
      mood: JSON.stringify(['Emotional', 'Thought-provoking', 'Hopeful']),
      averageRating: 4.9,
    },
  });

  const moviePrestige = await prisma.mediaItem.upsert({
    where: { kind_externalId: { kind: 'movie', externalId: '3' } },
    update: {},
    create: {
      kind: 'movie',
      externalId: '3',
      provider: 'local',
      title: 'The Prestige',
      creator: 'Christopher Nolan',
      year: 2006,
      description: 'A duel of obsession, illusion, and sacrifice told through precision, rivalry, and yearning.',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
      genres: JSON.stringify(['Drama', 'Mystery', 'Sci-Fi']),
      mood: JSON.stringify(['Dark', 'Mystery', 'Intense']),
      averageRating: 4.7,
    },
  });

  await prisma.mediaItem.upsert({
    where: { kind_externalId: { kind: 'movie', externalId: '4' } },
    update: {},
    create: {
      kind: 'movie',
      externalId: '4',
      provider: 'local',
      title: 'La La Land',
      creator: 'Damien Chazelle',
      year: 2016,
      description: 'An elegant love letter to ambition, art, and the painful beauty of choice.',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      genres: JSON.stringify(['Romance', 'Musical', 'Drama']),
      mood: JSON.stringify(['Romantic', 'Emotional', 'Hopeful']),
      averageRating: 4.5,
    },
  });

  // 3. Seed Books
  const bookDune = await prisma.mediaItem.upsert({
    where: { kind_externalId: { kind: 'book', externalId: '1' } },
    update: {},
    create: {
      kind: 'book',
      externalId: '1',
      provider: 'local',
      title: 'Dune',
      creator: 'Frank Herbert',
      year: 1965,
      description: 'A vast desert planet becomes the stage for prophecy, politics, and profound ecological thought.',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
      genres: JSON.stringify(['Science Fiction', 'Epic', 'Philosophy']),
      mood: JSON.stringify(['Thought-provoking', 'Dark', 'Escapist']),
      averageRating: 4.9,
    },
  });

  await prisma.mediaItem.upsert({
    where: { kind_externalId: { kind: 'book', externalId: '2' } },
    update: {},
    create: {
      kind: 'book',
      externalId: '2',
      provider: 'local',
      title: 'The Great Gatsby',
      creator: 'F. Scott Fitzgerald',
      year: 1925,
      description: 'An intoxicating glimpse into glamour, longing, and the emptiness at the heart of desire.',
      image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
      genres: JSON.stringify(['Classic', 'Drama', 'Romance']),
      mood: JSON.stringify(['Romantic', 'Dark', 'Intense']),
      averageRating: 4.4,
    },
  });

  await prisma.mediaItem.upsert({
    where: { kind_externalId: { kind: 'book', externalId: '3' } },
    update: {},
    create: {
      kind: 'book',
      externalId: '3',
      provider: 'local',
      title: 'The Name of the Rose',
      creator: 'Umberto Eco',
      year: 1980,
      description: 'A medieval abbey braces for murder while theology, logic, and evidence intertwine.',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
      genres: JSON.stringify(['Historical', 'Mystery', 'Philosophy']),
      mood: JSON.stringify(['Mystery', 'Philosophical', 'Dark']),
      averageRating: 4.6,
    },
  });

  await prisma.mediaItem.upsert({
    where: { kind_externalId: { kind: 'book', externalId: '4' } },
    update: {},
    create: {
      kind: 'book',
      externalId: '4',
      provider: 'local',
      title: 'Pride and Prejudice',
      creator: 'Jane Austen',
      year: 1813,
      description: 'A bright, beautifully wry study of intelligence, pride, and the slow archaeology of love.',
      image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
      genres: JSON.stringify(['Classic', 'Romance']),
      mood: JSON.stringify(['Romantic', 'Funny', 'Thoughtful']),
      averageRating: 4.7,
    },
  });

  // 4. Adaptations (Crossover Relationships)
  await prisma.adaptation.upsert({
    where: { bookId_movieId: { bookId: bookDune.id, movieId: movieDune.id } },
    update: {},
    create: {
      bookId: bookDune.id,
      movieId: movieDune.id,
      title: 'Cinematic Adaptations of Arrakis',
      notes: 'Denis Villeneuve’s stunning cinematic adaptation of Frank Herbert’s sci-fi epic.',
    },
  });

  // 5. User Library Entries & Ratings
  await prisma.userLibrary.upsert({
    where: { userId_mediaItemId: { userId: user.id, mediaItemId: movieInterstellar.id } },
    update: {},
    create: {
      userId: user.id,
      mediaItemId: movieInterstellar.id,
      status: 'watched',
      progress: 100,
    },
  });

  await prisma.userLibrary.upsert({
    where: { userId_mediaItemId: { userId: user.id, mediaItemId: bookDune.id } },
    update: {},
    create: {
      userId: user.id,
      mediaItemId: bookDune.id,
      status: 'currently_reading',
      progress: 41,
    },
  });

  await prisma.userLibrary.upsert({
    where: { userId_mediaItemId: { userId: user.id, mediaItemId: movieDune.id } },
    update: {},
    create: {
      userId: user.id,
      mediaItemId: movieDune.id,
      status: 'currently_watching',
      progress: 68,
    },
  });

  await prisma.rating.upsert({
    where: { userId_mediaItemId: { userId: user.id, mediaItemId: movieInterstellar.id } },
    update: {},
    create: {
      userId: user.id,
      mediaItemId: movieInterstellar.id,
      score: 5.0,
    },
  });

  await prisma.review.create({
    data: {
      userId: user.id,
      mediaItemId: movieInterstellar.id,
      content: 'A masterpiece of emotional science fiction. Hans Zimmer score gives me goosebumps every single time.',
      rating: 5.0,
    },
  });

  // 6. Personal Custom Lists
  const list = await prisma.personalList.create({
    data: {
      userId: user.id,
      title: 'Quiet Science Fiction & Philosophical Escapes',
      description: 'Movies and books that demand quiet attention and offer lingering questions.',
      isPublic: true,
      items: {
        create: [
          { mediaItemId: movieInterstellar.id, note: 'Human resilience meets infinite space.' },
          { mediaItemId: bookDune.id, note: 'Ecological and political masterpiece.' },
          { mediaItemId: moviePrestige.id, note: 'Atmospheric duel of devotion.' },
        ],
      },
    },
  });

  console.log(`Seeding complete. User created: ${user.email}, Lists created: ${list.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
