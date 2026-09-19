import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSessionToken, hashPassword, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, name, password } = body;

    if (!email || !username || !name || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
      },
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return NextResponse.json({ error: 'Email address is already registered.' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Username is already taken.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        name: name.trim(),
        passwordHash,
        tasteProfile: {
          create: {
            favoriteMovieGenres: JSON.stringify(['Science Fiction', 'Drama']),
            favoriteBookGenres: JSON.stringify(['Science Fiction', 'Philosophy']),
            favoriteCreators: JSON.stringify([]),
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
      include: {
        tasteProfile: true,
      },
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    await setSessionCookie(token);

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      tasteProfile: user.tasteProfile,
    };
    return NextResponse.json({ user: safeUser, success: true }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 });
  }
}
