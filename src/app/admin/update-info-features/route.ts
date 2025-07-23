import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type InfoFeature } from '@/lib/info-features';

export async function POST(request: Request) {
  try {
    const features: InfoFeature[] = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'info-features.json');
    await fs.writeFile(filePath, JSON.stringify(features, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Info features updated successfully' });
  } catch (error) {
    console.error('Failed to write info-features.json:', error);
    return NextResponse.json({ message: 'Failed to update info features' }, { status: 500 });
  }
}
