# VitaPhiles — Cinematic & Literary Discovery Platform

VitaPhiles is a personalized cinematic and literary discovery platform inspired by Goodreads and Letterboxd. Users can discover, track, rate, review, and organize books and movies, explore book ↔ movie adaptations, curate personal lists, and receive explainable algorithmic recommendations through **VitaPick**.

---

## Features

- **Authentication & User Profiles**: Secure JWT session management via HTTP-only cookies, password hashing with `bcryptjs`, registration, login, logout, and personalized taste profiles.
- **Universal Search & Metadata Integration**: Live server-side catalog search querying **TMDB** for movies and **Google Books** / **Open Library** for books, with automatic local fallback.
- **Library Shelves & Watchlists**: Mark books (*Want to Read*, *Currently Reading*, *Read*) and movies (*Watchlist*, *Watched*).
- **Ratings & Reviews**: 1–5 star interactive rating system and community/personal written review journal.
- **Personal Custom Lists**: Create, customize, and share personal collections (e.g. *Quiet Science Fiction*, *Rainy Day Movies*).
- **VitaPick Recommendation Engine**: Natural language recommendation engine utilizing user ratings, creator preferences, genre overlap, and mood signals.
- **Page ↔ Screen Crossovers**: Explore adaptations connecting books and their film counterpart (e.g. *Dune*, *The Great Gatsby*).
- **Story DNA & Insights**: Analytics dashboard measuring top genres, rating distribution, and media ratios.
- **Production Health Monitoring**: Built-in `/api/health` health check endpoint for zero-downtime deployments.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19, Tailwind CSS v4, Lucide React
- **Language**: TypeScript
- **Database & Persistence**: Prisma ORM with SQLite (local development) / PostgreSQL (production)
- **Authentication**: JWT (`jose`) in HTTP-only cookies + `bcryptjs`
- **Deployment**: Railway (Nixpacks / Node.js)

---

## Environment Variables

Copy `.env.example` to `.env` or set these variables in your deployment environment:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | Connection string (`file:./dev.db` locally or `postgresql://...` on Railway) |
| `JWT_SECRET` | **Yes** | Secret string for signing session JWT tokens |
| `NEXTAUTH_SECRET` | Optional | Fallback secret string for authentication |
| `TMDB_API_KEY` | Optional | Server-side TMDB API key for movie metadata & search |
| `GOOGLE_BOOKS_API_KEY` | Optional | Server-side Google Books API key for book metadata |

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Push database schema & seed initial data
npx prisma db push
npx prisma db seed

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Testing & Quality Checks

```bash
# Check TypeScript compilation and build production output
npm run build

# Run ESLint code quality checks
npm run lint

# Test production build locally
npm run start
```

---

## Deployment to Railway

This project is configured for seamless deployment to **Railway**:

1. Create a new project on [Railway](https://railway.app/).
2. Add a **PostgreSQL** service on Railway.
3. Connect your GitHub repository.
4. Set the environment variables in Railway:
   - `DATABASE_URL`: Set automatically by Railway PostgreSQL binding or paste connection string.
   - `JWT_SECRET`: Random 32+ character secure key.
   - `TMDB_API_KEY`: (Optional) Your TMDB API key.
   - `GOOGLE_BOOKS_API_KEY`: (Optional) Your Google Books API key.
5. Railway will automatically detect `railway.json`, run `npx prisma db push && npm run build`, start the server via `npm run start`, and monitor health at `/api/health`.
