import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Slide } from '@/lib/slides';

export async function POST(request: Request) {
  try {
    const slides: Slide[] = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'slides.json');
    await fs.writeFile(filePath, JSON.stringify(slides, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Slides updated successfully' });
  } catch (error) {
    console.error('Failed to write slides.json:', error);
    return NextResponse.json({ message: 'Failed to update slides' }, { status: 500 });
  }
}
