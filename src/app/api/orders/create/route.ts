// This file is no longer used and is effectively replaced by /api/create-order
// It's kept here to avoid breaking any potential lingering references, but should be considered deprecated.
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({ message: 'This endpoint is deprecated. Please use /api/create-order.' }, { status: 404 });
}
