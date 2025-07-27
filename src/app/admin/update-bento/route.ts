import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Bento } from '@/lib/bento';

export async function POST(request: Request) {
  try {
    const bentoItems: Bento[] = await request.json();
    const batch = adminDb.batch();

    const collectionRef = adminDb.collection('bento');
    const snapshot = await collectionRef.get();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));

    bentoItems.forEach(item => {
      const docRef = collectionRef.doc(item.id.toString());
      batch.set(docRef, item);
    });
    
    await batch.commit();

    return NextResponse.json({ message: 'Bento items updated successfully' });
  } catch (error) {
    console.error('Failed to update bento items in Firestore:', error);
    return NextResponse.json({ message: 'Failed to update bento items' }, { status: 500 });
  }
}
