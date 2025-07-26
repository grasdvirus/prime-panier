import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Message } from '@/app/api/contact/route';

export async function POST(request: Request) {
  try {
    const messages: Message[] = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'messages.json');
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Messages updated successfully' });
  } catch (error) {
    console.error('Failed to write messages.json:', error);
    return NextResponse.json({ message: 'Failed to update messages' }, { status: 500 });
  }
}
