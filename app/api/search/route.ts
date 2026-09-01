import { NextResponse } from 'next/server';
import { searchCatalog } from '@/services/search-service';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  if (query.length > 160) return NextResponse.json({ error: 'Search query is too long.' }, { status: 400 });

  const result = await searchCatalog(query);
  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
