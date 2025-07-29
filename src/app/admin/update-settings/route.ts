import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type SiteSettings } from '@/lib/settings';

export async function POST(request: Request) {
  try {
    const settings: SiteSettings = await request.json();
    const docRef = adminDb.collection('singletons').doc('siteSettings');
    await docRef.set(settings, { merge: true });

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Failed to update settings in Firestore:', error);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}
