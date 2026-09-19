import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const list = await db.personalList.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        items: {
          include: {
            mediaItem: true,
          },
          orderBy: { addedAt: 'desc' },
        },
      },
    });

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({ list });
  } catch (error) {
    console.error('Get list detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch list' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: listId } = await params;

  try {
    const list = await db.personalList.findUnique({ where: { id: listId } });
    if (!list || list.userId !== user.id) {
      return NextResponse.json({ error: 'List not found or unauthorized' }, { status: 404 });
    }

    const body = await request.json();
    const { mediaItemId, note, action } = body;

    if (action === 'remove_item') {
      if (!mediaItemId) return NextResponse.json({ error: 'mediaItemId required' }, { status: 400 });
      await db.listItem.deleteMany({
        where: {
          listId,
          mediaItemId,
        },
      });
      return NextResponse.json({ success: true, removed: true });
    }

    if (!mediaItemId) {
      return NextResponse.json({ error: 'mediaItemId is required.' }, { status: 400 });
    }

    const item = await db.listItem.upsert({
      where: {
        listId_mediaItemId: {
          listId,
          mediaItemId,
        },
      },
      update: {
        note,
      },
      create: {
        listId,
        mediaItemId,
        note,
      },
      include: {
        mediaItem: true,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Modify list items error:', error);
    return NextResponse.json({ error: 'Failed to update list' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: listId } = await params;

  try {
    const list = await db.personalList.findUnique({ where: { id: listId } });
    if (!list || list.userId !== user.id) {
      return NextResponse.json({ error: 'List not found or unauthorized' }, { status: 404 });
    }

    await db.personalList.delete({ where: { id: listId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete list error:', error);
    return NextResponse.json({ error: 'Failed to delete list' }, { status: 500 });
  }
}
