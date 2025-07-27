import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Message } from '@/app/api/contact/route';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const messagesSnapshot = await adminDb.collection('messages').orderBy('createdAt', 'desc').get();
    
    if (messagesSnapshot.empty) {
      return NextResponse.json([]);
    }
    
    const messages: Message[] = messagesSnapshot.docs.map(doc => doc.data() as Message);
    return NextResponse.json(messages);

  } catch (error) {
    console.error('Failed to get messages from Firestore:', error);
    return NextResponse.json({ message: 'Failed to retrieve messages' }, { status: 500 });
  }
}
