import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mediaItemId = url.searchParams.get('mediaItemId');

  try {
    const reviews = await db.review.findMany({
      where: mediaItemId ? { mediaItemId } : undefined,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        mediaItem: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { mediaItemId, content, rating } = body;

    if (!mediaItemId) {
      return NextResponse.json({ error: 'Media item ID is required.' }, { status: 400 });
    }

    if (!content && rating === undefined) {
      return NextResponse.json({ error: 'Either content or rating must be provided.' }, { status: 400 });
    }

    // Save rating if provided
    if (rating !== undefined && rating !== null) {
      const score = Math.max(1, Math.min(5, Number(rating)));
      await db.rating.upsert({
        where: {
          userId_mediaItemId: {
            userId: user.id,
            mediaItemId,
          },
        },
        update: { score },
        create: {
          userId: user.id,
          mediaItemId,
          score,
        },
      });

      // Recalculate average rating for the media item
      const aggregate = await db.rating.aggregate({
        where: { mediaItemId },
        _avg: { score: true },
      });

      if (aggregate._avg.score) {
        await db.mediaItem.update({
          where: { id: mediaItemId },
          data: { averageRating: aggregate._avg.score },
        });
      }
    }

    // Create review entry
    const review = await db.review.create({
      data: {
        userId: user.id,
        mediaItemId,
        content: content || '',
        rating: rating !== undefined ? Number(rating) : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const reviewId = url.searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const review = await db.review.findUnique({ where: { id: reviewId } });
    if (!review || review.userId !== user.id) {
      return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 });
    }

    await db.review.delete({ where: { id: reviewId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
