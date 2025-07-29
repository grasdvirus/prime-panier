import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type SiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

const defaultSettings: SiteSettings = {
  productsPerPage: 8,
};

export async function GET() {
  try {
    const settingsDoc = await adminDb.collection('singletons').doc('siteSettings').get();
    
    if (!settingsDoc.exists) {
      return NextResponse.json(defaultSettings);
    }
    
    const settings: SiteSettings = settingsDoc.data() as SiteSettings;
    return NextResponse.json({ ...defaultSettings, ...settings });

  } catch (error) {
    console.error('Failed to get settings from Firestore:', error);
    // Return default settings on error to avoid breaking the site
    return NextResponse.json(defaultSettings);
  }
}
