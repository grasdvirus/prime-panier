import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Message } from '@/app/api/contact/route';

export async function POST(request: Request) {
  try {
    const messages: Message[] = await request.json();
    const batch = adminDb.batch();

    const collectionRef = adminDb.collection('messages');
    
    // This is a simple but potentially inefficient way to update all messages.
    // A more robust solution might update only changed messages.
    // For now, this replaces the entire collection.
    const snapshot = await collectionRef.get();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    
    messages.forEach(msg => {
        const docRef = collectionRef.doc(msg.id);
        batch.set(docRef, msg);
    });

    await batch.commit();

    return NextResponse.json({ message: 'Messages updated successfully' });
  } catch (error) {
    console.error('Failed to update messages in Firestore:', error);
    return NextResponse.json({ message: 'Failed to update messages' }, { status: 500 });
  }
}
