import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Slide } from '@/lib/slides';

export async function POST(request: Request) {
  try {
    const slides: Slide[] = await request.json();
    const batch = adminDb.batch();

    const collectionRef = adminDb.collection('slides');
    const snapshot = await collectionRef.get();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));

    slides.forEach(item => {
        const docRef = collectionRef.doc(item.id.toString());
        batch.set(docRef, item);
    });

    await batch.commit();

    return NextResponse.json({ message: 'Slides updated successfully' });
  } catch (error) {
    console.error('Failed to update slides in Firestore:', error);
    return NextResponse.json({ message: 'Failed to update slides' }, { status: 500 });
  }
}
