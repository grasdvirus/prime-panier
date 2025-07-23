import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Collection } from '@/lib/collections';

export async function POST(request: Request) {
  try {
    const collections: Collection[] = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'collections.json');
    await fs.writeFile(filePath, JSON.stringify(collections, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Collections updated successfully' });
  } catch (error) {
    console.error('Failed to write collections.json:', error);
    return NextResponse.json({ message: 'Failed to update collections' }, { status: 500 });
  }
}
