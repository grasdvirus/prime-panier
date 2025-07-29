import 'server-only';
import { adminDb } from './firebase-admin';

export type SiteSettings = {
  productsPerPage: number;
};

const defaultSettings: SiteSettings = {
  productsPerPage: 8,
};

async function fetchSettingsOnServer(): Promise<SiteSettings> {
    try {
        const settingsDoc = await adminDb.collection('singletons').doc('siteSettings').get();
        if (!settingsDoc.exists) {
            return defaultSettings;
        }
        const settings = settingsDoc.data() as SiteSettings;
        return { ...defaultSettings, ...settings };
    } catch (error) {
        console.error('Failed to fetch settings from Firestore:', error);
        return defaultSettings;
    }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return await fetchSettingsOnServer();
}
