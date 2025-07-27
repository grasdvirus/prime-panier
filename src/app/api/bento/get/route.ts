import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Bento } from '@/lib/bento';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bentoSnapshot = await adminDb.collection('bento').orderBy('id', 'asc').get();
    
    if (bentoSnapshot.empty) {
      return NextResponse.json([]);
    }
    
    const bentoItems: Bento[] = bentoSnapshot.docs.map(doc => doc.data() as Bento);
    return NextResponse.json(bentoItems);

  } catch (error) {
    console.error('Failed to get bento from Firestore:', error);
    return NextResponse.json({ message: 'Failed to retrieve bento items' }, { status: 500 });
  }
}
