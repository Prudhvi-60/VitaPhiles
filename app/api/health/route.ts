import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'healthy';
  let userCount = 0;
  let mediaCount = 0;

  try {
    userCount = await db.user.count();
    mediaCount = await db.mediaItem.count();
  } catch (error) {
    dbStatus = 'degraded';
    console.error('Health check DB error:', error);
  }

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: dbStatus === 'healthy' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbStatus,
          userCount,
          mediaCount,
        },
      },
      responseTimeMs,
    },
    {
      status: dbStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
