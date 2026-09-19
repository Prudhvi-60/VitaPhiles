import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const lists = await db.personalList.findMany({
      where: user ? { OR: [{ isPublic: true }, { userId: user.id }] } : { isPublic: true },
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
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ lists });
  } catch (error) {
    console.error('Fetch lists error:', error);
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, isPublic } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: 'List title is required.' }, { status: 400 });
    }

    const list = await db.personalList.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description ? description.trim() : null,
        isPublic: isPublic ?? true,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, list });
  } catch (error) {
    console.error('Create list error:', error);
    return NextResponse.json({ error: 'Failed to create list' }, { status: 500 });
  }
}
