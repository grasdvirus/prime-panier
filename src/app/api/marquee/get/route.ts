import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Marquee } from '@/lib/marquee';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const marqueeDoc = await adminDb.collection('singletons').doc('marquee').get();
    
    if (!marqueeDoc.exists) {
      return NextResponse.json({ messages: [] });
    }
    
    const marquee: Marquee = marqueeDoc.data() as Marquee;
    return NextResponse.json(marquee);

  } catch (error) {
    console.error('Failed to get marquee from Firestore:', error);
    return NextResponse.json({ message: 'Failed to retrieve marquee data' }, { status: 500 });
  }
}
