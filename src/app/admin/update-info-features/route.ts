import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type InfoFeature } from '@/lib/info-features';

export async function POST(request: Request) {
  try {
    const features: InfoFeature[] = await request.json();
    const batch = adminDb.batch();

    const collectionRef = adminDb.collection('infoFeatures');
    const snapshot = await collectionRef.get();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));

    features.forEach(item => {
        const docRef = collectionRef.doc(item.id.toString());
        batch.set(docRef, item);
    });
    
    await batch.commit();

    return NextResponse.json({ message: 'Info features updated successfully' });
  } catch (error) {
    console.error('Failed to update info features in Firestore:', error);
    return NextResponse.json({ message: 'Failed to update info features' }, { status: 500 });
  }
}
