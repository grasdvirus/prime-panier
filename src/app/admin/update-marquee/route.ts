import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Marquee } from '@/lib/marquee';

export async function POST(request: Request) {
  try {
    const marquee: Marquee = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'marquee.json');
    await fs.writeFile(filePath, JSON.stringify(marquee, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Marquee updated successfully' });
  } catch (error) {
    console.error('Failed to write marquee.json:', error);
    return NextResponse.json({ message: 'Failed to update marquee' }, { status: 500 });
  }
}
