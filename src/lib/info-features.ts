import 'server-only';
import { adminDb } from './firebase-admin';

export type InfoFeature = {
  id: number;
  iconName: 'Lock' | 'Heart' | 'Phone';
  title: string;
  description: string;
};

async function fetchInfoFeaturesOnServer(): Promise<InfoFeature[]> {
    try {
        const featuresSnapshot = await adminDb.collection('infoFeatures').orderBy('id', 'asc').get();
        if (featuresSnapshot.empty) {
            return [];
        }
        return featuresSnapshot.docs.map(doc => doc.data() as InfoFeature);
    } catch (error) {
        console.error('Failed to fetch info features from Firestore:', error);
        return [];
    }
}

export async function getInfoFeatures(): Promise<InfoFeature[]> {
  return await fetchInfoFeaturesOnServer();
}
