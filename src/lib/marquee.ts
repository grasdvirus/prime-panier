import 'server-only';
import { adminDb } from './firebase-admin';

export type Marquee = {
  messages: string[];
};

async function fetchMarqueeOnServer(): Promise<Marquee> {
    try {
        if (!adminDb) {
            console.error("Firestore is not initialized.");
            return { messages: [] };
        }
        const marqueeDoc = await adminDb.collection('singletons').doc('marquee').get();
        if (!marqueeDoc.exists) {
            return { messages: [] };
        }
        return marqueeDoc.data() as Marquee;
    } catch (error) {
        console.error('Failed to fetch marquee from Firestore:', error);
        return { messages: [] };
    }
}

export async function getMarquee(): Promise<Marquee> {
  return await fetchMarqueeOnServer();
}
