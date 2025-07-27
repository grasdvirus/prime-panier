import 'server-only';
import { adminDb } from './firebase-admin';

export type Bento = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  className: string;
  data_ai_hint: string;
};

async function fetchBentoOnServer(): Promise<Bento[]> {
    try {
        const bentoSnapshot = await adminDb.collection('bento').orderBy('id', 'asc').get();
        if (bentoSnapshot.empty) {
            return [];
        }
        return bentoSnapshot.docs.map(doc => doc.data() as Bento);
    } catch (error) {
        console.error('Failed to fetch bento from Firestore:', error);
        return [];
    }
}


export async function getBento(): Promise<Bento[]> {
  return await fetchBentoOnServer();
}
