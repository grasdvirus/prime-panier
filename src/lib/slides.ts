import 'server-only';
import { adminDb } from './firebase-admin';

export type Slide = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  data_ai_hint: string;
};

async function fetchSlidesOnServer(): Promise<Slide[]> {
    try {
        if (!adminDb) {
            console.error("Firestore is not initialized.");
            return [];
        }
        const slidesSnapshot = await adminDb.collection('slides').orderBy('id', 'asc').get();
        if (slidesSnapshot.empty) {
            return [];
        }
        return slidesSnapshot.docs.map(doc => doc.data() as Slide);
    } catch (error) {
        console.error('Failed to fetch slides from Firestore:', error);
        return [];
    }
}


export async function getSlides(): Promise<Slide[]> {
  return await fetchSlidesOnServer();
}
