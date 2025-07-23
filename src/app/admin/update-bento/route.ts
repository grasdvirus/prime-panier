import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Bento } from '@/lib/bento';

export async function POST(request: Request) {
  try {
    const bentoItems: Bento[] = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'bento.json');
    await fs.writeFile(filePath, JSON.stringify(bentoItems, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Bento items updated successfully' });
  } catch (error) {
    console.error('Failed to write bento.json:', error);
    return NextResponse.json({ message: 'Failed to update bento items' }, { status: 500 });
  }
}
