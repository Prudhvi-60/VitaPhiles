# VitaPhiles

VitaPhiles is a cinematic and literary discovery interface for browsing a curated movie and book catalog, with cross-medium detail pages, personalized local recommendations, and server-side live search.

## Current scope

This repository is still frontend-first and has no database, authentication, persistence, or automated test suite. It now includes a server-side search route that queries TMDB for movies and Google Books with Open Library fallback for books. Without provider credentials, it falls back to the deterministic catalog in `lib/mock-data.ts`.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React

## Live search configuration

Copy `.env.example` to `.env.local` and add provider credentials when live search is needed:

- `TMDB_API_KEY`: server-side TMDB API key for movie search
- `GOOGLE_BOOKS_API_KEY`: optional Google Books key; public quota may work without it
- `OPEN_LIBRARY_BASE_URL`: documented provider URL, reserved for future configurable provider routing

The UI calls `/api/search`, never the providers directly. Requests are debounced in the browser, capped in length, timeout-protected, cached by Next.js where possible, deduplicated by provider IDs, and labeled when results may be stale.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Validation

```bash
npm run lint
npm run build
```

## Project structure

- `app/`: routes, root layout, global metadata, and detail pages
- `components/`: shared header, search field, section headings, and media cards
- `lib/mock-data.ts`: typed deterministic catalog used by the current prototype
- `services/`: normalized provider adapters and catalog search orchestration

## Production roadmap

Before launch, add a server-side data layer and migrations, authentication and authorization, persistent external-ID catalog records, persisted libraries/ratings/reviews/lists, rate limiting, background recommendation caching, AI reasoning over verified entities, end-to-end tests, and private/public SEO rules. Keep provider credentials server-only.
