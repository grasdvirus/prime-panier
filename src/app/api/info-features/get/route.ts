import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type InfoFeature } from '@/lib/info-features';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const featuresSnapshot = await adminDb.collection('infoFeatures').orderBy('id', 'asc').get();
    
    if (featuresSnapshot.empty) {
      return NextResponse.json([]);
    }
    
    const features: InfoFeature[] = featuresSnapshot.docs.map(doc => doc.data() as InfoFeature);
    return NextResponse.json(features);

  } catch (error) {
    console.error('Failed to get info features from Firestore:', error);
    return NextResponse.json({ message: 'Failed to retrieve info features' }, { status: 500 });
  }
}
