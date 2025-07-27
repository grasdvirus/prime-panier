import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Slide } from '@/lib/slides';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slidesSnapshot = await adminDb.collection('slides').orderBy('id', 'asc').get();
    
    if (slidesSnapshot.empty) {
      return NextResponse.json([]);
    }
    
    const slides: Slide[] = slidesSnapshot.docs.map(doc => doc.data() as Slide);
    return NextResponse.json(slides);

  } catch (error) {
    console.error('Failed to get slides from Firestore:', error);
    return NextResponse.json({ message: 'Failed to retrieve slides' }, { status: 500 });
  }
}
