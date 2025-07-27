import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Marquee } from '@/lib/marquee';

export async function POST(request: Request) {
  try {
    const marquee: Marquee = await request.json();
    const docRef = adminDb.collection('singletons').doc('marquee');
    await docRef.set(marquee);

    return NextResponse.json({ message: 'Marquee updated successfully' });
  } catch (error) {
    console.error('Failed to update marquee in Firestore:', error);
    return NextResponse.json({ message: 'Failed to update marquee' }, { status: 500 });
  }
}
