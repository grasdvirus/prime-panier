import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Collection } from '@/lib/collections';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const collectionsSnapshot = await adminDb.collection('collections').orderBy('id', 'asc').get();
    
    if (collectionsSnapshot.empty) {
      return NextResponse.json([]);
    }
    
    const collections: Collection[] = collectionsSnapshot.docs.map(doc => doc.data() as Collection);
    return NextResponse.json(collections);

  } catch (error) {
    console.error('Failed to get collections from Firestore:', error);
    return NextResponse.json({ message: 'Failed to retrieve collections' }, { status: 500 });
  }
}
