import 'server-only';
import { adminDb } from './firebase-admin';

export type Collection = {
  id: number;
  name: string;
  href: string;
  image: string;
  data_ai_hint: string;
};

async function fetchCollectionsOnServer(): Promise<Collection[]> {
    try {
        if (!adminDb) {
            console.error("Firestore is not initialized.");
            return [];
        }
        const collectionsSnapshot = await adminDb.collection('collections').orderBy('id', 'asc').get();
        if (collectionsSnapshot.empty) {
            return [];
        }
        return collectionsSnapshot.docs.map(doc => doc.data() as Collection);
    } catch (error) {
        console.error('Failed to fetch collections from Firestore:', error);
        return [];
    }
}

export async function getCollections(): Promise<Collection[]> {
  return await fetchCollectionsOnServer();
}
