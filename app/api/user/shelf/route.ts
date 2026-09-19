import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const items = await db.userLibrary.findMany({
      where: { userId: user.id },
      include: {
        mediaItem: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Fetch shelf error:', error);
    return NextResponse.json({ error: 'Failed to fetch library' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { mediaItemId, kind, externalId, provider, title, creator, year, description, image, genres, mood, status, action } = body;

    let targetMediaId = mediaItemId;

    // If mediaItemId isn't passed, find or create MediaItem by kind + externalId
    if (!targetMediaId && kind && (externalId || title)) {
      const existingMedia = await db.mediaItem.findFirst({
        where: {
          kind,
          externalId: externalId ? String(externalId) : title.toLowerCase(),
        },
      });

      if (existingMedia) {
        targetMediaId = existingMedia.id;
      } else {
        const createdMedia = await db.mediaItem.create({
          data: {
            kind,
            externalId: externalId ? String(externalId) : title.toLowerCase(),
            provider: provider || 'local',
            title: title || 'Untitled',
            creator: creator || 'Unknown',
            year: year ? Number(year) : undefined,
            description: description || '',
            image: image || '',
            genres: JSON.stringify(genres || []),
            mood: JSON.stringify(mood || []),
          },
        });
        targetMediaId = createdMedia.id;
      }
    }

    if (!targetMediaId) {
      return NextResponse.json({ error: 'Target media item is required.' }, { status: 400 });
    }

    if (action === 'remove') {
      await db.userLibrary.deleteMany({
        where: {
          userId: user.id,
          mediaItemId: targetMediaId,
        },
      });
      return NextResponse.json({ success: true, removed: true });
    }

    if (!status) {
      return NextResponse.json({ error: 'Shelf status is required.' }, { status: 400 });
    }

    const entry = await db.userLibrary.upsert({
      where: {
        userId_mediaItemId: {
          userId: user.id,
          mediaItemId: targetMediaId,
        },
      },
      update: {
        status,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        mediaItemId: targetMediaId,
        status,
      },
      include: {
        mediaItem: true,
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Update shelf error:', error);
    return NextResponse.json({ error: 'Failed to update library shelf' }, { status: 500 });
  }
}
