import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const backendBase = process.env.BACKEND_URL || 'http://localhost:8000';
  const backendUrl = backendBase + '/upload/session-dataset-active';
  const res = await fetch(backendUrl, {
    headers: {
      cookie: req.headers.get('cookie') || '',
    },
    credentials: 'include',
  });
  const data = await res.json();
  return NextResponse.json(data);
}