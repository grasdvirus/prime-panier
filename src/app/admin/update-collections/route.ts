import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Collection } from '@/lib/collections';

export async function POST(request: Request) {
  try {
    const collections: Collection[] = await request.json();
    const batch = adminDb.batch();

    const collectionRef = adminDb.collection('collections');
    const snapshot = await collectionRef.get();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    
    collections.forEach(item => {
        const docRef = collectionRef.doc(item.id.toString());
        batch.set(docRef, item);
    });

    await batch.commit();

    return NextResponse.json({ message: 'Collections updated successfully' });
  } catch (error) {
    console.error('Failed to update collections in Firestore:', error);
    return NextResponse.json({ message: 'Failed to update collections' }, { status: 500 });
  }
}
