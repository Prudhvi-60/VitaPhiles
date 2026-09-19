import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await db.tasteProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    return NextResponse.json({ profile: null });
  }

  return NextResponse.json({
    profile: {
      favoriteMovieGenres: JSON.parse(profile.favoriteMovieGenres),
      favoriteBookGenres: JSON.parse(profile.favoriteBookGenres),
      favoriteCreators: JSON.parse(profile.favoriteCreators),
      preferences: JSON.parse(profile.preferences),
    },
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { favoriteMovieGenres, favoriteBookGenres, favoriteCreators, preferences } = body;

    const profile = await db.tasteProfile.upsert({
      where: { userId: user.id },
      update: {
        favoriteMovieGenres: JSON.stringify(favoriteMovieGenres || []),
        favoriteBookGenres: JSON.stringify(favoriteBookGenres || []),
        favoriteCreators: JSON.stringify(favoriteCreators || []),
        preferences: JSON.stringify(preferences || {}),
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        favoriteMovieGenres: JSON.stringify(favoriteMovieGenres || []),
        favoriteBookGenres: JSON.stringify(favoriteBookGenres || []),
        favoriteCreators: JSON.stringify(favoriteCreators || []),
        preferences: JSON.stringify(preferences || {}),
      },
    });

    return NextResponse.json({
      success: true,
      profile: {
        favoriteMovieGenres: JSON.parse(profile.favoriteMovieGenres),
        favoriteBookGenres: JSON.parse(profile.favoriteBookGenres),
        favoriteCreators: JSON.parse(profile.favoriteCreators),
        preferences: JSON.parse(profile.preferences),
      },
    });
  } catch (error) {
    console.error('Update taste profile error:', error);
    return NextResponse.json({ error: 'Failed to update taste profile' }, { status: 500 });
  }
}
